/**
 * is-authenticated policy
 */

import { getAuth } from "firebase-admin/auth";
import type { Context } from "koa";

export default async (policyContext: Context, config, { strapi }) => {
  try {
    // Get the Firebase token from the Authorization header
    const token = policyContext.request.header.authorization?.replace(
      "Bearer ",
      ""
    );

    if (!token) {
      return false;
    }

    try {
      // Verify the Firebase token
      const decodedToken = await getAuth().verifyIdToken(token);

      // Add the verified user data to the context state
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
    } catch (error) {
      console.error("Firebase token verification failed:", error);
      return false;
    }
  } catch (error) {
    console.error("Authentication policy error:", error);
    return false;
  }
};
