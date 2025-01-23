export default {
  routes: [
    {
      method: "POST",
      path: "/users/sync",
      handler: "profile.sync",
      config: {
        policies: ["global::is-authenticated"],
        description: "Sync user data from Firebase",
        tag: {
          plugin: "users",
          name: "User Sync",
        },
      },
    },
  ],
};
