/**
 * Settings API Helper
 * Fetches public settings data
 */

import { SiteSettingsRealtimePayload } from '@/src/types/socket';
import { apiClient } from './client';

/**
 * Get current site settings (initial load)
 */
export const fetchSiteSettings = async (): Promise<SiteSettingsRealtimePayload> => {
  try {
    const data = (await apiClient.getSettings()) as Partial<SiteSettingsRealtimePayload> | null;

    // Map API response to payload format
    return {
      maintenanceMode: data?.maintenanceMode ?? false,
      maintenanceMessage: data?.maintenanceMessage ?? null,
      maintenanceEndTime: data?.maintenanceEndTime ?? null,
      whatsappNumber: data?.whatsappNumber ?? null,
      servicesHeroTitle: data?.servicesHeroTitle ?? null,
      servicesHeroGradient: data?.servicesHeroGradient ?? null,
      servicesHeroBadge: data?.servicesHeroBadge ?? null,
      servicesHeroDescription: data?.servicesHeroDescription ?? null,
      servicesHeroBtn1Text: data?.servicesHeroBtn1Text ?? null,
      servicesHeroBtn1Url: data?.servicesHeroBtn1Url ?? null,
      servicesHeroBtn2Text: data?.servicesHeroBtn2Text ?? null,
      servicesHeroBtn2Url: data?.servicesHeroBtn2Url ?? null,
      servicesCapTitle: data?.servicesCapTitle ?? null,
      servicesCapHighlight: data?.servicesCapHighlight ?? null,
      servicesCapBadge: data?.servicesCapBadge ?? null,
      servicesCapDescription: data?.servicesCapDescription ?? null,
      servicesProcessTitle: data?.servicesProcessTitle ?? null,
      servicesProcessBadge: data?.servicesProcessBadge ?? null,
      servicesProcessDescription: data?.servicesProcessDescription ?? null,
      servicesProcessSteps: data?.servicesProcessSteps ?? null,
      servicesWhyTitle: data?.servicesWhyTitle ?? null,
      servicesWhyBadge: data?.servicesWhyBadge ?? null,
      servicesWhyDescription: data?.servicesWhyDescription ?? null,
      servicesWhyItems: data?.servicesWhyItems ?? null,
      servicesWhyPromiseBadge: data?.servicesWhyPromiseBadge ?? null,
      servicesWhyPromiseQuote: data?.servicesWhyPromiseQuote ?? null,
      servicesWhyPromiseAuthor: data?.servicesWhyPromiseAuthor ?? null,
      servicesWhyPromiseSub: data?.servicesWhyPromiseSub ?? null,
      servicesWhyPromiseTags: data?.servicesWhyPromiseTags ?? null,
      servicesCtaTitle: data?.servicesCtaTitle ?? null,
      servicesCtaBadge: data?.servicesCtaBadge ?? null,
      servicesCtaDescription: data?.servicesCtaDescription ?? null,
      servicesCtaBtn1Text: data?.servicesCtaBtn1Text ?? null,
      servicesCtaBtn1Url: data?.servicesCtaBtn1Url ?? null,
      servicesCtaBtn2Text: data?.servicesCtaBtn2Text ?? null,
      servicesCtaBtn2Url: data?.servicesCtaBtn2Url ?? null,

      // Services – What We Do Section
      servicesWhatTitle: data?.servicesWhatTitle ?? null,
      servicesWhatDescription: data?.servicesWhatDescription ?? null,
      servicesWhatFeatures: data?.servicesWhatFeatures ?? null,
      servicesWhatImages: data?.servicesWhatImages ?? null,

      // Products Page
      productsHeroTitle: data?.productsHeroTitle ?? null,
      productsHeroHighlight: data?.productsHeroHighlight ?? null,
      productsHeroDescription: data?.productsHeroDescription ?? null,
      productsHeroImageUrl: data?.productsHeroImageUrl ?? null,
      productsHeroProjectsDelivered: data?.productsHeroProjectsDelivered ?? null,
      productsHeroClientSatisfaction: data?.productsHeroClientSatisfaction ?? null,
      productsMicroAppsTitle: data?.productsMicroAppsTitle ?? null,
      productsMicroAppsSubtitle: data?.productsMicroAppsSubtitle ?? null,
      productsMicroAppsLeftIntro: data?.productsMicroAppsLeftIntro ?? null,
      productsMicroAppsLeftHeading: data?.productsMicroAppsLeftHeading ?? null,
      productsMicroAppsLeftText: data?.productsMicroAppsLeftText ?? null,
      productsMicroAppsLeftBullets: data?.productsMicroAppsLeftBullets ?? null,
      productsMicroAppsRightTextTop: data?.productsMicroAppsRightTextTop ?? null,
      productsMicroAppsRightHeading: data?.productsMicroAppsRightHeading ?? null,
      productsMicroAppsRightBullets: data?.productsMicroAppsRightBullets ?? null,
      productsMicroAppsRightTextBottom: data?.productsMicroAppsRightTextBottom ?? null,

      // Home – Solutions Section
      homeSolutionsTitle: data?.homeSolutionsTitle ?? null,
      homeSolutionsBadge: data?.homeSolutionsBadge ?? null,
      homeSolutionsDescription: data?.homeSolutionsDescription ?? null,
      homeSolutionsItems: data?.homeSolutionsItems ?? null,

      // Home – Services & Recent Work Sections
      homeServicesTitle: data?.homeServicesTitle ?? null,
      homeServicesBadge: data?.homeServicesBadge ?? null,
      homeRecentWorkTitle: data?.homeRecentWorkTitle ?? null,
      homeRecentWorkBadge: data?.homeRecentWorkBadge ?? null,
      homeRecentWorkItems: data?.homeRecentWorkItems ?? null,

      // Labs – Hero
      labs_hero_title: data?.labs_hero_title ?? null,
      labs_hero_subtitle: data?.labs_hero_subtitle ?? null,
      labs_hero_description: data?.labs_hero_description ?? null,
      labs_hero_image_url: data?.labs_hero_image_url ?? null,
      labs_hero_btn1_text: data?.labs_hero_btn1_text ?? null,
      labs_hero_btn2_text: data?.labs_hero_btn2_text ?? null,

      // Labs – Page Intro
      labs_page_title: data?.labs_page_title ?? null,
      labs_page_subtitle: data?.labs_page_subtitle ?? null,
      labs_intro_description: data?.labs_intro_description ?? null,
      labs_intro_image_url: data?.labs_intro_image_url ?? null,
      labs_intro_btn_text: data?.labs_intro_btn_text ?? null,
      labs_intro_feature1_title: data?.labs_intro_feature1_title ?? null,
      labs_intro_feature1_desc: data?.labs_intro_feature1_desc ?? null,
      labs_intro_feature2_title: data?.labs_intro_feature2_title ?? null,
      labs_intro_feature2_desc: data?.labs_intro_feature2_desc ?? null,
      labs_intro_feature3_title: data?.labs_intro_feature3_title ?? null,
      labs_intro_feature3_desc: data?.labs_intro_feature3_desc ?? null,
      labs_intro_feature4_title: data?.labs_intro_feature4_title ?? null,
      labs_intro_feature4_desc: data?.labs_intro_feature4_desc ?? null,

      // Labs – Spotlights & Careers
      labs_spotlights: data?.labs_spotlights ?? null,
      labs_careers_title: data?.labs_careers_title ?? null,
      labs_careers_description: data?.labs_careers_description ?? null,
      labs_careers_btn_text: data?.labs_careers_btn_text ?? null,

      // Labs – CTA
      labs_cta_title: data?.labs_cta_title ?? null,
      labs_cta_description: data?.labs_cta_description ?? null,
      labs_cta_btn_text: data?.labs_cta_btn_text ?? null,

      // Labs – Initiatives, Rigor, Mentorship
      labs_initiatives: data?.labs_initiatives ?? null,
      labs_rigor_title: data?.labs_rigor_title ?? null,
      labs_rigor_description: data?.labs_rigor_description ?? null,
      labs_rigor_points: data?.labs_rigor_points ?? null,
      labs_rigor_image: data?.labs_rigor_image ?? null,
      labs_mentorship_title: data?.labs_mentorship_title ?? null,
      labs_mentorship_description: data?.labs_mentorship_description ?? null,
      labs_mentorship_image: data?.labs_mentorship_image ?? null,
      labs_mentorship_quote: data?.labs_mentorship_quote ?? null,
      labs_mentorship_quote_author: data?.labs_mentorship_quote_author ?? null,
      labs_mentorship_quote_role: data?.labs_mentorship_quote_role ?? null,
      labs_mentorship_quote_avatar: data?.labs_mentorship_quote_avatar ?? null,

      // About Page
      aboutWhoTitle: data?.aboutWhoTitle ?? null,
      aboutWhoDescription: data?.aboutWhoDescription ?? null,
      aboutWhoSecondaryDescription: data?.aboutWhoSecondaryDescription ?? null,
      aboutWhoFeatures: data?.aboutWhoFeatures ?? null,
      aboutWhoImages: data?.aboutWhoImages ?? null,
      aboutProcessBadge: data?.aboutProcessBadge ?? null,
      aboutProcessTitle: data?.aboutProcessTitle ?? null,
      aboutProcessFeatures: data?.aboutProcessFeatures ?? null,
      aboutProcessImage: data?.aboutProcessImage ?? null,
      aboutMissionTitle: data?.aboutMissionTitle ?? null,
      aboutMissionDesc: data?.aboutMissionDesc ?? null,
      aboutVisionTitle: data?.aboutVisionTitle ?? null,
      aboutVisionDesc: data?.aboutVisionDesc ?? null,
      aboutMissionCards: data?.aboutMissionCards ?? null,
      aboutContactBadge: data?.aboutContactBadge ?? null,
      aboutContactTitle: data?.aboutContactTitle ?? null,
      aboutContactImage: data?.aboutContactImage ?? null,

      homeVideoUrl: data?.homeVideoUrl ?? null,
      homeVideoEnabled: data?.homeVideoEnabled ?? false,

      // Contact – Hero & Presence
      contactHeroTitle: data?.contactHeroTitle ?? null,
      contactHeroDescription: data?.contactHeroDescription ?? null,
      contactGlobalPresenceBadge: data?.contactGlobalPresenceBadge ?? null,
      contactGlobalPresenceTitle: data?.contactGlobalPresenceTitle ?? null,

      // Contact – Branch 1
      contactBranch1Title: data?.contactBranch1Title ?? null,
      contactBranch1Address: data?.contactBranch1Address ?? null,
      contactBranch1MapLink: data?.contactBranch1MapLink ?? null,
      contactBranch1LatLong: data?.contactBranch1LatLong ?? null,
      contactBranch1MarkerX: data?.contactBranch1MarkerX ?? null,
      contactBranch1MarkerY: data?.contactBranch1MarkerY ?? null,

      // Contact – Branch 2
      contactBranch2Title: data?.contactBranch2Title ?? null,
      contactBranch2Address: data?.contactBranch2Address ?? null,
      contactBranch2MapLink: data?.contactBranch2MapLink ?? null,
      contactBranch2LatLong: data?.contactBranch2LatLong ?? null,
      contactBranch2MarkerX: data?.contactBranch2MarkerX ?? null,
      contactBranch2MarkerY: data?.contactBranch2MarkerY ?? null,

      // Contact – Branch 3
      contactBranch3Title: data?.contactBranch3Title ?? null,
      contactBranch3Address: data?.contactBranch3Address ?? null,
      contactBranch3MapLink: data?.contactBranch3MapLink ?? null,
      contactBranch3LatLong: data?.contactBranch3LatLong ?? null,
      contactBranch3MarkerX: data?.contactBranch3MarkerX ?? null,
      contactBranch3MarkerY: data?.contactBranch3MarkerY ?? null,

      // Contact – Support Channels
      contactSupportTitle: data?.contactSupportTitle ?? null,
      contactSupportDescription: data?.contactSupportDescription ?? null,
      contactSupportItem1Title: data?.contactSupportItem1Title ?? null,
      contactSupportItem1Desc: data?.contactSupportItem1Desc ?? null,
      contactSupportItem1Link: data?.contactSupportItem1Link ?? null,
      contactSupportItem2Title: data?.contactSupportItem2Title ?? null,
      contactSupportItem2Desc: data?.contactSupportItem2Desc ?? null,
      contactSupportItem2Link: data?.contactSupportItem2Link ?? null,
      contactSupportItem3Title: data?.contactSupportItem3Title ?? null,
      contactSupportItem3Desc: data?.contactSupportItem3Desc ?? null,
      contactSupportItem3Status: data?.contactSupportItem3Status ?? null,

      // Contact – FAQs
      contactFaqTitle: data?.contactFaqTitle ?? null,
      contactFaqDescription: data?.contactFaqDescription ?? null,
      contactFaq1Question: data?.contactFaq1Question ?? null,
      contactFaq1Answer: data?.contactFaq1Answer ?? null,
      contactFaq2Question: data?.contactFaq2Question ?? null,
      contactFaq2Answer: data?.contactFaq2Answer ?? null,
      contactFaq3Question: data?.contactFaq3Question ?? null,
      contactFaq3Answer: data?.contactFaq3Answer ?? null,
      contactBranches: data?.contactBranches ?? null,

      updatedAt: data?.updatedAt ?? new Date().toISOString(),
    };
  } catch (error: any) {
    console.warn('[Settings API] Warning: Could not fetch settings from backend:', error?.message || 'Connection refused');
    // Return safe defaults if fetch fails
    return {
      maintenanceMode: false,
      maintenanceMessage: null,
      maintenanceEndTime: null,
      whatsappNumber: null,
      servicesHeroTitle: null,
      servicesHeroGradient: null,
      servicesHeroBadge: null,
      servicesHeroDescription: null,
      servicesHeroBtn1Text: null,
      servicesHeroBtn1Url: null,
      servicesHeroBtn2Text: null,
      servicesHeroBtn2Url: null,
      servicesCapTitle: null,
      servicesCapHighlight: null,
      servicesCapBadge: null,
      servicesCapDescription: null,
      servicesProcessTitle: null,
      servicesProcessBadge: null,
      servicesProcessDescription: null,
      servicesProcessSteps: null,
      servicesWhyTitle: null,
      servicesWhyBadge: null,
      servicesWhyDescription: null,
      servicesWhyItems: null,
      servicesWhyPromiseBadge: null,
      servicesWhyPromiseQuote: null,
      servicesWhyPromiseAuthor: null,
      servicesWhyPromiseSub: null,
      servicesWhyPromiseTags: null,
      servicesCtaTitle: null,
      servicesCtaBadge: null,
      servicesCtaDescription: null,
      servicesCtaBtn1Text: null,
      servicesCtaBtn1Url: null,
      servicesCtaBtn2Text: null,
      servicesCtaBtn2Url: null,

      // Services – What We Do Section
      servicesWhatTitle: null,
      servicesWhatDescription: null,
      servicesWhatFeatures: null,
      servicesWhatImages: null,

      // Products Page
      productsHeroTitle: null,
      productsHeroHighlight: null,
      productsHeroDescription: null,
      productsHeroImageUrl: null,
      productsHeroProjectsDelivered: null,
      productsHeroClientSatisfaction: null,
      productsMicroAppsTitle: null,
      productsMicroAppsSubtitle: null,
      productsMicroAppsLeftIntro: null,
      productsMicroAppsLeftHeading: null,
      productsMicroAppsLeftText: null,
      productsMicroAppsLeftBullets: null,
      productsMicroAppsRightTextTop: null,
      productsMicroAppsRightHeading: null,
      productsMicroAppsRightBullets: null,
      productsMicroAppsRightTextBottom: null,

      // Home – Services & Recent Work Sections
      homeServicesTitle: null,
      homeServicesBadge: null,
      homeRecentWorkTitle: null,
      homeRecentWorkBadge: null,
      homeRecentWorkItems: null,

      // Labs – Hero
      labs_hero_title: null,
      labs_hero_subtitle: null,
      labs_hero_description: null,
      labs_hero_image_url: null,
      labs_hero_btn1_text: null,
      labs_hero_btn2_text: null,

      // Labs – Page Intro
      labs_page_title: null,
      labs_page_subtitle: null,
      labs_intro_description: null,
      labs_intro_image_url: null,
      labs_intro_btn_text: null,
      labs_intro_feature1_title: null,
      labs_intro_feature1_desc: null,
      labs_intro_feature2_title: null,
      labs_intro_feature2_desc: null,
      labs_intro_feature3_title: null,
      labs_intro_feature3_desc: null,
      labs_intro_feature4_title: null,
      labs_intro_feature4_desc: null,

      // Labs – Spotlights & Careers
      labs_spotlights: null,
      labs_careers_title: null,
      labs_careers_description: null,
      labs_careers_btn_text: null,

      // Labs – CTA
      labs_cta_title: null,
      labs_cta_description: null,
      labs_cta_btn_text: null,

      // Labs – Initiatives, Rigor, Mentorship
      labs_initiatives: null,
      labs_rigor_title: null,
      labs_rigor_description: null,
      labs_rigor_points: null,
      labs_rigor_image: null,
      labs_mentorship_title: null,
      labs_mentorship_description: null,
      labs_mentorship_image: null,
      labs_mentorship_quote: null,
      labs_mentorship_quote_author: null,
      labs_mentorship_quote_role: null,
      labs_mentorship_quote_avatar: null,

      // About Defaults
      aboutWhoTitle: null,
      aboutWhoDescription: null,
      aboutWhoSecondaryDescription: null,
      aboutWhoFeatures: null,
      aboutWhoImages: null,
      aboutProcessBadge: null,
      aboutProcessTitle: null,
      aboutProcessFeatures: null,
      aboutProcessImage: null,
      aboutMissionTitle: null,
      aboutMissionDesc: null,
      aboutVisionTitle: null,
      aboutVisionDesc: null,
      aboutMissionCards: null,
      aboutContactBadge: null,
      aboutContactTitle: null,
      aboutContactImage: null,

      // Contact Defaults
      contactHeroTitle: null,
      contactHeroDescription: null,
      contactGlobalPresenceBadge: null,
      contactGlobalPresenceTitle: null,
      contactBranch1Title: null,
      contactBranch1Address: null,
      contactBranch1MapLink: null,
      contactBranch1LatLong: null,
      contactBranch1MarkerX: null,
      contactBranch1MarkerY: null,
      contactBranch2Title: null,
      contactBranch2Address: null,
      contactBranch2MapLink: null,
      contactBranch2LatLong: null,
      contactBranch2MarkerX: null,
      contactBranch2MarkerY: null,
      contactBranch3Title: null,
      contactBranch3Address: null,
      contactBranch3MapLink: null,
      contactBranch3LatLong: null,
      contactBranch3MarkerX: null,
      contactBranch3MarkerY: null,
      contactSupportTitle: null,
      contactSupportDescription: null,
      contactSupportItem1Title: null,
      contactSupportItem1Desc: null,
      contactSupportItem1Link: null,
      contactSupportItem2Title: null,
      contactSupportItem2Desc: null,
      contactSupportItem2Link: null,
      contactSupportItem3Title: null,
      contactSupportItem3Desc: null,
      contactSupportItem3Status: null,
      contactFaqTitle: null,
      contactFaqDescription: null,
      contactFaq1Question: null,
      contactFaq1Answer: null,
      contactFaq2Question: null,
      contactFaq2Answer: null,
      contactFaq3Question: null,
      contactFaq3Answer: null,
      contactBranches: null,

      updatedAt: new Date().toISOString(),
    };
  }
};
