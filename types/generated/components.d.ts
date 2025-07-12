import type { Schema, Struct } from '@strapi/strapi';

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
