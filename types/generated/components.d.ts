import type { Struct, Schema } from '@strapi/strapi';

export interface SocialXProfile extends Struct.ComponentSchema {
  collectionName: 'components_social_x_profiles';
  info: {
    displayName: 'X Profile';
    icon: 'alien';
  };
  attributes: {
    handle: Schema.Attribute.String & Schema.Attribute.Required;
    profileId: Schema.Attribute.String;
    displayName: Schema.Attribute.String;
    photoUrl: Schema.Attribute.String;
  };
}

export interface SocialTelegramProfile extends Struct.ComponentSchema {
  collectionName: 'components_social_telegram_profiles';
  info: {
    displayName: 'Telegram Profile';
    description: 'Telegram profile information';
    icon: 'message-circle';
  };
  attributes: {
    username: Schema.Attribute.String & Schema.Attribute.Required;
    telegramId: Schema.Attribute.String;
    displayName: Schema.Attribute.String;
    photoUrl: Schema.Attribute.String;
  };
}

export interface SocialGoogleProfile extends Struct.ComponentSchema {
  collectionName: 'components_social_google_profiles';
  info: {
    displayName: 'Google Profile';
    description: 'Google social profile information';
    icon: 'google';
  };
  attributes: {
    googleId: Schema.Attribute.String & Schema.Attribute.Required;
    displayName: Schema.Attribute.String;
    photoUrl: Schema.Attribute.String;
    email: Schema.Attribute.Email;
  };
}

export interface CryptoWallet extends Struct.ComponentSchema {
  collectionName: 'components_crypto_wallets';
  info: {
    displayName: 'Wallet';
    description: 'Cryptocurrency wallet information';
    icon: 'wallet';
  };
  attributes: {
    address: Schema.Attribute.String & Schema.Attribute.Required;
    chain: Schema.Attribute.Enumeration<
      ['ethereum', 'polygon', 'binance', 'solana', 'bitcoin']
    > &
      Schema.Attribute.Required;
    isDefault: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'social.x-profile': SocialXProfile;
      'social.telegram-profile': SocialTelegramProfile;
      'social.google-profile': SocialGoogleProfile;
      'crypto.wallet': CryptoWallet;
    }
  }
}
