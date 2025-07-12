'use strict';

module.exports = (plugin) => {
  // Store reference to original auth controller factory
  const originalAuth = plugin.controllers.auth;
  
  // Override the auth controller factory
  plugin.controllers.auth = ({ strapi }) => {
    // Get the original controller instance
    const controller = originalAuth({ strapi });
    
    // Store the original register method
    const originalRegister = controller.register;
    
    // Override the register method
    controller.register = async (ctx) => {
      const { email, username, password, role_type, profile_data } = ctx.request.body;

      // If no role_type provided, use default Strapi registration
      if (!role_type) {
        return await originalRegister.call(controller, ctx);
      }

      // Validate required fields for custom registration
      if (!email || !username || !password || !role_type) {
        return ctx.badRequest('Email, username, password, and role_type are required');
      }

      // Validate role_type
      const validRoleTypes = ['vendor', 'influencer', 'buyer'];
      if (!validRoleTypes.includes(role_type)) {
        return ctx.badRequest('Invalid role_type. Must be one of: vendor, influencer, buyer');
      }

      try {
        // Get the appropriate role based on role_type
        const roleMap = {
          vendor: 'Vendor',
          influencer: 'Influencer', 
          buyer: 'Buyer' // Use custom Buyer role for buyers
        };

        const roleName = roleMap[role_type];
        const roles = await strapi.entityService.findMany('plugin::users-permissions.role', {
          filters: { name: roleName },
        });

        if (!roles || roles.length === 0) {
          return ctx.badRequest(`Role '${roleName}' not found. Please contact administrator.`);
        }

        const role = roles[0];

        // Check if user already exists
        const existingUser = await strapi.entityService.findMany('plugin::users-permissions.user', {
          filters: { email: email.toLowerCase() },
        });

        if (existingUser && existingUser.length > 0) {
          return ctx.badRequest('Email is already taken');
        }

        // Create the user with appropriate role
        const user = await strapi.entityService.create('plugin::users-permissions.user', {
          data: {
            username,
            email: email.toLowerCase(),
            password,
            role: role.id,
            confirmed: true, // Auto-confirm for testing
            blocked: false,
          },
        });

        // Create the corresponding profile based on role_type
        let profileResponse = null;
        try {
          if (role_type === 'vendor') {
            const vendorData = {
              user: user.id,
              business_name: profile_data?.business_name || username,
              username: profile_data?.username || username,
              contact_email: email,
              phone: profile_data?.phone || null,
              description: profile_data?.description || null,
              website: profile_data?.website || null,
              joined_date: new Date().toISOString(),
              status: 'pending',
              verification_status: 'unverified',
              rating: 0,
              total_sales: 0,
              commission_rate: 0.15,
              is_featured: false,
            };

            profileResponse = await strapi.entityService.create('api::vendor.vendor', {
              data: vendorData,
            });

          } else if (role_type === 'influencer') {
            const influencerData = {
              user: user.id,
              display_name: profile_data?.display_name || username,
              username: profile_data?.username || username,
              contact_email: email,
              phone: profile_data?.phone || null,
              bio: profile_data?.bio || null,
              joined_date: new Date().toISOString(),
              status: 'pending',
              verification_status: 'unverified',
              rating: 0,
              total_earnings: 0,
              commission_rate: 0.05,
              is_featured: false,
              is_verified_creator: false,
            };

            profileResponse = await strapi.entityService.create('api::influencer.influencer', {
              data: influencerData,
            });

          } else if (role_type === 'buyer') {
            const buyerData = {
              user: user.id,
              first_name: profile_data?.first_name || '',
              last_name: profile_data?.last_name || '',
              display_name: profile_data?.display_name || username,
              phone: profile_data?.phone || null,
              customer_since: new Date().toISOString(),
              account_status: 'active',
              total_spent: 0,
              total_orders: 0,
              loyalty_points: 0,
              is_premium: false,
              newsletter_subscribed: profile_data?.newsletter_subscribed || false,
              marketing_consent: profile_data?.marketing_consent || false,
            };

            profileResponse = await strapi.entityService.create('api::buyer.buyer', {
              data: buyerData,
            });
          }

        } catch (profileError) {
          // If profile creation fails, clean up the user
          await strapi.entityService.delete('plugin::users-permissions.user', user.id);
          strapi.log.error('Profile creation failed:', profileError);
          return ctx.badRequest('Failed to create user profile. Please try again.');
        }

        // Generate JWT
        const jwt = strapi.plugin('users-permissions').service('jwt').issue({ id: user.id });
        
        // Sanitize user data for response (remove sensitive fields)
        const { password: _, ...sanitizedUser } = user;

        const response = {
          user: sanitizedUser,
          profile: profileResponse,
          role_type,
          message: role_type === 'buyer' 
            ? 'Registration successful! You can now start shopping.'
            : 'Registration successful! Your application is pending admin approval.',
          jwt
        };

        ctx.send(response);

      } catch (err) {
        strapi.log.error('Registration error:', err);
        return ctx.badRequest('Registration failed. Please try again.');
      }
    };
    
    return controller;
  };


  // Add lifecycle handlers directly to the plugin
  if (!plugin.contentTypes) {
    plugin.contentTypes = {};
  }
  
  if (!plugin.contentTypes.user) {
    plugin.contentTypes.user = {};
  }
  
  plugin.contentTypes.user.lifecycles = {
    // Before delete user, cascade delete related profiles
    async beforeDelete(event) {
      const { where } = event.params;
      const userId = where.id;
      
      if (!userId) {
        return;
      }
      
      try {
        strapi.log.info(`Attempting to delete user ${userId} - checking for related profiles`);
        
        // Check for related profiles before deletion
        const vendorProfiles = await strapi.entityService.findMany('api::vendor.vendor', {
          filters: { user: userId },
        });
        
        const influencerProfiles = await strapi.entityService.findMany('api::influencer.influencer', {
          filters: { user: userId },
        });
        
        const buyerProfiles = await strapi.entityService.findMany('api::buyer.buyer', {
          filters: { user: userId },
        });
        
        // Delete related profiles first (cascade deletion)
        if (vendorProfiles && vendorProfiles.length > 0) {
          for (const vendor of vendorProfiles) {
            await strapi.entityService.delete('api::vendor.vendor', vendor.id);
            strapi.log.info(`Deleted vendor profile ${vendor.id} for user ${userId}`);
          }
        }
        
        if (influencerProfiles && influencerProfiles.length > 0) {
          for (const influencer of influencerProfiles) {
            await strapi.entityService.delete('api::influencer.influencer', influencer.id);
            strapi.log.info(`Deleted influencer profile ${influencer.id} for user ${userId}`);
          }
        }
        
        if (buyerProfiles && buyerProfiles.length > 0) {
          for (const buyer of buyerProfiles) {
            await strapi.entityService.delete('api::buyer.buyer', buyer.id);
            strapi.log.info(`Deleted buyer profile ${buyer.id} for user ${userId}`);
          }
        }
        
        strapi.log.info(`Successfully deleted all related profiles for user ${userId}`);
        
      } catch (err) {
        strapi.log.error(`Error deleting related profiles for user ${userId}:`, err);
        throw new Error('Failed to delete user profiles. Cannot proceed with user deletion.');
      }
    },

    // After delete user
    async afterDelete(event) {
      const { where } = event.params;
      const userId = where.id;
      
      strapi.log.info(`Successfully completed cascade deletion for user ${userId}`);
    }
  };

  return plugin;
};