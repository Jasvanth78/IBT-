/**
 * Socket.IO Event Types & Payloads
 */

export const SOCKET_CHANNELS = {
  SITE_SETTINGS: 'site-settings',
} as const;

export const SOCKET_EVENTS = {
  CONNECTION_READY: 'connection:ready',
  SITE_SETTINGS_UPDATED: 'site-settings:updated',
  ERROR: 'error',
  DISCONNECT: 'disconnect',
  RECONNECT: 'reconnect',
} as const;

/**
 * Site settings update payload (matches backend)
 */
export interface SiteSettingsRealtimePayload {
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
  servicesWhyItems?: string | WhyItem[] | null;
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

  // Services – What We Do Section
  servicesWhatTitle?: string | null;
  servicesWhatDescription?: string | null;
  servicesWhatFeatures?: Array<{ title: string; desc: string; icon: string }> | null;
  servicesWhatImages?: string[] | null;

  // Home – Video Background
  homeVideoUrl?: string | null;
  homeVideoEnabled?: boolean;

  // Home – Solutions Section
  homeSolutionsTitle?: string | null;
  homeSolutionsBadge?: string | null;
  homeSolutionsDescription?: string | null;
  homeSolutionsItems?: string[] | string | null;

  // Home – Recent Work Section
  homeRecentWorkTitle?: string | null;
  homeRecentWorkBadge?: string | null;
  homeRecentWorkItems?: any[] | string | null;

  // Home – Services Section
  homeServicesTitle?: string | null;
  homeServicesBadge?: string | null;

  // Labs – Hero
  labs_hero_title?: string | null;
  labs_hero_subtitle?: string | null;
  labs_hero_description?: string | null;
  labs_hero_image_url?: string | null;
  labs_hero_btn1_text?: string | null;
  labs_hero_btn2_text?: string | null;

  // Labs – Page Intro
  labs_page_title?: string | null;
  labs_page_subtitle?: string | null;
  labs_intro_description?: string | null;
  labs_intro_image_url?: string | null;
  labs_intro_btn_text?: string | null;
  labs_intro_feature1_title?: string | null;
  labs_intro_feature1_desc?: string | null;
  labs_intro_feature2_title?: string | null;
  labs_intro_feature2_desc?: string | null;
  labs_intro_feature3_title?: string | null;
  labs_intro_feature3_desc?: string | null;
  labs_intro_feature4_title?: string | null;
  labs_intro_feature4_desc?: string | null;

  // Labs – Spotlights & Careers
  labs_spotlights?: any[] | null;
  labs_careers_title?: string | null;
  labs_careers_description?: string | null;
  labs_careers_btn_text?: string | null;

  // Labs – CTA
  labs_cta_title?: string | null;
  labs_cta_description?: string | null;
  labs_cta_btn_text?: string | null;

  // Labs – Initiatives, Rigor, Mentorship
  labs_initiatives?: any[] | null;
  labs_rigor_title?: string | null;
  labs_rigor_description?: string | null;
  labs_rigor_points?: any[] | null;
  labs_rigor_image?: string | null;
  labs_mentorship_title?: string | null;
  labs_mentorship_description?: string | null;
  labs_mentorship_image?: string | null;
  labs_mentorship_quote?: string | null;
  labs_mentorship_quote_author?: string | null;
  labs_mentorship_quote_role?: string | null;
  labs_mentorship_quote_avatar?: string | null;

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

  updatedAt: string;
}

/**
 * Socket client state
 */
export interface SocketState {
  connected: boolean;
  connecting: boolean;
  isReady: boolean;
  error: string | null;
  lastUpdate: string | null;
}

/**
 * Combined settings state
 */
export interface SiteSettingsState extends SiteSettingsRealtimePayload {
  loading: boolean;
  error: string | null;
}

export interface WhyItem {
  title: string;
  description: string;
}

