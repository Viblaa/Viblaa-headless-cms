'use strict';

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::buyer.buyer', ({ strapi }) => ({
  
  // Custom service to find buyer by user ID
  async findByUserId(userId) {
    try {
      const buyers = await strapi.entityService.findMany('api::buyer.buyer', {
        filters: { user: userId },
        populate: {
          profile_picture: true,
          addresses: true,
          default_address: true,
          user: {
            fields: ['id', 'username', 'email', 'phone']
          }
        },
      });

      return buyers.length > 0 ? buyers[0] : null;
    } catch (error) {
      strapi.log.error('Error finding buyer by user ID:', error);
      throw error;
    }
  },

  // Custom service to update buyer spending
  async updateSpending(buyerId, orderAmount) {
    try {
      const buyer = await strapi.entityService.findOne('api::buyer.buyer', buyerId);
      
      if (!buyer) {
        throw new Error('Buyer not found');
      }

      const newTotalSpent = (buyer.total_spent || 0) + orderAmount;
      const newTotalOrders = (buyer.total_orders || 0) + 1;

      // Calculate loyalty points (1 point per dollar spent)
      const newLoyaltyPoints = (buyer.loyalty_points || 0) + Math.floor(orderAmount);

      return await strapi.entityService.update('api::buyer.buyer', buyerId, {
        data: { 
          total_spent: newTotalSpent,
          total_orders: newTotalOrders,
          loyalty_points: newLoyaltyPoints
        },
      });
    } catch (error) {
      strapi.log.error('Error updating buyer spending:', error);
      throw error;
    }
  },

  // Custom service to check if buyer qualifies for premium
  async checkPremiumEligibility(buyerId) {
    try {
      const buyer = await strapi.entityService.findOne('api::buyer.buyer', buyerId);
      
      if (!buyer) {
        throw new Error('Buyer not found');
      }

      // Premium criteria: spent over $1000 or made 20+ orders
      const qualifiesForPremium = (buyer.total_spent >= 1000) || (buyer.total_orders >= 20);

      if (qualifiesForPremium && !buyer.is_premium) {
        return await strapi.entityService.update('api::buyer.buyer', buyerId, {
          data: { is_premium: true },
        });
      }

      return buyer;
    } catch (error) {
      strapi.log.error('Error checking premium eligibility:', error);
      throw error;
    }
  },

  // Custom service to get buyer statistics
  async getBuyerStats(buyerId) {
    try {
      const buyer = await strapi.entityService.findOne('api::buyer.buyer', buyerId, {
        populate: {
          // orders: true, // Uncomment when orders relation exists
        },
      });

      if (!buyer) {
        throw new Error('Buyer not found');
      }

      return {
        buyerId: buyer.id,
        fullName: `${buyer.first_name} ${buyer.last_name}`,
        displayName: buyer.display_name,
        totalSpent: buyer.total_spent || 0,
        totalOrders: buyer.total_orders || 0,
        loyaltyPoints: buyer.loyalty_points || 0,
        isPremium: buyer.is_premium,
        customerSince: buyer.customer_since,
        accountStatus: buyer.account_status,
        // averageOrderValue: buyer.total_orders > 0 ? (buyer.total_spent / buyer.total_orders) : 0,
        // recentOrders: buyer.orders?.slice(0, 5) || [],
      };
    } catch (error) {
      strapi.log.error('Error getting buyer stats:', error);
      throw error;
    }
  },

  // Custom service to suspend buyer account
  async suspendAccount(buyerId, reason = '') {
    try {
      const buyer = await strapi.entityService.update('api::buyer.buyer', buyerId, {
        data: { account_status: 'suspended' },
      });

      strapi.log.info(`Buyer ${buyerId} account suspended. Reason: ${reason}`);
      return buyer;
    } catch (error) {
      strapi.log.error('Error suspending buyer account:', error);
      throw error;
    }
  },

  // Custom service to reactivate buyer account
  async reactivateAccount(buyerId) {
    try {
      const buyer = await strapi.entityService.update('api::buyer.buyer', buyerId, {
        data: { account_status: 'active' },
      });

      strapi.log.info(`Buyer ${buyerId} account reactivated`);
      return buyer;
    } catch (error) {
      strapi.log.error('Error reactivating buyer account:', error);
      throw error;
    }
  },

  // Custom service to add to wishlist
  async addToWishlist(buyerId, productId) {
    try {
      const buyer = await strapi.entityService.findOne('api::buyer.buyer', buyerId);
      
      if (!buyer) {
        throw new Error('Buyer not found');
      }

      const currentWishlist = buyer.wishlist || [];
      
      if (!currentWishlist.includes(productId)) {
        currentWishlist.push(productId);
        
        return await strapi.entityService.update('api::buyer.buyer', buyerId, {
          data: { wishlist: currentWishlist },
        });
      }

      return buyer;
    } catch (error) {
      strapi.log.error('Error adding to wishlist:', error);
      throw error;
    }
  },

  // Custom service to remove from wishlist
  async removeFromWishlist(buyerId, productId) {
    try {
      const buyer = await strapi.entityService.findOne('api::buyer.buyer', buyerId);
      
      if (!buyer) {
        throw new Error('Buyer not found');
      }

      const currentWishlist = buyer.wishlist || [];
      const updatedWishlist = currentWishlist.filter(id => id !== productId);
      
      return await strapi.entityService.update('api::buyer.buyer', buyerId, {
        data: { wishlist: updatedWishlist },
      });
    } catch (error) {
      strapi.log.error('Error removing from wishlist:', error);
      throw error;
    }
  },

}));