'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::influencer.influencer', ({ strapi }) => ({
  
  // Override default find method with custom populate
  async find(ctx) {
    const { query } = ctx;
    
    const entity = await strapi.entityService.findMany('api::influencer.influencer', {
      ...query,
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

    const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
    return this.transformResponse(sanitizedEntity);
  },

  // Override default findOne method with custom populate
  async findOne(ctx) {
    const { id } = ctx.params;
    const { query } = ctx;

    const entity = await strapi.entityService.findOne('api::influencer.influencer', id, {
      ...query,
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

    const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
    return this.transformResponse(sanitizedEntity);
  },

  // Override default create method with auto-assign user
  async create(ctx) {
    const { data } = ctx.request.body;
    
    // Auto-assign current user if authenticated and no user provided
    if (ctx.state.user && !data.user) {
      data.user = ctx.state.user.id;
    }

    // Set joined_date to current timestamp
    if (!data.joined_date) {
      data.joined_date = new Date().toISOString();
    }

    const entity = await strapi.entityService.create('api::influencer.influencer', {
      data,
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

    const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
    return this.transformResponse(sanitizedEntity);
  },

  // Custom endpoint to find influencer by username
  async findByUsername(ctx) {
    const { username } = ctx.params;

    const entities = await strapi.entityService.findMany('api::influencer.influencer', {
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

    if (!entities || entities.length === 0) {
      return ctx.notFound('Influencer not found');
    }

    const sanitizedEntity = await this.sanitizeOutput(entities[0], ctx);
    return this.transformResponse(sanitizedEntity);
  },

  // Custom endpoint to find influencer by user ID
  async findByUser(ctx) {
    const { userId } = ctx.params;

    const entities = await strapi.entityService.findMany('api::influencer.influencer', {
      filters: { user: userId },
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

    const sanitizedEntity = await this.sanitizeOutput(entities, ctx);
    return this.transformResponse(sanitizedEntity);
  },

  // Custom endpoint to get featured influencers
  async findFeatured(ctx) {
    const { query } = ctx;

    const entities = await strapi.entityService.findMany('api::influencer.influencer', {
      ...query,
      filters: { 
        is_featured: true,
        status: 'approved'
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
    });

    const sanitizedEntity = await this.sanitizeOutput(entities, ctx);
    return this.transformResponse(sanitizedEntity);
  },

  // Custom endpoint to get verified creators
  async findVerifiedCreators(ctx) {
    const { query } = ctx;

    const entities = await strapi.entityService.findMany('api::influencer.influencer', {
      ...query,
      filters: { 
        is_verified_creator: true,
        status: 'approved'
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
    });

    const sanitizedEntity = await this.sanitizeOutput(entities, ctx);
    return this.transformResponse(sanitizedEntity);
  },

  // Custom endpoint to get influencers by status
  async findByStatus(ctx) {
    const { status } = ctx.params;
    const { query } = ctx;

    const entities = await strapi.entityService.findMany('api::influencer.influencer', {
      ...query,
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
    });

    const sanitizedEntity = await this.sanitizeOutput(entities, ctx);
    return this.transformResponse(sanitizedEntity);
  },

  // Custom endpoint to search influencers by niche/category
  async findByNiche(ctx) {
    const { niche } = ctx.params;
    const { query } = ctx;

    const entities = await strapi.entityService.findMany('api::influencer.influencer', {
      ...query,
      filters: {
        status: 'approved',
        niche_categories: {
          $contains: niche
        }
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
    });

    const sanitizedEntity = await this.sanitizeOutput(entities, ctx);
    return this.transformResponse(sanitizedEntity);
  },

  // Custom endpoint to approve influencer
  async approve(ctx) {
    const { id } = ctx.params;

    const entity = await strapi.entityService.update('api::influencer.influencer', id, {
      data: { 
        status: 'approved',
        verification_status: 'verified'
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
    });

    const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
    return this.transformResponse(sanitizedEntity);
  },

  // Custom endpoint to reject influencer
  async reject(ctx) {
    const { id } = ctx.params;
    const { reason } = ctx.request.body;

    const entity = await strapi.entityService.update('api::influencer.influencer', id, {
      data: { 
        status: 'rejected',
        verification_status: 'rejected'
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
    });

    // You can add notification logic here
    // await strapi.service('api::influencer.influencer').sendRejectionEmail(entity, reason);

    const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
    return this.transformResponse(sanitizedEntity);
  },

  // Custom endpoint to suspend influencer
  async suspend(ctx) {
    const { id } = ctx.params;
    const { reason } = ctx.request.body;

    const entity = await strapi.entityService.update('api::influencer.influencer', id, {
      data: { status: 'suspended' },
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

    // You can add notification logic here
    // await strapi.service('api::influencer.influencer').sendSuspensionEmail(entity, reason);

    const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
    return this.transformResponse(sanitizedEntity);
  },

  // Custom endpoint to verify creator status
  async verifyCreator(ctx) {
    const { id } = ctx.params;

    const entity = await strapi.entityService.update('api::influencer.influencer', id, {
      data: { 
        is_verified_creator: true,
        verification_status: 'verified'
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
    });

    const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
    return this.transformResponse(sanitizedEntity);
  },

  // Custom endpoint to get influencer analytics/stats
  async getStats(ctx) {
    const { id } = ctx.params;

    const influencer = await strapi.entityService.findOne('api::influencer.influencer', id, {
      populate: {
        social_networks: true,
      },
    });

    if (!influencer) {
      return ctx.notFound('Influencer not found');
    }

    // Calculate total reach across platforms
    const totalFollowers = influencer.social_networks?.reduce((total, network) => {
      return total + (network.followers_count || 0);
    }, 0) || 0;

    // Calculate average engagement rate
    const avgEngagementRate = influencer.social_networks?.reduce((total, network, index, array) => {
      const rate = network.engagement_rate || 0;
      return index === array.length - 1 ? (total + rate) / array.length : total + rate;
    }, 0) || 0;

    const stats = {
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
      platformCount: influencer.social_networks?.length || 0,
      primaryPlatform: influencer.social_networks?.find(network => network.is_primary)?.platform || null,
      joinedDate: influencer.joined_date,
    };

    return this.transformResponse(stats);
  }

}));