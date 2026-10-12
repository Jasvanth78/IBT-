export const SOCKET_CHANNELS = {
  SITE_SETTINGS: "site-settings",
} as const;

export const SOCKET_EVENTS = {
  CONNECTION_READY: "connection:ready",
  SITE_SETTINGS_UPDATED: "site-settings:updated",
} as const;

export type SiteSettingsRealtimePayload = {
  maintenanceMode: boolean;
  maintenanceMessage: string | null;
  maintenanceEndTime: string | null;
  whatsappNumber?: string | null;
  servicesHeroTitle?: string | null;
  servicesHeroGradient?: string | null;
  servicesHeroBadge?: string | null;
  servicesHeroDescription?: string | null;
  servicesHeroBtn1Text?: string | null;
  servicesHeroBtn1Url?: string | null;
  servicesHeroBtn2Text?: string | null;
  servicesHeroBtn2Url?: string | null;
  servicesCapTitle?: string | null;
  servicesCapHighlight?: string | null;
  servicesCapBadge?: string | null;
  servicesCapDescription?: string | null;
  servicesProcessTitle?: string | null;
  servicesProcessBadge?: string | null;
  servicesProcessDescription?: string | null;
  servicesProcessSteps?: Array<{ step: string; title: string; desc: string }> | null;
  servicesWhyTitle?: string | null;
  servicesWhyBadge?: string | null;
  servicesWhyDescription?: string | null;
  servicesWhyItems?: string | null;
  servicesWhyPromiseBadge?: string | null;
  servicesWhyPromiseQuote?: string | null;
  servicesWhyPromiseAuthor?: string | null;
  servicesWhyPromiseSub?: string | null;
  servicesWhyPromiseTags?: string | null;
  servicesCtaTitle?: string | null;
  servicesCtaBadge?: string | null;
  servicesCtaDescription?: string | null;
  servicesCtaBtn1Text?: string | null;
  servicesCtaBtn1Url?: string | null;
  servicesCtaBtn2Text?: string | null;
  servicesCtaBtn2Url?: string | null;

  // Products Page
  productsHeroTitle?: string | null;
  productsHeroHighlight?: string | null;
  productsHeroDescription?: string | null;
  productsHeroImageUrl?: string | null;
  productsHeroProjectsDelivered?: string | null;
  productsHeroClientSatisfaction?: string | null;
  productsMicroAppsTitle?: string | null;
  productsMicroAppsSubtitle?: string | null;
  productsMicroAppsLeftIntro?: string | null;
  productsMicroAppsLeftHeading?: string | null;
  productsMicroAppsLeftText?: string | null;
  productsMicroAppsLeftBullets?: string[] | null;
  productsMicroAppsRightTextTop?: string | null;
  productsMicroAppsRightHeading?: string | null;
  productsMicroAppsRightBullets?: string[] | null;
  productsMicroAppsRightTextBottom?: string | null;

  // Home – Video Background
  homeVideoUrl?: string | null;
  homeVideoEnabled?: boolean;

  // Home Solutions
  homeSolutionsTitle?: string | null;
  homeSolutionsBadge?: string | null;
  homeSolutionsDescription?: string | null;
  homeSolutionsItems?: any[] | null;

  // About Page
  aboutWhoTitle?: string | null;
  aboutWhoDescription?: string | null;
  aboutWhoSecondaryDescription?: string | null;
  aboutWhoFeatures?: any[] | null;
  aboutWhoImages?: any[] | null;
  aboutProcessBadge?: string | null;
  aboutProcessTitle?: string | null;
  aboutProcessFeatures?: any[] | null;
  aboutProcessImage?: string | null;
  aboutMissionTitle?: string | null;
  aboutMissionDesc?: string | null;
  aboutVisionTitle?: string | null;
  aboutVisionDesc?: string | null;
  aboutMissionCards?: any[] | null;
  aboutContactBadge?: string | null;
  aboutContactTitle?: string | null;
  aboutContactImage?: string | null;

  // Contact – Hero & Presence
  contactHeroTitle?: string | null;
  contactHeroDescription?: string | null;
  contactGlobalPresenceBadge?: string | null;
  contactGlobalPresenceTitle?: string | null;

  // Contact – Branch 1
  contactBranch1Title?: string | null;
  contactBranch1Address?: string | null;
  contactBranch1MapLink?: string | null;
  contactBranch1LatLong?: string | null;
  contactBranch1MarkerX?: string | number | null;
  contactBranch1MarkerY?: string | number | null;

  // Contact – Branch 2
  contactBranch2Title?: string | null;
  contactBranch2Address?: string | null;
  contactBranch2MapLink?: string | null;
  contactBranch2LatLong?: string | null;
  contactBranch2MarkerX?: string | number | null;
  contactBranch2MarkerY?: string | number | null;

  // Contact – Branch 3
  contactBranch3Title?: string | null;
  contactBranch3Address?: string | null;
  contactBranch3MapLink?: string | null;
  contactBranch3LatLong?: string | null;
  contactBranch3MarkerX?: string | number | null;
  contactBranch3MarkerY?: string | number | null;

  // Contact – Support Channels
  contactSupportTitle?: string | null;
  contactSupportDescription?: string | null;
  contactSupportItem1Title?: string | null;
  contactSupportItem1Desc?: string | null;
  contactSupportItem1Link?: string | null;
  contactSupportItem2Title?: string | null;
  contactSupportItem2Desc?: string | null;
  contactSupportItem2Link?: string | null;
  contactSupportItem3Title?: string | null;
  contactSupportItem3Desc?: string | null;
  contactSupportItem3Status?: string | null;

  // Contact – FAQs
  contactFaqTitle?: string | null;
  contactFaqDescription?: string | null;
  contactFaq1Question?: string | null;
  contactFaq1Answer?: string | null;
  contactFaq2Question?: string | null;
  contactFaq2Answer?: string | null;
  contactFaq3Question?: string | null;
  contactFaq3Answer?: string | null;

  // Contact – Dynamic Branches List
  contactBranches?: any[] | null;

  updatedAt: string | null;
};
