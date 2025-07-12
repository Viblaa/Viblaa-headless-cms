import type { Schema, Struct } from '@strapi/strapi';

export interface ProductAttribute extends Struct.ComponentSchema {
  collectionName: 'components_product_attributes';
  info: {
    description: 'Custom attributes and specifications for products';
    displayName: 'Product Attribute';
  };
  attributes: {
    display_order: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    is_filterable: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    is_searchable: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    type: Schema.Attribute.Enumeration<
      ['text', 'number', 'boolean', 'date', 'color', 'url']
    > &
      Schema.Attribute.DefaultTo<'text'>;
    unit: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 20;
      }>;
    value: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 255;
      }>;
  };
}

export interface ProductCommissionSettings extends Struct.ComponentSchema {
  collectionName: 'components_product_commission_settings';
  info: {
    description: 'Commission settings for influencers selling vendor products';
    displayName: 'Influencer Commission Settings';
  };
  attributes: {
    commission_rate: Schema.Attribute.Decimal &
      Schema.Attribute.SetMinMax<
        {
          max: 50;
          min: 0;
        },
        number
      > &
      Schema.Attribute.DefaultTo<10>;
    commission_type: Schema.Attribute.Enumeration<
      ['percentage', 'fixed_amount']
    > &
      Schema.Attribute.DefaultTo<'percentage'>;
    fixed_amount: Schema.Attribute.Decimal &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    is_commission_enabled: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<true>;
    minimum_sale_amount: Schema.Attribute.Decimal &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      > &
      Schema.Attribute.DefaultTo<0>;
    special_commission_rate: Schema.Attribute.Decimal &
      Schema.Attribute.SetMinMax<
        {
          max: 50;
          min: 0;
        },
        number
      >;
    special_rate_valid_from: Schema.Attribute.DateTime;
    special_rate_valid_until: Schema.Attribute.DateTime;
  };
}

export interface ProductCompliance extends Struct.ComponentSchema {
  collectionName: 'components_product_compliance';
  info: {
    description: 'Regulatory and compliance information for global sales';
    displayName: 'Product Compliance';
  };
  attributes: {
    age_restriction: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    allergens: Schema.Attribute.JSON;
    certifications: Schema.Attribute.JSON;
    country_restrictions: Schema.Attribute.JSON;
    eco_friendly: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    fair_trade: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    ingredients: Schema.Attribute.RichText;
    organic: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    recyclable: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    regulatory_approvals: Schema.Attribute.JSON;
    safety_warnings: Schema.Attribute.RichText;
  };
}

export interface ProductDimensions extends Struct.ComponentSchema {
  collectionName: 'components_product_dimensions';
  info: {
    description: 'Physical dimensions of the product';
    displayName: 'Product Dimensions';
  };
  attributes: {
    height: Schema.Attribute.Decimal &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    length: Schema.Attribute.Decimal &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    unit: Schema.Attribute.Enumeration<['cm', 'm', 'in', 'ft']> &
      Schema.Attribute.DefaultTo<'cm'>;
    width: Schema.Attribute.Decimal &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
  };
}

export interface ProductInventory extends Struct.ComponentSchema {
  collectionName: 'components_product_inventories';
  info: {
    description: 'Inventory management for products';
    displayName: 'Product Inventory';
  };
  attributes: {
    allow_backorders: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    backorder_message: Schema.Attribute.Text;
    low_stock_threshold: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      > &
      Schema.Attribute.DefaultTo<10>;
    reserved_quantity: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      > &
      Schema.Attribute.DefaultTo<0>;
    stock_quantity: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      > &
      Schema.Attribute.DefaultTo<0>;
    stock_status: Schema.Attribute.Enumeration<
      ['in_stock', 'low_stock', 'out_of_stock', 'on_backorder']
    > &
      Schema.Attribute.DefaultTo<'in_stock'>;
    supplier_sku: Schema.Attribute.String;
    track_inventory: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<true>;
    warehouse_location: Schema.Attribute.String;
  };
}

export interface ProductLocalization extends Struct.ComponentSchema {
  collectionName: 'components_product_localizations';
  info: {
    description: 'Localized content for different markets and languages';
    displayName: 'Product Localization';
  };
  attributes: {
    currency: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 3;
      }>;
    description: Schema.Attribute.RichText;
    keywords: Schema.Attribute.JSON;
    locale: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 10;
      }>;
    market_specific_info: Schema.Attribute.JSON;
    name: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 255;
      }>;
    price: Schema.Attribute.Decimal &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    short_description: Schema.Attribute.Text;
  };
}

export interface ProductMarketing extends Struct.ComponentSchema {
  collectionName: 'components_product_marketing';
  info: {
    description: 'Marketing and promotional settings for products';
    displayName: 'Product Marketing';
  };
  attributes: {
    affiliate_program_eligible: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<true>;
    badge_color: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 7;
      }>;
    badge_text: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 50;
      }>;
    cross_sell_products: Schema.Attribute.JSON;
    marketing_tags: Schema.Attribute.JSON;
    promotional_text: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 255;
      }>;
    related_products: Schema.Attribute.JSON;
    sale_end_date: Schema.Attribute.DateTime;
    sale_price: Schema.Attribute.Decimal &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    sale_start_date: Schema.Attribute.DateTime;
    social_sharing_enabled: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<true>;
    upsell_products: Schema.Attribute.JSON;
  };
}

export interface ProductPricingSlab extends Struct.ComponentSchema {
  collectionName: 'components_product_pricing_slabs';
  info: {
    description: 'Quantity-based pricing tiers for bulk purchases';
    displayName: 'Pricing Slab';
  };
  attributes: {
    description: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 255;
      }>;
    discount_amount: Schema.Attribute.Decimal &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    discount_percentage: Schema.Attribute.Decimal &
      Schema.Attribute.SetMinMax<
        {
          max: 100;
          min: 0;
        },
        number
      >;
    is_active: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    max_quantity: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    min_quantity: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    price: Schema.Attribute.Decimal &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    tier_name: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    valid_from: Schema.Attribute.DateTime;
    valid_until: Schema.Attribute.DateTime;
  };
}

export interface ProductShipping extends Struct.ComponentSchema {
  collectionName: 'components_product_shipping';
  info: {
    description: 'Shipping configuration for products';
    displayName: 'Product Shipping';
  };
  attributes: {
    fragile: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    free_shipping_threshold: Schema.Attribute.Decimal &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    handling_time: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      > &
      Schema.Attribute.DefaultTo<1>;
    handling_time_unit: Schema.Attribute.Enumeration<
      ['hours', 'days', 'weeks']
    > &
      Schema.Attribute.DefaultTo<'days'>;
    hazardous_material: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    requires_shipping: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<true>;
    restricted_countries: Schema.Attribute.JSON;
    shipping_class: Schema.Attribute.Enumeration<
      ['standard', 'express', 'overnight', 'freight', 'digital']
    > &
      Schema.Attribute.DefaultTo<'standard'>;
    shipping_cost: Schema.Attribute.Decimal &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    shipping_zones: Schema.Attribute.JSON;
    signature_required: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
  };
}

export interface ProductVariant extends Struct.ComponentSchema {
  collectionName: 'components_product_variants';
  info: {
    description: 'Product variations like size, color, material etc.';
    displayName: 'Product Variant';
  };
  attributes: {
    barcode: Schema.Attribute.String;
    compare_at_price: Schema.Attribute.Decimal &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    cost_price: Schema.Attribute.Decimal &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    images: Schema.Attribute.Media<'images', true>;
    is_active: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    is_default: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 255;
      }>;
    price: Schema.Attribute.Decimal &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    sku: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 50;
      }>;
    stock_quantity: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      > &
      Schema.Attribute.DefaultTo<0>;
    variant_options: Schema.Attribute.JSON;
    weight: Schema.Attribute.Decimal &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
  };
}

export interface SharedAddress extends Struct.ComponentSchema {
  collectionName: 'components_shared_addresses';
  info: {
    description: 'Physical address component';
    displayName: 'Address';
  };
  attributes: {
    city: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    country: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    latitude: Schema.Attribute.Decimal;
    longitude: Schema.Attribute.Decimal;
    postal_code: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 20;
      }>;
    state: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    street_address: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 255;
      }>;
  };
}

export interface SharedMedia extends Struct.ComponentSchema {
  collectionName: 'components_shared_media';
  info: {
    displayName: 'Media';
    icon: 'file-video';
  };
  attributes: {
    file: Schema.Attribute.Media<'images' | 'files' | 'videos'>;
  };
}

export interface SharedQuote extends Struct.ComponentSchema {
  collectionName: 'components_shared_quotes';
  info: {
    displayName: 'Quote';
    icon: 'indent';
  };
  attributes: {
    body: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

export interface SharedRichText extends Struct.ComponentSchema {
  collectionName: 'components_shared_rich_texts';
  info: {
    description: '';
    displayName: 'Rich text';
    icon: 'align-justify';
  };
  attributes: {
    body: Schema.Attribute.RichText;
  };
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seos';
  info: {
    description: '';
    displayName: 'Seo';
    icon: 'allergies';
    name: 'Seo';
  };
  attributes: {
    metaDescription: Schema.Attribute.Text & Schema.Attribute.Required;
    metaTitle: Schema.Attribute.String & Schema.Attribute.Required;
    shareImage: Schema.Attribute.Media<'images'>;
  };
}

export interface SharedSlider extends Struct.ComponentSchema {
  collectionName: 'components_shared_sliders';
  info: {
    description: '';
    displayName: 'Slider';
    icon: 'address-book';
  };
  attributes: {
    files: Schema.Attribute.Media<'images', true>;
  };
}

export interface SharedSocialNetwork extends Struct.ComponentSchema {
  collectionName: 'components_shared_social_networks';
  info: {
    description: 'Social media platform details for influencers';
    displayName: 'Social Network';
  };
  attributes: {
    account_type: Schema.Attribute.Enumeration<
      ['personal', 'business', 'creator']
    > &
      Schema.Attribute.DefaultTo<'personal'>;
    audience_age_range: Schema.Attribute.JSON;
    audience_gender_split: Schema.Attribute.JSON;
    audience_location: Schema.Attribute.JSON;
    average_comments: Schema.Attribute.BigInteger &
      Schema.Attribute.DefaultTo<0>;
    average_likes: Schema.Attribute.BigInteger & Schema.Attribute.DefaultTo<0>;
    average_shares: Schema.Attribute.BigInteger & Schema.Attribute.DefaultTo<0>;
    average_views: Schema.Attribute.BigInteger & Schema.Attribute.DefaultTo<0>;
    collaboration_rate_live: Schema.Attribute.Decimal &
      Schema.Attribute.DefaultTo<0>;
    collaboration_rate_post: Schema.Attribute.Decimal &
      Schema.Attribute.DefaultTo<0>;
    collaboration_rate_story: Schema.Attribute.Decimal &
      Schema.Attribute.DefaultTo<0>;
    collaboration_rate_video: Schema.Attribute.Decimal &
      Schema.Attribute.DefaultTo<0>;
    content_categories: Schema.Attribute.JSON;
    engagement_rate: Schema.Attribute.Decimal &
      Schema.Attribute.SetMinMax<
        {
          max: 100;
          min: 0;
        },
        number
      > &
      Schema.Attribute.DefaultTo<0>;
    followers_count: Schema.Attribute.BigInteger &
      Schema.Attribute.DefaultTo<0>;
    handle: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    is_primary: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    last_updated: Schema.Attribute.DateTime;
    media_samples: Schema.Attribute.JSON;
    niche_tags: Schema.Attribute.JSON;
    platform: Schema.Attribute.Enumeration<
      [
        'instagram',
        'tiktok',
        'youtube',
        'facebook',
        'twitter',
        'linkedin',
        'pinterest',
        'snapchat',
        'twitch',
        'discord',
        'telegram',
        'whatsapp',
        'clubhouse',
        'reddit',
        'medium',
        'substack',
        'other',
      ]
    > &
      Schema.Attribute.DefaultTo<'other'>;
    posting_frequency: Schema.Attribute.Enumeration<
      ['daily', 'weekly', 'bi-weekly', 'monthly', 'occasional']
    > &
      Schema.Attribute.DefaultTo<'weekly'>;
    profile_url: Schema.Attribute.String;
    verified: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'product.attribute': ProductAttribute;
      'product.commission-settings': ProductCommissionSettings;
      'product.compliance': ProductCompliance;
      'product.dimensions': ProductDimensions;
      'product.inventory': ProductInventory;
      'product.localization': ProductLocalization;
      'product.marketing': ProductMarketing;
      'product.pricing-slab': ProductPricingSlab;
      'product.shipping': ProductShipping;
      'product.variant': ProductVariant;
      'shared.address': SharedAddress;
      'shared.media': SharedMedia;
      'shared.quote': SharedQuote;
      'shared.rich-text': SharedRichText;
      'shared.seo': SharedSeo;
      'shared.slider': SharedSlider;
      'shared.social-network': SharedSocialNetwork;
    }
  }
}
