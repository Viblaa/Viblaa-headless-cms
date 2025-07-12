'use strict';

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::influencer.influencer', ({ strapi }) => ({
  
  // Custom service to update influencer status
  async updateStatus(influencerId, status) {
    try {
      const entity = await strapi.entityService.update('api::influencer.influencer', influencerId, {
        data: { status },
        populate: {
          profile_picture: true,
          cover_image: true,
          media_kit: true,
          address: true,
          social_networks: true,
          user: {
            fields: ['id', 'username', 'email']
          }
        },
      });

      strapi.log.info(`Influencer ${influencerId} status changed to ${status}`);
      return entity;
    } catch (error) {
      strapi.log.error('Error updating influencer status:', error);
      throw error;
    }
  },

  // Custom service to update verification status
  async updateVerificationStatus(influencerId, verificationStatus) {
    try {
      const entity = await strapi.entityService.update('api::influencer.influencer', influencerId, {
        data: { verification_status: verificationStatus },
        populate: {
          profile_picture: true,
          cover_image: true,
          media_kit: true,
          address: true,
          social_networks: true,
          user: {
            fields: ['id', 'username', 'email']
          }
        },
      });

      strapi.log.info(`Influencer ${influencerId} verification status changed to ${verificationStatus}`);
      return entity;
    } catch (error) {
      strapi.log.error('Error updating influencer verification status:', error);
      throw error;
    }
  },

  // Custom service to calculate and update influencer rating
  async updateRating(influencerId) {
    try {
      const influencer = await strapi.entityService.findOne('api::influencer.influencer', influencerId, {
        populate: {
          // This would populate reviews/collaborations when you create those content types
          // reviews: true,
          // collaborations: true,
        },
      });

      // Placeholder logic - replace with actual review/collaboration calculation
      // const reviews = influencer.reviews || [];
      // const collaborations = influencer.collaborations || [];
      // Calculate rating based on reviews and collaboration success

      // For now, keep existing rating
      const averageRating = influencer.rating || 0;

      const updatedInfluencer = await strapi.entityService.update('api::influencer.influencer', influencerId, {
        data: { rating: averageRating },
      });

      return updatedInfluencer;
    } catch (error) {
      strapi.log.error('Error updating influencer rating:', error);
      throw error;
    }
  },

  // Custom service to get influencer statistics
  async getInfluencerStats(influencerId) {
    try {
      const influencer = await strapi.entityService.findOne('api::influencer.influencer', influencerId, {
        populate: {
          social_networks: true,
          // collaborations: true, // Uncomment when collaborations relation exists
          // campaigns: true,      // Uncomment when campaigns relation exists
        },
      });

      if (!influencer) {
        throw new Error('Influencer not found');
      }

      // Calculate total reach across all platforms
      const totalFollowers = influencer.social_networks?.reduce((total, network) => {
        return total + (network.followers_count || 0);
      }, 0) || 0;

      // Calculate average engagement rate across platforms
      const avgEngagementRate = influencer.social_networks?.length > 0 
        ? influencer.social_networks.reduce((total, network) => {
            return total + (network.engagement_rate || 0);
          }, 0) / influencer.social_networks.length
        : 0;

      // Get primary platform (marked as is_primary)
      const primaryPlatform = influencer.social_networks?.find(network => network.is_primary);

      return {
        influencerId: influencer.id,
        displayName: influencer.display_name,
        username: influencer.username,
        totalFollowers,
        avgEngagementRate: Math.round(avgEngagementRate * 100) / 100,
        totalEarnings: influencer.total_earnings || 0,
        rating: influencer.rating || 0,
        status: influencer.status,
        verificationStatus: influencer.verification_status,
        isVerifiedCreator: influencer.is_verified_creator,
        isFeatured: influencer.is_featured,
        commissionRate: influencer.commission_rate,
        joinedDate: influencer.joined_date,
        platformCount: influencer.social_networks?.length || 0,
        primaryPlatform: primaryPlatform?.platform || null,
        primaryPlatformFollowers: primaryPlatform?.followers_count || 0,
        primaryPlatformEngagement: primaryPlatform?.engagement_rate || 0,
        nicheCategories: influencer.niche_categories || [],
        contentTypes: influencer.content_type_preferences || [],
        // totalCollaborations: influencer.collaborations?.length || 0,
        // activeCampaigns: influencer.campaigns?.filter(c => c.status === 'active').length || 0,
      };
    } catch (error) {
      strapi.log.error('Error getting influencer stats:', error);
      throw error;
    }
  },

  // Custom service to approve influencer
  async approveInfluencer(influencerId) {
    try {
      const influencer = await this.updateStatus(influencerId, 'approved');
      await this.updateVerificationStatus(influencerId, 'verified');

      // Send approval notification email
      await this.sendApprovalEmail(influencer);

      strapi.log.info(`Influencer ${influencerId} approved successfully`);
      return influencer;
    } catch (error) {
      strapi.log.error('Error approving influencer:', error);
      throw error;
    }
  },

  // Custom service to reject influencer
  async rejectInfluencer(influencerId, reason = '') {
    try {
      const influencer = await this.updateStatus(influencerId, 'rejected');
      await this.updateVerificationStatus(influencerId, 'rejected');

      // Send rejection notification email
      await this.sendRejectionEmail(influencer, reason);

      strapi.log.info(`Influencer ${influencerId} rejected. Reason: ${reason}`);
      return influencer;
    } catch (error) {
      strapi.log.error('Error rejecting influencer:', error);
      throw error;
    }
  },

  // Custom service to suspend influencer
  async suspendInfluencer(influencerId, reason = '') {
    try {
      const influencer = await this.updateStatus(influencerId, 'suspended');

      // Send suspension notification email
      await this.sendSuspensionEmail(influencer, reason);

      strapi.log.info(`Influencer ${influencerId} suspended. Reason: ${reason}`);
      return influencer;
    } catch (error) {
      strapi.log.error('Error suspending influencer:', error);
      throw error;
    }
  },

  // Custom service to verify creator status
  async verifyCreator(influencerId) {
    try {
      const influencer = await strapi.entityService.update('api::influencer.influencer', influencerId, {
        data: { 
          is_verified_creator: true,
          verification_status: 'verified'
        },
      });

      strapi.log.info(`Influencer ${influencerId} verified as creator successfully`);
      return influencer;
    } catch (error) {
      strapi.log.error('Error verifying creator:', error);
      throw error;
    }
  },

  // Custom service to get influencers by status
  async findByStatus(status, options = {}) {
    try {
      return await strapi.entityService.findMany('api::influencer.influencer', {
        filters: { status },
        populate: {
          profile_picture: true,
          cover_image: true,
          media_kit: true,
          address: true,
          social_networks: true,
          user: {
            fields: ['id', 'username', 'email']
          }
        },
        ...options,
      });
    } catch (error) {
      strapi.log.error('Error finding influencers by status:', error);
      throw error;
    }
  },

  // Custom service to search influencers
  async searchInfluencers(searchTerm, options = {}) {
    try {
      return await strapi.entityService.findMany('api::influencer.influencer', {
        filters: {
          $or: [
            { display_name: { $containsi: searchTerm } },
            { username: { $containsi: searchTerm } },
            { bio: { $containsi: searchTerm } },
          ],
        },
        populate: {
          profile_picture: true,
          cover_image: true,
          media_kit: true,
          address: true,
          social_networks: true,
          user: {
            fields: ['id', 'username', 'email']
          }
        },
        ...options,
      });
    } catch (error) {
      strapi.log.error('Error searching influencers:', error);
      throw error;
    }
  },

  // Custom service to find influencer by username
  async findByUsername(username) {
    try {
      const influencers = await strapi.entityService.findMany('api::influencer.influencer', {
        filters: { username },
        populate: {
          profile_picture: true,
          cover_image: true,
          media_kit: true,
          address: true,
          social_networks: true,
          user: {
            fields: ['id', 'username', 'email']
          }
        },
      });

      return influencers.length > 0 ? influencers[0] : null;
    } catch (error) {
      strapi.log.error('Error finding influencer by username:', error);
      throw error;
    }
  },

  // Custom service to search by platform and follower count
  async findByPlatformAndReach(platform, minFollowers = 0, maxFollowers = null, options = {}) {
    try {
      // This is a complex query that would need custom SQL or advanced filtering
      // For now, we'll get all influencers and filter in memory (not optimal for large datasets)
      const allInfluencers = await strapi.entityService.findMany('api::influencer.influencer', {
        filters: { status: 'approved' },
        populate: {
          social_networks: true,
          profile_picture: true,
          cover_image: true,
        },
        ...options,
      });

      const filteredInfluencers = allInfluencers.filter(influencer => {
        const platformAccount = influencer.social_networks?.find(
          network => network.platform === platform
        );

        if (!platformAccount) return false;

        const followers = platformAccount.followers_count || 0;
        return followers >= minFollowers && (maxFollowers === null || followers <= maxFollowers);
      });

      return filteredInfluencers;
    } catch (error) {
      strapi.log.error('Error finding influencers by platform and reach:', error);
      throw error;
    }
  },

  // Custom service to update social network metrics
  async updateSocialMetrics(influencerId, platformUpdates) {
    try {
      const influencer = await strapi.entityService.findOne('api::influencer.influencer', influencerId, {
        populate: { social_networks: true },
      });

      if (!influencer) {
        throw new Error('Influencer not found');
      }

      // Update social network metrics
      const updatedNetworks = influencer.social_networks.map(network => {
        const update = platformUpdates.find(u => u.platform === network.platform);
        if (update) {
          return {
            ...network,
            ...update,
            last_updated: new Date().toISOString(),
          };
        }
        return network;
      });

      const updatedInfluencer = await strapi.entityService.update('api::influencer.influencer', influencerId, {
        data: {
          social_networks: updatedNetworks,
        },
      });

      return updatedInfluencer;
    } catch (error) {
      strapi.log.error('Error updating social metrics:', error);
      throw error;
    }
  },

  // Email notification services (placeholder implementations)
  async sendApprovalEmail(influencer) {
    try {
      strapi.log.info(`Sending approval email to ${influencer.contact_email}`);
      
      // Example implementation:
      // await strapi.plugins['email'].services.email.send({
      //   to: influencer.contact_email,
      //   subject: 'Influencer Application Approved',
      //   html: `<p>Congratulations! Your influencer application for ${influencer.display_name} has been approved.</p>`
      // });
      
      return true;
    } catch (error) {
      strapi.log.error('Error sending approval email:', error);
      return false;
    }
  },

  async sendRejectionEmail(influencer, reason) {
    try {
      strapi.log.info(`Sending rejection email to ${influencer.contact_email}`);
      
      // Example implementation:
      // await strapi.plugins['email'].services.email.send({
      //   to: influencer.contact_email,
      //   subject: 'Influencer Application Rejected',
      //   html: `<p>Your influencer application for ${influencer.display_name} has been rejected.</p><p>Reason: ${reason}</p>`
      // });
      
      return true;
    } catch (error) {
      strapi.log.error('Error sending rejection email:', error);
      return false;
    }
  },

  async sendSuspensionEmail(influencer, reason) {
    try {
      strapi.log.info(`Sending suspension email to ${influencer.contact_email}`);
      
      // Example implementation:
      // await strapi.plugins['email'].services.email.send({
      //   to: influencer.contact_email,
      //   subject: 'Influencer Account Suspended',
      //   html: `<p>Your influencer account for ${influencer.display_name} has been suspended.</p><p>Reason: ${reason}</p>`
      // });
      
      return true;
    } catch (error) {
      strapi.log.error('Error sending suspension email:', error);
      return false;
    }
  },

  // Custom service to increment earnings
  async incrementEarnings(influencerId, amount) {
    try {
      const influencer = await strapi.entityService.findOne('api::influencer.influencer', influencerId);
      const newTotal = (influencer.total_earnings || 0) + amount;

      return await strapi.entityService.update('api::influencer.influencer', influencerId, {
        data: { total_earnings: newTotal },
      });
    } catch (error) {
      strapi.log.error('Error incrementing influencer earnings:', error);
      throw error;
    }
  },

  // Custom service to find top influencers by followers
  async findTopInfluencers(limit = 10, platform = null) {
    try {
      const influencers = await strapi.entityService.findMany('api::influencer.influencer', {
        filters: { 
          status: 'approved',
          verification_status: 'verified'
        },
        populate: {
          social_networks: true,
          profile_picture: true,
        },
      });

      // Calculate total or platform-specific followers and sort
      const influencersWithReach = influencers.map(influencer => {
        let totalFollowers = 0;

        if (platform) {
          const platformAccount = influencer.social_networks?.find(n => n.platform === platform);
          totalFollowers = platformAccount?.followers_count || 0;
        } else {
          totalFollowers = influencer.social_networks?.reduce((total, network) => {
            return total + (network.followers_count || 0);
          }, 0) || 0;
        }

        return {
          ...influencer,
          total_followers: totalFollowers,
        };
      });

      // Sort by followers and limit results
      return influencersWithReach
        .sort((a, b) => b.total_followers - a.total_followers)
        .slice(0, limit);
    } catch (error) {
      strapi.log.error('Error finding top influencers:', error);
      throw error;
    }
  },

}));