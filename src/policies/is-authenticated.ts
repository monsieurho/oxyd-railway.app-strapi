/**
 * is-authenticated policy
 */

import { getAuth } from "firebase-admin/auth";
import type { Context } from "koa";

export default async (policyContext: Context, config, { strapi }) => {
  try {
    // Get the token from the Authorization header
    const authHeader = policyContext.request.header.authorization;
    console.log("Auth header received:", authHeader ? "Present" : "Missing");

    const token = authHeader?.replace("Bearer ", "");
    if (!token) {
      console.error("Authentication failed: No token provided");
      return false;
    }

    try {
      // Verify the Firebase token
      console.log("Attempting to verify Firebase token...");
      const decodedToken = await getAuth().verifyIdToken(token);
      console.log("Token verified successfully for UID:", decodedToken.uid);
      policyContext.state.user = decodedToken;

      // Update last login time in profile
      console.log(
        "Looking for existing profile with FirebaseUID:",
        decodedToken.uid
      );
      const profile = await strapi.db.query("api::profile.profile").findOne({
        where: { FirebaseUID: decodedToken.uid },
      });

      if (profile) {
        console.log("Updating last login for profile ID:", profile.id);
        await strapi.entityService.update("api::profile.profile", profile.id, {
          data: {
            lastLogin: new Date(),
          },
        });
        console.log("Last login updated successfully");
      } else {
        console.log("No existing profile found for this Firebase UID");
      }

      return true;
    } catch (error) {
      console.error("Firebase token verification failed:", {
        error: error instanceof Error ? error.message : error,
        stack: error instanceof Error ? error.stack : undefined,
        token: token.substring(0, 10) + "...", // Log first 10 chars of token for debugging
      });
      return false;
    }
  } catch (error) {
    console.error("Authentication policy error:", {
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
      path: policyContext.request.url,
      method: policyContext.request.method,
      headers: policyContext.request.headers,
    });
    return false;
  }
};
