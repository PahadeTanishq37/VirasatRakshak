/**
 * Core Data Models & Entity Schemas (Database Foundation)
 * 
 * Provides type documentation and data contract specifications for 
 * User, HeritageSite, TourBooking, MarketplaceOrder, and QuestProgress.
 */

export const SCHEMAS = {
  User: {
    id: 'String (UUID / Primary Key)',
    name: 'String',
    email: 'String (Unique)',
    authProvider: 'String (google | email)',
    preferredLanguage: 'String (en | hi | mr | ta)',
    createdAt: 'Date',
    updatedAt: 'Date'
  },
  HeritageSite: {
    id: 'String (Slug / Unique Key)',
    name: 'String',
    slug: 'String',
    state: 'String',
    region: 'String (north | south | east | west | central)',
    category: 'String (monument | heritage | nature)',
    description: 'String',
    latitude: 'Number',
    longitude: 'Number',
    image: 'String (URL)',
    icon: 'String (Emoji/SVG)',
    rating: 'Number',
    historicalPeriod: 'String',
    createdAt: 'Date',
    updatedAt: 'Date'
  },
  TourBooking: {
    id: 'String (UUID)',
    userId: 'String (User Reference)',
    packageId: 'String (Package Reference)',
    packageName: 'String',
    travellerDetails: 'Array of Objects { name, age, gender }',
    startDate: 'Date',
    endDate: 'Date',
    totalAmount: 'Number (INR)',
    status: 'String (pending | confirmed | cancelled)',
    paymentStatus: 'String (pending | paid | failed)',
    transactionId: 'String',
    createdAt: 'Date'
  },
  MarketplaceOrder: {
    id: 'String (UUID)',
    userId: 'String (User Reference)',
    items: 'Array of Objects { productId, name, price, quantity }',
    totalAmount: 'Number (INR)',
    shippingAddress: 'Object',
    status: 'String (pending | processing | shipped | delivered)',
    paymentStatus: 'String (pending | paid | failed)',
    createdAt: 'Date'
  },
  QuestProgress: {
    id: 'String (UUID)',
    userId: 'String (User Reference)',
    questId: 'String',
    progressPercentage: 'Number (0-100)',
    isCompleted: 'Boolean',
    xpEarned: 'Number',
    badgesEarned: 'Array of Strings',
    updatedAt: 'Date'
  }
};
