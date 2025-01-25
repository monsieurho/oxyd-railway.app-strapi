/**
 * is-authenticated policy
 */

import { getAuth } from "firebase-admin/auth";
import type { Context } from "koa";

export default async (policyContext: Context, config, { strapi }) => {
  try {
    // Get the token from the Authorization header
    const token = policyContext.request.header.authorization?.replace(
      "Bearer ",
      ""
    );

    if (!token) {
      return false;
    }

    // First try to verify as Firebase token
    try {
      const decodedToken = await getAuth().verifyIdToken(token);
      policyContext.state.user = decodedToken;

      // Update last login time in profile
      const profile = await strapi.db.query("api::profile.profile").findOne({
        where: { FirebaseUID: decodedToken.uid },
      });

      if (profile) {
        await strapi.entityService.update("api::profile.profile", profile.id, {
          data: {
            lastLogin: new Date(),
          },
        });
      }

      return true;
    } catch (firebaseError) {
      // If Firebase verification fails, check if it's a valid Strapi token
      try {
        if (token === process.env.STRAPI_TOKEN) {
          policyContext.state.user = { type: "strapi-api" };
          return true;
        }
      } catch (strapiError) {
        console.error("Strapi token verification failed:", strapiError);
      }

      console.error("Firebase token verification failed:", firebaseError);
      return false;
    }
  } catch (error) {
    console.error("Authentication policy error:", error);
    return false;
  }
};
