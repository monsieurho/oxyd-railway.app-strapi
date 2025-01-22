interface ServiceAccount {
  project_id: string;
  client_email: string;
  private_key: string;
  [key: string]: any;
}

export default ({ env }) => {
  // Create a placeholder object for your service account
  let serviceAccount: ServiceAccount = {
    project_id: "",
    client_email: "",
    private_key: "",
  };

  // Attempt to parse the FIREBASE_SERVICE_ACCOUNT string from Railway
  try {
    const rawServiceAccount = env("FIREBASE_SERVICE_ACCOUNT");
    if (rawServiceAccount) {
      // Remove quotes that might be added automatically
      const cleanJson = rawServiceAccount.replace(/^["']|["']$/g, "");
      // Parse the service account JSON string into an object
      serviceAccount = JSON.parse(cleanJson);
    }
  } catch (error) {
    console.error("Error parsing FIREBASE_SERVICE_ACCOUNT:", error);
    // Throwing so Strapi clearly fails if credentials are invalid
    throw error;
  }

  // Use environment variable with fallback to project-based name
  const bucketName =
    env("STORAGE_BUCKET_URL") ||
    `${serviceAccount.project_id}.firebasestorage.app`;

  // Return the plugin configuration for Firebase Storage
  return {
    "users-permissions": {
      config: {
        jwtSecret: env("JWT_SECRET"),
      },
    },
    upload: {
      config: {
        // Specify the Firebase Storage provider
        provider: "strapi-provider-firebase-storage",
        providerOptions: {
          // Supply the parsed service account credentials
          serviceAccount,
          // Assign the bucket name without any "gs://" prefix
          bucket: bucketName,
          // Keep sort for clarity in file structure
          sortInStorage: true,
          // Enables debug logging
          debug: true,
        },
      },
    },
  };
};
