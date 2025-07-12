'use strict';

module.exports = {
  routes: [
    // Default CRUD routes (admin access)
    {
      method: 'GET',
      path: '/buyers',
      handler: 'buyer.find',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/buyers/:id',
      handler: 'buyer.findOne',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/buyers',
      handler: 'buyer.create',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'PUT',
      path: '/buyers/:id',
      handler: 'buyer.update',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'DELETE',
      path: '/buyers/:id',
      handler: 'buyer.delete',
      config: {
        policies: [],
        middlewares: [],
      },
    },

    // Customer-specific routes
    {
      method: 'GET',
      path: '/buyers/user/:userId',
      handler: 'buyer.findByUser',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/buyers/me/profile',
      handler: 'buyer.getMyProfile',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'PUT',
      path: '/buyers/me/profile',
      handler: 'buyer.updateMyProfile',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};