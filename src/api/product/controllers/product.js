'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::product.product', ({ strapi }) => ({
  
  // Override default find method with custom populate
  async find(ctx) {
    const { query } = ctx;
    
    const entity = await strapi.entityService.findMany('api::product.product', {
      ...query,
      populate: {
        images: true,
        videos: true,
        categories: true,
        vendor: {
          fields: ['id', 'business_name', 'username', 'status']
        },
        influencer: {
          fields: ['id', 'display_name', 'username', 'status']
        },
        original_product: {
          fields: ['id', 'name', 'slug', 'base_price'],
          populate: {
            vendor: {
              fields: ['business_name', 'username']
            }
          }
        },
        slab_pricing: true,
        variants: true,
        attributes: true,
        dimensions: true,
        inventory: true,
        commission_settings: true,
        shipping: true,
        compliance: true,
        marketing: true,
        seo: true
      },
    });

    const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
    return this.transformResponse(sanitizedEntity);
  },

  // Override default findOne method with custom populate
  async findOne(ctx) {
    const { id } = ctx.params;
    const { query } = ctx;

    const entity = await strapi.entityService.findOne('api::product.product', id, {
      ...query,
      populate: {
        images: true,
        videos: true,
        documents: true,
        categories: true,
        vendor: {
          fields: ['id', 'business_name', 'username', 'status', 'rating']
        },
        influencer: {
          fields: ['id', 'display_name', 'username', 'status', 'rating']
        },
        original_product: {
          populate: {
            vendor: {
              fields: ['business_name', 'username']
            },
            images: true,
            slab_pricing: true
          }
        },
        linked_products: {
          fields: ['id', 'name', 'slug', 'base_price'],
          populate: {
            influencer: {
              fields: ['display_name', 'username']
            }
          }
        },
        slab_pricing: true,
        variants: true,
        attributes: true,
        dimensions: true,
        inventory: true,
        commission_settings: true,
        shipping: true,
        compliance: true,
        localization: true,
        marketing: true,
        seo: true
      },
    });

    const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
    return this.transformResponse(sanitizedEntity);
  },

  // Override default create method with role-based logic
  async create(ctx) {
    const { data } = ctx.request.body;
    const user = ctx.state.user;
    
    if (!user) {
      return ctx.unauthorized('You must be authenticated to create products');
    }

    // Determine creator type and set relationships
    let creatorData = {};
    
    if (user.role?.name === 'Vendor') {
      // Find vendor profile
      const vendorProfiles = await strapi.entityService.findMany('api::vendor.vendor', {
        filters: { user: user.id },
      });
      
      if (!vendorProfiles || vendorProfiles.length === 0) {
        return ctx.badRequest('Vendor profile not found');
      }
      
      creatorData = {
        created_by_type: 'vendor',
        vendor: vendorProfiles[0].id,
        influencer: null
      };
      
    } else if (user.role?.name === 'Influencer') {
      // Find influencer profile
      const influencerProfiles = await strapi.entityService.findMany('api::influencer.influencer', {
        filters: { user: user.id },
      });
      
      if (!influencerProfiles || influencerProfiles.length === 0) {
        return ctx.badRequest('Influencer profile not found');
      }
      
      creatorData = {
        created_by_type: 'influencer',
        influencer: influencerProfiles[0].id,
        vendor: null
      };
      
      // If influencer is linking to an existing product
      if (data.original_product) {
        // Verify the original product exists and get its commission settings
        const originalProduct = await strapi.entityService.findOne('api::product.product', data.original_product, {
          populate: ['commission_settings', 'vendor']
        });
        
        if (!originalProduct) {
          return ctx.badRequest('Original product not found');
        }
        
        // Linked products inherit the original product's commission settings
        if (originalProduct.commission_settings) {
          data.commission_settings = originalProduct.commission_settings;
          // Override with influencer's specific commission rate if provided
          if (data.influencer_commission_rate) {
            data.commission_settings.commission_rate = data.influencer_commission_rate;
          }
        }
      }
      
    } else {
      return ctx.forbidden('Only vendors and influencers can create products');
    }

    // Set default commission settings for vendor products
    if (data.created_by_type === 'vendor' && !data.commission_settings) {
      data.commission_settings = {
        commission_rate: data.influencer_commission_rate || 10,
        commission_type: 'percentage',
        minimum_sale_amount: 0,
        is_commission_enabled: true
      };
    }
    
    // Influencer products don't need commission settings (they don't pay others)
    if (data.created_by_type === 'influencer') {
      data.commission_settings = null;
    }

    // Generate SKU if not provided
    if (!data.sku) {
      const timestamp = Date.now();
      const prefix = data.created_by_type === 'vendor' ? 'VND' : 'INF';
      data.sku = `${prefix}-${timestamp}`;
    }

    // Set initial inventory if tracking is enabled
    if (data.inventory?.track_inventory && !data.inventory.stock_quantity) {
      data.inventory.stock_quantity = 0;
      data.inventory.stock_status = 'out_of_stock';
    }

    // Merge creator data with provided data
    const finalData = { ...data, ...creatorData };

    const entity = await strapi.entityService.create('api::product.product', {
      data: finalData,
      populate: {
        images: true,
        vendor: {
          fields: ['id', 'business_name', 'username']
        },
        influencer: {
          fields: ['id', 'display_name', 'username']
        },
        original_product: {
          fields: ['id', 'name', 'slug']
        },
        slab_pricing: true,
        commission_settings: true
      },
    });

    const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
    return this.transformResponse(sanitizedEntity);
  },

  // Custom endpoint to link influencer to vendor product
  async linkProduct(ctx) {
    const { originalProductId } = ctx.params;
    const { data } = ctx.request.body;
    const user = ctx.state.user;
    
    if (!user || user.role?.name !== 'Influencer') {
      return ctx.forbidden('Only influencers can link products');
    }

    // Find influencer profile
    const influencerProfiles = await strapi.entityService.findMany('api::influencer.influencer', {
      filters: { user: user.id },
    });
    
    if (!influencerProfiles || influencerProfiles.length === 0) {
      return ctx.badRequest('Influencer profile not found');
    }

    // Verify original product exists
    const originalProduct = await strapi.entityService.findOne('api::product.product', originalProductId, {
      populate: ['vendor', 'commission_settings', 'images', 'slab_pricing']
    });
    
    if (!originalProduct) {
      return ctx.notFound('Original product not found');
    }

    if (originalProduct.created_by_type !== 'vendor') {
      return ctx.badRequest('Can only link to vendor-created products');
    }

    // Create linked product
    const linkedProductData = {
      name: data.name || `${originalProduct.name} (by ${influencerProfiles[0].display_name})`,
      description: data.description || originalProduct.description,
      base_price: data.base_price || originalProduct.base_price,
      currency: originalProduct.currency,
      product_type: originalProduct.product_type,
      created_by_type: 'influencer',
      influencer: influencerProfiles[0].id,
      original_product: originalProductId,
      categories: originalProduct.categories?.map(cat => cat.id),
      tags: originalProduct.tags,
      slab_pricing: originalProduct.slab_pricing,
      influencer_commission_rate: data.influencer_commission_rate || originalProduct.influencer_commission_rate || 10,
      commission_settings: originalProduct.commission_settings ? {
        ...originalProduct.commission_settings,
        commission_rate: data.influencer_commission_rate || originalProduct.commission_settings.commission_rate || 10
      } : null,
      inventory: {
        track_inventory: false, // Linked products don't manage inventory
        stock_status: 'in_stock'
      },
      shipping: originalProduct.shipping,
      ...data
    };

    const entity = await strapi.entityService.create('api::product.product', {
      data: linkedProductData,
      populate: {
        original_product: {
          populate: {
            vendor: {
              fields: ['business_name', 'username']
            }
          }
        },
        influencer: {
          fields: ['display_name', 'username']
        },
        commission_settings: true
      },
    });

    const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
    return this.transformResponse(sanitizedEntity);
  },

  // Custom endpoint to get products by vendor
  async findByVendor(ctx) {
    const { vendorId } = ctx.params;
    const { query } = ctx;

    const entities = await strapi.entityService.findMany('api::product.product', {
      ...query,
      filters: {
        vendor: vendorId,
        created_by_type: 'vendor'
      },
      populate: {
        images: true,
        categories: true,
        inventory: true,
        slab_pricing: true
      },
    });

    const sanitizedEntity = await this.sanitizeOutput(entities, ctx);
    return this.transformResponse(sanitizedEntity);
  },

  // Custom endpoint to get products by influencer
  async findByInfluencer(ctx) {
    const { influencerId } = ctx.params;
    const { query } = ctx;

    const entities = await strapi.entityService.findMany('api::product.product', {
      ...query,
      filters: {
        influencer: influencerId,
        created_by_type: 'influencer'
      },
      populate: {
        images: true,
        categories: true,
        original_product: {
          populate: {
            vendor: {
              fields: ['business_name', 'username']
            }
          }
        },
        commission_settings: true
      },
    });

    const sanitizedEntity = await this.sanitizeOutput(entities, ctx);
    return this.transformResponse(sanitizedEntity);
  },

  // Custom endpoint to get linked products of an original product
  async getLinkedProducts(ctx) {
    const { productId } = ctx.params;
    const { query } = ctx;

    const entities = await strapi.entityService.findMany('api::product.product', {
      ...query,
      filters: {
        original_product: productId
      },
      populate: {
        influencer: {
          fields: ['display_name', 'username', 'rating']
        },
        commission_settings: true
      },
    });

    const sanitizedEntity = await this.sanitizeOutput(entities, ctx);
    return this.transformResponse(sanitizedEntity);
  },

  // Custom endpoint to calculate pricing with slabs
  async calculatePrice(ctx) {
    const { id } = ctx.params;
    const { quantity = 1 } = ctx.query;

    const product = await strapi.entityService.findOne('api::product.product', id, {
      populate: ['slab_pricing']
    });

    if (!product) {
      return ctx.notFound('Product not found');
    }

    let finalPrice = product.base_price;
    let appliedSlab = null;

    // Find applicable slab pricing
    if (product.slab_pricing && product.slab_pricing.length > 0) {
      const validSlabs = product.slab_pricing
        .filter(slab => slab.is_active && quantity >= slab.min_quantity)
        .filter(slab => !slab.max_quantity || quantity <= slab.max_quantity)
        .sort((a, b) => b.min_quantity - a.min_quantity); // Highest quantity first

      if (validSlabs.length > 0) {
        appliedSlab = validSlabs[0];
        finalPrice = appliedSlab.price;
      }
    }

    const totalPrice = finalPrice * quantity;
    const savings = appliedSlab ? (product.base_price - finalPrice) * quantity : 0;

    return this.transformResponse({
      product_id: product.id,
      quantity: parseInt(quantity),
      base_price: product.base_price,
      unit_price: finalPrice,
      total_price: totalPrice,
      savings: savings,
      applied_slab: appliedSlab,
      currency: product.currency
    });
  }

}));