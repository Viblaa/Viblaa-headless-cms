'use strict';

module.exports = {
  // Before delete user, cascade delete related profiles
  async beforeDelete(event) {
    const { where, select, populate } = event.params;
    const userId = where.id;
    
    if (!userId) {
      return;
    }
    
    try {
      strapi.log.info(`Attempting to delete user ${userId} - checking for related profiles`);
      
      // Check for related profiles before deletion
      const vendorProfiles = await strapi.entityService.findMany('api::vendor.vendor', {
        filters: { user: userId },
      });
      
      const influencerProfiles = await strapi.entityService.findMany('api::influencer.influencer', {
        filters: { user: userId },
      });
      
      const buyerProfiles = await strapi.entityService.findMany('api::buyer.buyer', {
        filters: { user: userId },
      });
      
      // Delete related profiles first (cascade deletion)
      if (vendorProfiles && vendorProfiles.length > 0) {
        for (const vendor of vendorProfiles) {
          await strapi.entityService.delete('api::vendor.vendor', vendor.id);
          strapi.log.info(`Deleted vendor profile ${vendor.id} for user ${userId}`);
        }
      }
      
      if (influencerProfiles && influencerProfiles.length > 0) {
        for (const influencer of influencerProfiles) {
          await strapi.entityService.delete('api::influencer.influencer', influencer.id);
          strapi.log.info(`Deleted influencer profile ${influencer.id} for user ${userId}`);
        }
      }
      
      if (buyerProfiles && buyerProfiles.length > 0) {
        for (const buyer of buyerProfiles) {
          await strapi.entityService.delete('api::buyer.buyer', buyer.id);
          strapi.log.info(`Deleted buyer profile ${buyer.id} for user ${userId}`);
        }
      }
      
      strapi.log.info(`Successfully deleted all related profiles for user ${userId}`);
      
    } catch (err) {
      strapi.log.error(`Error deleting related profiles for user ${userId}:`, err);
      throw new Error('Failed to delete user profiles. Cannot proceed with user deletion.');
    }
  },

  // After delete user
  async afterDelete(event) {
    const { where } = event.params;
    const userId = where.id;
    
    strapi.log.info(`Successfully completed cascade deletion for user ${userId}`);
  }
};