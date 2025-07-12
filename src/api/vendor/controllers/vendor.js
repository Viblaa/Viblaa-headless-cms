'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::vendor.vendor', ({ strapi }) => ({
  
  // Override default find method with custom populate
  async find(ctx) {
    const { query } = ctx;
    
    const entity = await strapi.entityService.findMany('api::vendor.vendor', {
      ...query,
      populate: {
        logo: true,
        banner_image: true,
        address: true,
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

    const entity = await strapi.entityService.findOne('api::vendor.vendor', id, {
      ...query,
      populate: {
        logo: true,
        banner_image: true,
        address: true,
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

    const entity = await strapi.entityService.create('api::vendor.vendor', {
      data,
      populate: {
        logo: true,
        banner_image: true,
        address: true,
        user: {
          fields: ['id', 'username', 'email']
        }
      },
    });

    const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
    return this.transformResponse(sanitizedEntity);
  },

  // Custom endpoint to find vendor by username
  async findByUsername(ctx) {
    const { username } = ctx.params;

    const entities = await strapi.entityService.findMany('api::vendor.vendor', {
      filters: { username },
      populate: {
        logo: true,
        banner_image: true,
        address: true,
        user: {
          fields: ['id', 'username', 'email']
        }
      },
    });

    if (!entities || entities.length === 0) {
      return ctx.notFound('Vendor not found');
    }

    const sanitizedEntity = await this.sanitizeOutput(entities[0], ctx);
    return this.transformResponse(sanitizedEntity);
  },

  // Custom endpoint to find vendor by user ID
  async findByUser(ctx) {
    const { userId } = ctx.params;

    const entities = await strapi.entityService.findMany('api::vendor.vendor', {
      filters: { user: userId },
      populate: {
        logo: true,
        banner_image: true,
        address: true,
        user: {
          fields: ['id', 'username', 'email']
        }
      },
    });

    const sanitizedEntity = await this.sanitizeOutput(entities, ctx);
    return this.transformResponse(sanitizedEntity);
  },

  // Custom endpoint to get featured vendors
  async findFeatured(ctx) {
    const { query } = ctx;

    const entities = await strapi.entityService.findMany('api::vendor.vendor', {
      ...query,
      filters: { 
        is_featured: true,
        status: 'approved'
      },
      populate: {
        logo: true,
        banner_image: true,
        address: true,
        user: {
          fields: ['id', 'username', 'email']
        }
      },
    });

    const sanitizedEntity = await this.sanitizeOutput(entities, ctx);
    return this.transformResponse(sanitizedEntity);
  },

  // Custom endpoint to get vendors by status
  async findByStatus(ctx) {
    const { status } = ctx.params;
    const { query } = ctx;

    const entities = await strapi.entityService.findMany('api::vendor.vendor', {
      ...query,
      filters: { status },
      populate: {
        logo: true,
        banner_image: true,
        address: true,
        user: {
          fields: ['id', 'username', 'email']
        }
      },
    });

    const sanitizedEntity = await this.sanitizeOutput(entities, ctx);
    return this.transformResponse(sanitizedEntity);
  },

  // Custom endpoint to approve vendor
  async approve(ctx) {
    const { id } = ctx.params;

    const entity = await strapi.entityService.update('api::vendor.vendor', id, {
      data: { 
        status: 'approved',
        verification_status: 'verified'
      },
      populate: {
        logo: true,
        banner_image: true,
        address: true,
        user: {
          fields: ['id', 'username', 'email']
        }
      },
    });

    const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
    return this.transformResponse(sanitizedEntity);
  },

  // Custom endpoint to reject vendor
  async reject(ctx) {
    const { id } = ctx.params;
    const { reason } = ctx.request.body;

    const entity = await strapi.entityService.update('api::vendor.vendor', id, {
      data: { 
        status: 'rejected',
        verification_status: 'rejected'
      },
      populate: {
        logo: true,
        banner_image: true,
        address: true,
        user: {
          fields: ['id', 'username', 'email']
        }
      },
    });

    // You can add notification logic here
    // await strapi.service('api::vendor.vendor').sendRejectionEmail(entity, reason);

    const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
    return this.transformResponse(sanitizedEntity);
  },

  // Custom endpoint to suspend vendor
  async suspend(ctx) {
    const { id } = ctx.params;
    const { reason } = ctx.request.body;

    const entity = await strapi.entityService.update('api::vendor.vendor', id, {
      data: { status: 'suspended' },
      populate: {
        logo: true,
        banner_image: true,
        address: true,
        user: {
          fields: ['id', 'username', 'email',"phone"]
        }
      },
    });

    // You can add notification logic here
    // await strapi.service('api::vendor.vendor').sendSuspensionEmail(entity, reason);

    const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
    return this.transformResponse(sanitizedEntity);
  }

}));