'use strict';

module.exports = {
  routes: [
    // Default CRUD routes
    {
      method: 'GET',
      path: '/influencers',
      handler: 'influencer.find',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/influencers/:id',
      handler: 'influencer.findOne',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/influencers',
      handler: 'influencer.create',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'PUT',
      path: '/influencers/:id',
      handler: 'influencer.update',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'DELETE',
      path: '/influencers/:id',
      handler: 'influencer.delete',
      config: {
        policies: [],
        middlewares: [],
      },
    },

    // Custom discovery routes
    {
      method: 'GET',
      path: '/influencers/username/:username',
      handler: 'influencer.findByUsername',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/influencers/user/:userId',
      handler: 'influencer.findByUser',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/influencers/featured',
      handler: 'influencer.findFeatured',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/influencers/verified-creators',
      handler: 'influencer.findVerifiedCreators',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/influencers/status/:status',
      handler: 'influencer.findByStatus',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/influencers/niche/:niche',
      handler: 'influencer.findByNiche',
      config: {
        policies: [],
        middlewares: [],
      },
    },

    // Admin management routes
    {
      method: 'PUT',
      path: '/influencers/:id/approve',
      handler: 'influencer.approve',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'PUT',
      path: '/influencers/:id/reject',
      handler: 'influencer.reject',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'PUT',
      path: '/influencers/:id/suspend',
      handler: 'influencer.suspend',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'PUT',
      path: '/influencers/:id/verify-creator',
      handler: 'influencer.verifyCreator',
      config: {
        policies: [],
        middlewares: [],
      },
    },

    // Analytics and stats routes
    {
      method: 'GET',
      path: '/influencers/:id/stats',
      handler: 'influencer.getStats',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};