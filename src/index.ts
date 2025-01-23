// import type { Core } from '@strapi/strapi';
import { initializeApp, cert } from "firebase-admin/app";

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register({ strapi }) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap({ strapi }) {
    // Initialize Firebase Admin if not already initialized
    try {
      // Get the service account from the plugins config which already handles Railway env vars
      const firebaseConfig = strapi.config.get("plugin.upload").providerOptions;

      if (!firebaseConfig?.serviceAccount) {
        throw new Error("Firebase configuration not found");
      }

      initializeApp({
        credential: cert(firebaseConfig.serviceAccount),
      });
    } catch (error) {
      console.error("Failed to initialize Firebase Admin:", error);
      throw error;
    }
  },
};
