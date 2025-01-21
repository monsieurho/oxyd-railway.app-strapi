export default ({ env }) => ({
  "users-permissions": {
    config: {
      jwtSecret: env("JWT_SECRET"),
    },
  },
  upload: {
    config: {
      provider: "strapi-provider-firebase-storage",
      providerOptions: {
        serviceAccount: JSON.parse(env("FIREBASE_SERVICE_ACCOUNT", "{}")),
        bucket: env("STORAGE_BUCKET_URL"),
        sortInStorage: true,
        debug: false,
      },
    },
  },
});
