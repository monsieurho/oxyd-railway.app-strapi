/**
 * profile router
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreRouter("api::profile.profile", {
  config: {
    find: {
      policies: ["global::is-authenticated"],
    },
    findOne: {
      policies: ["global::is-authenticated"],
    },
    create: {
      policies: ["global::is-authenticated"],
    },
    update: {
      policies: ["global::is-authenticated"],
    },
    delete: {
      policies: ["global::is-authenticated"],
    },
  },
  only: ["find", "findOne", "create", "update", "delete"],
  except: [],
});
