/**
 * profile service
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreService('api::profile.profile', ({ strapi }) => ({
  // Custom service methods
  async findByFirebaseUID(firebaseUID: string) {
    return await strapi.db.query('api::profile.profile').findOne({
      where: { FirebaseUID: firebaseUID }
    });
  },

  async updateOnlineStatus(id: number, isOnline: boolean) {
    return await strapi.entityService.update('api::profile.profile', id, {
      data: {
        isOnline,
        lastSeen: new Date()
      }
    });
  }
})); 