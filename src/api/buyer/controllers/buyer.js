'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::buyer.buyer', ({ strapi }) => ({
  
  // Override default find method with custom populate
  async find(ctx) {
    const { query } = ctx;
    
    const entity = await strapi.entityService.findMany('api::buyer.buyer', {
      ...query,
      populate: {
        profile_picture: true,
        addresses: true,
        default_address: true,
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

    const entity = await strapi.entityService.findOne('api::buyer.buyer', id, {
      ...query,
      populate: {
        profile_picture: true,
        addresses: true,
        default_address: true,
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

    // Set customer_since to current timestamp
    if (!data.customer_since) {
      data.customer_since = new Date().toISOString();
    }

    const entity = await strapi.entityService.create('api::buyer.buyer', {
      data,
      populate: {
        profile_picture: true,
        addresses: true,
        default_address: true,
        user: {
          fields: ['id', 'username', 'email']
        }
      },
    });

    const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
    return this.transformResponse(sanitizedEntity);
  },

  // Custom endpoint to find buyer by user ID
  async findByUser(ctx) {
    const { userId } = ctx.params;

    const entities = await strapi.entityService.findMany('api::buyer.buyer', {
      filters: { user: userId },
      populate: {
        profile_picture: true,
        addresses: true,
        default_address: true,
        user: {
          fields: ['id', 'username', 'email']
        }
      },
    });

    const sanitizedEntity = await this.sanitizeOutput(entities, ctx);
    return this.transformResponse(sanitizedEntity);
  },

  // Custom endpoint to get buyer profile for current user
  async getMyProfile(ctx) {
    if (!ctx.state.user) {
      return ctx.unauthorized('You must be authenticated');
    }

    const entities = await strapi.entityService.findMany('api::buyer.buyer', {
      filters: { user: ctx.state.user.id },
      populate: {
        profile_picture: true,
        addresses: true,
        default_address: true,
        user: {
          fields: ['id', 'username', 'email']
        }
      },
    });

    if (!entities || entities.length === 0) {
      return ctx.notFound('Buyer profile not found');
    }

    const sanitizedEntity = await this.sanitizeOutput(entities[0], ctx);
    return this.transformResponse(sanitizedEntity);
  },

  // Custom endpoint to update buyer profile for current user
  async updateMyProfile(ctx) {
    if (!ctx.state.user) {
      return ctx.unauthorized('You must be authenticated');
    }

    const { data } = ctx.request.body;

    // Find buyer by current user
    const buyers = await strapi.entityService.findMany('api::buyer.buyer', {
      filters: { user: ctx.state.user.id },
    });

    if (!buyers || buyers.length === 0) {
      return ctx.notFound('Buyer profile not found');
    }

    const buyerId = buyers[0].id;

    const entity = await strapi.entityService.update('api::buyer.buyer', buyerId, {
      data,
      populate: {
        profile_picture: true,
        addresses: true,
        default_address: true,
        user: {
          fields: ['id', 'username', 'email']
        }
      },
    });

    const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
    return this.transformResponse(sanitizedEntity);
  }

}));