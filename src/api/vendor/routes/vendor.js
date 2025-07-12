'use strict';

module.exports = {
  routes: [
    // Default CRUD routes
    {
      method: 'GET',
      path: '/vendors',
      handler: 'vendor.find',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/vendors/:id',
      handler: 'vendor.findOne',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/vendors',
      handler: 'vendor.create',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'PUT',
      path: '/vendors/:id',
      handler: 'vendor.update',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'DELETE',
      path: '/vendors/:id',
      handler: 'vendor.delete',
      config: {
        policies: [],
        middlewares: [],
      },
    },

    // Custom routes
    {
      method: 'GET',
      path: '/vendors/username/:username',
      handler: 'vendor.findByUsername',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/vendors/user/:userId',
      handler: 'vendor.findByUser',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/vendors/featured',
      handler: 'vendor.findFeatured',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/vendors/status/:status',
      handler: 'vendor.findByStatus',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'PUT',
      path: '/vendors/:id/approve',
      handler: 'vendor.approve',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'PUT',
      path: '/vendors/:id/reject',
      handler: 'vendor.reject',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'PUT',
      path: '/vendors/:id/suspend',
      handler: 'vendor.suspend',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};