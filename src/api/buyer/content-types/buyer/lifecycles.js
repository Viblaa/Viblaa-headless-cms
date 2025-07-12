'use strict';

module.exports = {
  // Before delete buyer, we could add additional business logic here
  async beforeDelete(event) {
    const { where } = event.params;
    
    // Log the deletion for audit purposes
    strapi.log.info(`Attempting to delete buyer with ID: ${where.id}`);
    
    // You could add business logic here like:
    // - Check for pending orders
    // - Handle loyalty points
    // - Archive purchase history
    // - etc.
  },

  // After delete buyer
  async afterDelete(event) {
    const { where } = event.params;
    
    strapi.log.info(`Successfully deleted buyer with ID: ${where.id}`);
    
    // You could add post-deletion logic here like:
    // - Clean up wishlists
    // - Update customer analytics
    // - etc.
  }
};