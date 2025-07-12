'use strict';

module.exports = {
  // Before delete vendor, we could add additional business logic here
  async beforeDelete(event) {
    const { where } = event.params;
    
    // Log the deletion for audit purposes
    strapi.log.info(`Attempting to delete vendor with ID: ${where.id}`);
    
    // You could add business logic here like:
    // - Check for active orders
    // - Send notification emails
    // - Archive data instead of deleting
    // - etc.
  },

  // After delete vendor
  async afterDelete(event) {
    const { where } = event.params;
    
    strapi.log.info(`Successfully deleted vendor with ID: ${where.id}`);
    
    // You could add post-deletion logic here like:
    // - Clean up related files/media
    // - Send deletion confirmation
    // - Update analytics
    // - etc.
  }
};