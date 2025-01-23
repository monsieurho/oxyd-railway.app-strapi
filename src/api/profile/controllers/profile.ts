/**
 * profile controller
 */

import { factories } from "@strapi/strapi";
import { AuthProvider } from "../../../types/auth";
import { getAuth } from "firebase-admin/auth";
import type { Context } from "koa";

export default factories.createCoreController(
  "api::profile.profile",
  ({ strapi }) => ({
    // Custom controller methods
    async findOrCreate(ctx) {
      try {
        // Get Firebase user from request (assuming you have middleware to verify Firebase token)
        const firebaseUser = ctx.state.user;

        // Try to find existing profile
        let profile = await strapi.db.query("api::profile.profile").findOne({
          where: { FirebaseUID: firebaseUser.uid },
        });

        // If no profile exists, create one
        if (!profile) {
          profile = await strapi.entityService.create("api::profile.profile", {
            data: {
              FirebaseUID: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              // Set initial values based on auth provider
              ...(firebaseUser.providerData?.[0]?.providerId ===
                AuthProvider.GOOGLE && {
                googleProfile: {
                  googleId: firebaseUser.uid,
                  email: firebaseUser.email,
                  displayName: firebaseUser.displayName,
                  photoUrl: firebaseUser.photoURL,
                },
              }),
            },
          });
        }

        return { data: profile };
      } catch (error) {
        ctx.throw(500, error);
      }
    },

    async updateSocialProfile(ctx) {
      try {
        const { id } = ctx.params;
        const { provider, profileData } = ctx.request.body;

        const profile = await strapi.entityService.update(
          "api::profile.profile",
          id,
          {
            data: {
              [`${provider}Profile`]: profileData,
            },
          }
        );

        return { data: profile };
      } catch (error) {
        ctx.throw(500, error);
      }
    },

    /**
     * Sync user data from Firebase
     * POST /api/users/sync
     */
    async sync(ctx: Context) {
      try {
        const token = ctx.request.header.authorization?.replace("Bearer ", "");

        if (!token) {
          return ctx.badRequest("No authorization token provided");
        }

        const decodedToken = await getAuth().verifyIdToken(token);

        let profile = await strapi.db.query("api::profile.profile").findOne({
          where: { FirebaseUID: decodedToken.uid },
        });

        const userData = {
          FirebaseUID: decodedToken.uid,
          displayName:
            decodedToken.name || decodedToken.email?.split("@")[0] || "",
          email: decodedToken.email,
          lastLogin: new Date(),
          ...(decodedToken.firebase.sign_in_provider === "twitter.com" && {
            xProfile: {
              handle: decodedToken.screen_name || "",
              photoUrl: decodedToken.picture || "",
              displayName: decodedToken.name || "",
            },
          }),
        };

        if (profile) {
          profile = await strapi.entityService.update(
            "api::profile.profile",
            profile.id,
            {
              data: userData,
            }
          );
        } else {
          profile = await strapi.entityService.create("api::profile.profile", {
            data: userData,
          });
        }

        return { data: profile };
      } catch (error) {
        return ctx.badRequest("Failed to sync user profile");
      }
    },
  })
);
