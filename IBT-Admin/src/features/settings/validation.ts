import { z } from 'zod'

export const settingsSchema = z.object({
  maintenanceMode: z.boolean(),
  maintenanceMessage: z
    .string('Maintenance message is required')
    .trim()
    .min(1, 'Maintenance message cannot be empty')
    .max(255, 'Maintenance message must be at most 255 characters long'),
  maintenanceEndTime: z
    .string()
    .refine((value) => !Number.isNaN(Date.parse(value)), 'Maintenance end time must be a valid date'),
  whatsappNumber: z
    .string()
    .trim()
    .max(20, 'WhatsApp number must be at most 20 characters long')
    .optional()
    .or(z.literal('')),
  internshipHeroTitle: z.string().trim().min(1, 'Hero title is required').max(120, 'Hero title must be at most 120 characters long'),
  internshipHeroSubtitle: z.string().trim().min(1, 'Hero subtitle is required').max(140, 'Hero subtitle must be at most 140 characters long'),
  internshipHeroDescription: z.string().trim().min(1, 'Hero description is required').max(1200, 'Hero description must be at most 1200 characters long'),
  internshipHeroImageUrl: z.string().trim().url('Hero image must be a valid URL').or(z.literal('')),
  internshipIntroTitle: z.string().trim().min(1, 'Intro title is required').max(140, 'Intro title must be at most 140 characters long'),
  internshipIntroDescription: z.string().trim().min(1, 'Intro description is required').max(2000, 'Intro description must be at most 2000 characters long'),
  internshipApproachTitle: z.string().trim().min(1, 'Approach title is required').max(140, 'Approach title must be at most 140 characters long'),
  internshipApproachDescription: z.string().trim().min(1, 'Approach description is required').max(2000, 'Approach description must be at most 2000 characters long'),
  internshipCardOneValue: z.string().trim().min(1, 'Card 1 value is required').max(20, 'Card 1 value must be at most 20 characters long'),
  internshipCardOneTitle: z.string().trim().min(1, 'Card 1 title is required').max(140, 'Card 1 title must be at most 140 characters long'),
  internshipCardOneDescription: z.string().trim().min(1, 'Card 1 description is required').max(900, 'Card 1 description must be at most 900 characters long'),
  internshipCardTwoValue: z.string().trim().min(1, 'Card 2 value is required').max(20, 'Card 2 value must be at most 20 characters long'),
  internshipCardTwoTitle: z.string().trim().min(1, 'Card 2 title is required').max(140, 'Card 2 title must be at most 140 characters long'),
  internshipCardTwoDescription: z.string().trim().min(1, 'Card 2 description is required').max(900, 'Card 2 description must be at most 900 characters long'),
  internshipCardThreeValue: z.string().trim().min(1, 'Card 3 value is required').max(20, 'Card 3 value must be at most 20 characters long'),
  internshipCardThreeTitle: z.string().trim().min(1, 'Card 3 title is required').max(140, 'Card 3 title must be at most 140 characters long'),
  internshipCardThreeDescription: z.string().trim().min(1, 'Card 3 description is required').max(900, 'Card 3 description must be at most 900 characters long'),
  internshipGalleryTitle: z.string().trim().min(1, 'Gallery title is required').max(140, 'Gallery title must be at most 140 characters long'),
  internshipGalleryImageUrls: z.string().trim().min(1, 'At least one gallery image URL is required').max(6000, 'Gallery image URLs must be at most 6000 characters long'),
  internshipTestimonialsTitle: z.string().trim().min(1, 'Testimonials title is required').max(140, 'Testimonials title must be at most 140 characters long'),
  internshipClosingTitle: z.string().trim().min(1, 'Closing title is required').max(180, 'Closing title must be at most 180 characters long'),
  internshipClosingContent: z.string().trim().min(1, 'Closing content is required').max(5000, 'Closing content must be at most 5000 characters long'),
  internshipApplyEmail: z.string().trim().email('Apply email must be a valid email'),
  internshipPrograms: z.array(z.object({
    id: z.string(),
    title: z.string().trim().max(200),
    icon: z.string().trim().max(100).optional().or(z.literal('')),
    points: z.array(z.string().trim().max(400)),
    learnMoreLink: z.string().trim().max(1000).optional().or(z.literal('')),
    colorTheme: z.string().trim().max(50).optional().or(z.literal('')),
  })).optional(),
  internshipTestimonials: z.array(z.object({
    id: z.string(),
    name: z.string().trim().max(200),
    content: z.string().trim().max(2000),
    role: z.string().trim().max(200).optional().or(z.literal('')),
    avatarUrl: z.string().trim().max(2000).optional().or(z.literal('')),
  })).optional(),
  labsHeroTitle: z.string().trim().min(1, 'Hero title is required').max(120, 'Hero title must be at most 120 characters long'),
  labsHeroSubtitle: z.string().trim().min(1, 'Hero subtitle is required').max(140, 'Hero subtitle must be at most 140 characters long'),
  labsHeroDescription: z.string().trim().min(1, 'Hero description is required').max(1200, 'Hero description must be at most 1200 characters long'),
  labsHeroImageUrl: z.string().trim().url('Hero image must be a valid URL').or(z.literal('')),
  labsPageTitle: z.string().trim().min(1, 'Page title is required').max(140, 'Page title must be at most 140 characters long'),
  labsPageSubtitle: z.string().trim().min(1, 'Page subtitle is required').max(140, 'Page subtitle must be at most 140 characters long'),
  labsHeroBtn1Text: z.string().trim().min(1, 'Button text is required').max(40),
  labsHeroBtn2Text: z.string().trim().min(1, 'Button text is required').max(40),
  labsIntroDescription: z.string().trim().min(1, 'Intro description is required').max(2000),
  labsIntroImageUrl: z.string().trim().url().or(z.literal('')),
  labsIntroBtnText: z.string().trim().min(1).max(40),
  labsIntroFeature1Title: z.string().trim().min(1).max(80),
  labsIntroFeature1Desc: z.string().trim().min(1).max(200),
  labsIntroFeature2Title: z.string().trim().min(1).max(80),
  labsIntroFeature2Desc: z.string().trim().min(1).max(200),
  labsIntroFeature3Title: z.string().trim().min(1).max(80),
  labsIntroFeature3Desc: z.string().trim().min(1).max(200),
  labsIntroFeature4Title: z.string().trim().min(1).max(80),
  labsIntroFeature4Desc: z.string().trim().min(1).max(200),
  labsCareersTitle: z.string().trim().min(1).max(140),
  labsCareersDescription: z.string().trim().min(1).max(2000),
  labsCareersBtnText: z.string().trim().min(1).max(40),
  labsCtaTitle: z.string().trim().min(1).max(140),
  labsCtaDescription: z.string().trim().min(1).max(2000),
  labsCtaBtnText: z.string().trim().min(1).max(40),
  labsSpotlights: z.array(z.object({
    id: z.string(),
    badge: z.string().trim().min(1).max(60),
    title: z.string().trim().min(1).max(140),
    description: z.string().trim().min(1).max(2000),
    imageUrl: z.string().trim().url().or(z.literal('')),
    list: z.string().trim().max(4000),
    projectSlug: z.string().trim().max(160).or(z.literal('')),
  })),

  // Labs – Initiatives, Rigor, Mentorship
  labsInitiatives: z.array(z.object({
    id: z.string(),
    badge: z.string().trim().max(60).optional().or(z.literal('')),
    title: z.string().trim().max(200),
    description: z.string().trim().max(2000),
    imageUrl: z.string().trim().max(2000).optional().or(z.literal('')),
    link: z.string().trim().max(2000).optional().or(z.literal('')),
    btnText: z.string().trim().max(100).optional().or(z.literal('')),
    layout: z.string().trim().max(100),
  })).optional(),
  labsRigorTitle: z.string().trim().max(200).optional().or(z.literal('')),
  labsRigorDescription: z.string().trim().max(4000).optional().or(z.literal('')),
  labsRigorPoints: z.array(z.string().trim().max(1000)).optional(),
  labsRigorImage: z.string().trim().max(2000).optional().or(z.literal('')),
  labsMentorshipTitle: z.string().trim().max(200).optional().or(z.literal('')),
  labsMentorshipDescription: z.string().trim().max(4000).optional().or(z.literal('')),
  labsMentorshipImage: z.string().trim().max(2000).optional().or(z.literal('')),
  labsMentorshipQuote: z.string().trim().max(2000).optional().or(z.literal('')),
  labsMentorshipQuoteAuthor: z.string().trim().max(200).optional().or(z.literal('')),
  labsMentorshipQuoteRole: z.string().trim().max(200).optional().or(z.literal('')),
  labsMentorshipQuoteAvatar: z.string().trim().max(2000).optional().or(z.literal('')),
  // Services – Hero
  servicesHeroTitle: z.string().trim().min(1, 'Hero title is required').max(140),
  servicesHeroGradient: z.string().trim().min(1, 'Hero gradient title is required').max(140),
  servicesHeroBadge: z.string().trim().min(1, 'Hero badge is required').max(100),
  servicesHeroDescription: z.string().trim().min(1, 'Hero description is required').max(2000),
  servicesHeroBtn1Text: z.string().trim().min(1, 'Primary button text is required').max(80),
  servicesHeroBtn1Url: z.string().trim().min(1, 'Primary button link is required').max(200),
  servicesHeroBtn2Text: z.string().trim().min(1, 'Secondary button text is required').max(80),
  servicesHeroBtn2Url: z.string().trim().min(1, 'Secondary button link is required').max(200),
  // Services – Capabilities Header
  servicesCapTitle: z.string().trim().min(1, 'Capabilities title is required').max(140),
  servicesCapHighlight: z.string().trim().min(1, 'Capabilities highlight is required').max(140),
  servicesCapBadge: z.string().trim().min(1, 'Capabilities badge is required').max(100),
  servicesCapDescription: z.string().trim().min(1, 'Capabilities description is required').max(2000),
  // Services – Process Section
  servicesProcessTitle: z.string().trim().min(1, 'Process title is required').max(140),
  servicesProcessBadge: z.string().trim().min(1, 'Process badge is required').max(100),
  servicesProcessDescription: z.string().trim().min(1, 'Process description is required').max(2000),
  servicesProcessSteps: z.array(z.object({
    step: z.string().trim().min(1, 'Step label is required').max(20),
    title: z.string().trim().min(1, 'Step title is required').max(140),
    desc: z.string().trim().min(1, 'Step description is required').max(1200),
  })),
  // Services – Why Section
  servicesWhyTitle: z.string().trim().min(1, 'Why Choose Us title is required').max(140),
  servicesWhyBadge: z.string().trim().min(1, 'Why Choose Us badge is required').max(100),
  servicesWhyDescription: z.string().trim().min(1, 'Why Choose Us description is required').max(2000),
  servicesWhyItems: z.array(z.object({
    title: z.string().trim().min(1, 'Item title is required').max(140),
    description: z.string().trim().min(1, 'Item description is required').max(1200),
  })),
  servicesWhyPromiseBadge: z.string().trim().min(1, 'Promise badge is required').max(100),
  servicesWhyPromiseQuote: z.string().trim().min(1, 'Promise quote is required').max(1200),
  servicesWhyPromiseAuthor: z.string().trim().min(1, 'Promise author is required').max(140),
  servicesWhyPromiseSub: z.string().trim().min(1, 'Promise author subtitle is required').max(140),
  servicesWhyPromiseTags: z.string().trim().max(2000),
  // Services – CTA Section
  servicesCtaTitle: z.string().trim().min(1, 'CTA title is required').max(200),
  servicesCtaBadge: z.string().trim().min(1, 'CTA badge is required').max(100),
  servicesCtaDescription: z.string().trim().min(1, 'CTA description is required').max(2000),
  servicesCtaBtn1Text: z.string().trim().min(1, 'CTA button 1 text is required').max(80),
  servicesCtaBtn1Url: z.string().trim().min(1, 'CTA button 1 link is required').max(200),
  servicesCtaBtn2Text: z.string().trim().min(1, 'CTA button 2 text is required').max(80),
  servicesCtaBtn2Url: z.string().trim().min(1, 'CTA button 2 link is required').max(200),

  // Services – What We Do Section
  servicesWhatTitle: z.string().trim().min(1, 'What We Do title is required').max(200),
  servicesWhatDescription: z.string().trim().min(1, 'What We Do description is required').max(2000),
  servicesWhatFeatures: z.array(z.object({
    title: z.string().trim().min(1, 'Feature title is required').max(140),
    desc: z.string().trim().min(1, 'Feature description is required').max(1200),
    icon: z.string().trim().min(1, 'Feature icon is required').max(100),
  })).min(1, 'At least one feature card is required').max(4, 'At most 4 feature cards are allowed'),
  servicesWhatImages: z.array(z.string().trim().url('Images must be valid URLs').or(z.literal(''))).min(4, 'Collage requires 4 images').max(4, 'Collage requires exactly 4 images'),

  // Home – Solutions Section
  homeSolutionsTitle: z.string().trim().max(200).optional(),
  homeSolutionsBadge: z.string().trim().max(100).optional(),
  homeSolutionsDescription: z.string().trim().max(2000).optional(),
  homeSolutionsItems: z.array(z.string()).optional(),

  // Home – Services & Recent Work Sections
  homeServicesTitle: z.string().trim().max(200).optional().or(z.literal('')),
  homeServicesBadge: z.string().trim().max(100).optional().or(z.literal('')),
  homeRecentWorkTitle: z.string().trim().max(200).optional().or(z.literal('')),
  homeRecentWorkBadge: z.string().trim().max(100).optional().or(z.literal('')),
  homeRecentWorkItems: z.array(z.object({
    id: z.string(),
    title: z.string().trim().max(200),
    description: z.string().trim().max(1200),
    category: z.string().trim().max(100),
    imageUrl: z.string().trim().max(2000),
    badgeClass: z.string().trim().max(200).optional().or(z.literal('')),
  })).optional(),


  // Products Page
  productsHeroTitle: z.string().trim().max(200).optional().or(z.literal('')),
  productsHeroHighlight: z.string().trim().max(200).optional().or(z.literal('')),
  productsHeroDescription: z.string().trim().max(2000).optional().or(z.literal('')),
  productsHeroImageUrl: z.string().trim().max(2000).optional().or(z.literal('')),
  productsHeroProjectsDelivered: z.string().trim().max(100).optional().or(z.literal('')),
  productsHeroClientSatisfaction: z.string().trim().max(100).optional().or(z.literal('')),
  productsMicroAppsTitle: z.string().trim().max(200).optional().or(z.literal('')),
  productsMicroAppsSubtitle: z.string().trim().max(200).optional().or(z.literal('')),
  productsMicroAppsLeftIntro: z.string().trim().max(2000).optional().or(z.literal('')),
  productsMicroAppsLeftHeading: z.string().trim().max(200).optional().or(z.literal('')),
  productsMicroAppsLeftText: z.string().trim().max(2000).optional().or(z.literal('')),
  productsMicroAppsLeftBullets: z.array(z.string().trim().max(500)).optional(),
  productsMicroAppsRightTextTop: z.string().trim().max(5000).optional().or(z.literal('')),
  productsMicroAppsRightHeading: z.string().trim().max(200).optional().or(z.literal('')),
  productsMicroAppsRightBullets: z.array(z.string().trim().max(500)).optional(),
  productsMicroAppsRightTextBottom: z.string().trim().max(2000).optional().or(z.literal('')),

  // Home – Video Background
  homeVideoUrl: z.string().trim().url('Home video must be a valid URL').or(z.literal('')),
  homeVideoEnabled: z.boolean(),

  // Contact – Hero & Presence
  contactHeroTitle: z.string().trim().min(1, 'Hero title is required').max(200),
  contactHeroDescription: z.string().trim().min(1, 'Hero description is required').max(2000),
  contactGlobalPresenceBadge: z.string().trim().min(1, 'Badge is required').max(100),
  contactGlobalPresenceTitle: z.string().trim().min(1, 'Presence title is required').max(200),

  // Contact – Branch 1
  contactBranch1Title: z.string().trim().max(140).optional(),
  contactBranch1Address: z.string().trim().max(800).optional(),
  contactBranch1MapLink: z.string().trim().max(3000).optional(),
  contactBranch1LatLong: z.string().trim().max(200).optional(),
  contactBranch1MarkerX: z.string().trim().or(z.number()).optional(),
  contactBranch1MarkerY: z.string().trim().or(z.number()).optional(),

  // Contact – Branch 2
  contactBranch2Title: z.string().trim().max(140).optional(),
  contactBranch2Address: z.string().trim().max(800).optional(),
  contactBranch2MapLink: z.string().trim().max(3000).optional(),
  contactBranch2LatLong: z.string().trim().max(200).optional(),
  contactBranch2MarkerX: z.string().trim().or(z.number()).optional(),
  contactBranch2MarkerY: z.string().trim().or(z.number()).optional(),

  // Contact – Branch 3
  contactBranch3Title: z.string().trim().max(140).optional(),
  contactBranch3Address: z.string().trim().max(800).optional(),
  contactBranch3MapLink: z.string().trim().max(3000).optional(),
  contactBranch3LatLong: z.string().trim().max(200).optional(),
  contactBranch3MarkerX: z.string().trim().or(z.number()).optional(),
  contactBranch3MarkerY: z.string().trim().or(z.number()).optional(),

  // Contact – Support Channels
  contactSupportTitle: z.string().trim().min(1, 'Support section title is required').max(200),
  contactSupportDescription: z.string().trim().min(1, 'Support section description is required').max(2000),
  contactSupportItem1Title: z.string().trim().min(1, 'Support channel 1 title is required').max(140),
  contactSupportItem1Desc: z.string().trim().min(1, 'Support channel 1 description is required').max(400),
  contactSupportItem1Link: z.string().trim().min(1, 'Support channel 1 link is required').max(1000),
  contactSupportItem2Title: z.string().trim().min(1, 'Support channel 2 title is required').max(140),
  contactSupportItem2Desc: z.string().trim().min(1, 'Support channel 2 description is required').max(400),
  contactSupportItem2Link: z.string().trim().min(1, 'Support channel 2 link is required').max(1000),
  contactSupportItem3Title: z.string().trim().min(1, 'Support channel 3 title is required').max(140),
  contactSupportItem3Desc: z.string().trim().min(1, 'Support channel 3 description is required').max(400),
  contactSupportItem3Status: z.string().trim().min(1, 'Support channel 3 status is required').max(100),

  // Contact – FAQs
  contactFaqTitle: z.string().trim().min(1, 'FAQ title is required').max(200),
  contactFaqDescription: z.string().trim().min(1, 'FAQ description is required').max(2000),
  contactFaq1Question: z.string().trim().min(1, 'FAQ 1 question is required').max(400),
  contactFaq1Answer: z.string().trim().min(1, 'FAQ 1 answer is required').max(2000),
  contactFaq2Question: z.string().trim().min(1, 'FAQ 2 question is required').max(400),
  contactFaq2Answer: z.string().trim().min(1, 'FAQ 2 answer is required').max(2000),
  contactFaq3Question: z.string().trim().min(1, 'FAQ 3 question is required').max(400),
  contactFaq3Answer: z.string().trim().min(1, 'FAQ 3 answer is required').max(2000),

  // Contact – Dynamic Branches List
  contactBranches: z.array(z.object({
    id: z.string(),
    title: z.string().trim().max(140).nullable().optional().or(z.literal('')),
    address: z.string().trim().max(800).nullable().optional().or(z.literal('')),
    mapLink: z.string().trim().max(3000).nullable().optional().or(z.literal('')),
    latLong: z.string().trim().max(200).nullable().optional().or(z.literal('')),
    markerX: z.coerce.number().optional().default(50),
    markerY: z.coerce.number().optional().default(50),
  })).optional(),

  // Admin Notification Email
  adminNotificationEmail: z.string().trim().refine((val) => val === '' || val.split(',').every((email) => z.string().email().safeParse(email.trim()).success), 'Must be a comma-separated list of valid emails'),

  // SMTP Configuration
  smtpHost: z.string().trim().max(255).optional().or(z.literal('')),
  smtpPort: z.string().trim().max(10).optional().or(z.literal('')),
  smtpUser: z.string().trim().max(255).optional().or(z.literal('')),
  smtpPass: z.string().trim().max(255).optional().or(z.literal('')),
  smtpFrom: z.string().trim().email('Must be a valid email').optional().or(z.literal('')),
})

export type SettingsSchema = z.infer<typeof settingsSchema>

export const contactSettingsSchema = settingsSchema.pick({
  contactBranches: true,
})

export type ContactSettingsSchema = z.infer<typeof contactSettingsSchema>
