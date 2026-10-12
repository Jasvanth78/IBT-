import { apiClient } from './apiClient'
import { SETTINGS_KEYS, type ApiSuccessResponse, type SettingEntity, type SettingsFormValues, type SettingsKey } from '../types/settings'

type UpsertSettingPayload = {
  key: SettingsKey
  value: unknown
}

export async function uploadInternshipGalleryImage(file: File): Promise<{ absoluteUrl: string }> {
  const formData = new FormData()
  formData.append('file', file)
  const response = await apiClient.post<{ success: boolean; data: { absoluteUrl: string } }>(
    '/api/uploads/v1/internship',
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  )
  return response.data.data
}

export async function uploadServicesImage(file: File): Promise<{ absoluteUrl: string }> {
  const formData = new FormData()
  formData.append('file', file)
  const response = await apiClient.post<{ success: boolean; data: { absoluteUrl: string } }>(
    '/api/uploads/v1/services',
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  )
  return response.data.data
}

export async function getSettings() {
  const response = await apiClient.get<ApiSuccessResponse<SettingEntity[]>>('/api/settings/v1')
  return response.data.data
}

export async function upsertSetting(payload: UpsertSettingPayload) {
  const response = await apiClient.post<ApiSuccessResponse<SettingEntity>>('/api/settings/v1', payload)
  return response.data.data
}

type SaveSettingsInput = {
  values: SettingsFormValues
  currentSettings: SettingEntity[]
}

function toMinuteEpoch(value: string) {
  const time = Date.parse(value)

  if (Number.isNaN(time)) {
    return null
  }

  return Math.floor(time / 60_000)
}

function valuesEqual(key: SettingsKey, incoming: unknown, current: unknown) {
  if (key === SETTINGS_KEYS.MAINTENANCE_END_TIME) {
    if (typeof incoming !== 'string' || typeof current !== 'string') {
      return incoming === current
    }

    const incomingMinute = toMinuteEpoch(incoming)
    const currentMinute = toMinuteEpoch(current)

    if (incomingMinute === null || currentMinute === null) {
      return incoming === current
    }

    return incomingMinute === currentMinute
  }

  // For arrays and objects, compare by JSON string to detect deep changes
  if (typeof incoming === 'object' || typeof current === 'object') {
    try {
      return JSON.stringify(incoming) === JSON.stringify(current)
    } catch {
      return false
    }
  }

  return incoming === current
}

export async function saveSettings({ values, currentSettings }: SaveSettingsInput) {
  const trimStr = (val: any) => typeof val === 'string' ? val.trim() : val

  const maintenanceEndTimeIso = values.maintenanceEndTime
    ? new Date(values.maintenanceEndTime).toISOString()
    : ''

  const nextValues: Array<UpsertSettingPayload> = [
    // ── Maintenance ────────────────────────────────────────────
    ...(values.maintenanceMode !== undefined ? [{ key: SETTINGS_KEYS.MAINTENANCE_MODE, value: values.maintenanceMode }] : []),
    ...(values.maintenanceMessage !== undefined ? [{ key: SETTINGS_KEYS.MAINTENANCE_MESSAGE, value: trimStr(values.maintenanceMessage) }] : []),
    ...(values.maintenanceEndTime !== undefined ? [{ key: SETTINGS_KEYS.MAINTENANCE_END_TIME, value: maintenanceEndTimeIso }] : []),
    // ── Global ──────────────────────────────────────────────────
    ...(values.whatsappNumber !== undefined ? [{ key: SETTINGS_KEYS.WHATSAPP_NUMBER, value: trimStr(values.whatsappNumber) }] : []),
    ...(values.adminNotificationEmail !== undefined ? [{ key: SETTINGS_KEYS.ADMIN_NOTIFICATION_EMAIL, value: trimStr(values.adminNotificationEmail) }] : []),
    // ── SMTP Configuration ──────────────────────────────────────
    ...(values.smtpHost !== undefined ? [{ key: SETTINGS_KEYS.SMTP_HOST, value: trimStr(values.smtpHost) }] : []),
    ...(values.smtpPort !== undefined ? [{ key: SETTINGS_KEYS.SMTP_PORT, value: trimStr(values.smtpPort) }] : []),
    ...(values.smtpUser !== undefined ? [{ key: SETTINGS_KEYS.SMTP_USER, value: trimStr(values.smtpUser) }] : []),
    ...(values.smtpPass !== undefined ? [{ key: SETTINGS_KEYS.SMTP_PASS, value: trimStr(values.smtpPass) }] : []),
    ...(values.smtpFrom !== undefined ? [{ key: SETTINGS_KEYS.SMTP_FROM, value: trimStr(values.smtpFrom) }] : []),
    // ── Internship ──────────────────────────────────────────────
    ...(values.internshipHeroTitle !== undefined ? [{ key: SETTINGS_KEYS.INTERNSHIP_HERO_TITLE, value: trimStr(values.internshipHeroTitle) }] : []),
    ...(values.internshipHeroSubtitle !== undefined ? [{ key: SETTINGS_KEYS.INTERNSHIP_HERO_SUBTITLE, value: trimStr(values.internshipHeroSubtitle) }] : []),
    ...(values.internshipHeroDescription !== undefined ? [{ key: SETTINGS_KEYS.INTERNSHIP_HERO_DESCRIPTION, value: trimStr(values.internshipHeroDescription) }] : []),
    ...(values.internshipHeroImageUrl !== undefined ? [{ key: SETTINGS_KEYS.INTERNSHIP_HERO_IMAGE_URL, value: trimStr(values.internshipHeroImageUrl) }] : []),
    ...(values.internshipIntroTitle !== undefined ? [{ key: SETTINGS_KEYS.INTERNSHIP_INTRO_TITLE, value: trimStr(values.internshipIntroTitle) }] : []),
    ...(values.internshipIntroDescription !== undefined ? [{ key: SETTINGS_KEYS.INTERNSHIP_INTRO_DESCRIPTION, value: trimStr(values.internshipIntroDescription) }] : []),
    ...(values.internshipApproachTitle !== undefined ? [{ key: SETTINGS_KEYS.INTERNSHIP_APPROACH_TITLE, value: trimStr(values.internshipApproachTitle) }] : []),
    ...(values.internshipApproachDescription !== undefined ? [{ key: SETTINGS_KEYS.INTERNSHIP_APPROACH_DESCRIPTION, value: trimStr(values.internshipApproachDescription) }] : []),
    ...(values.internshipCardOneValue !== undefined ? [{ key: SETTINGS_KEYS.INTERNSHIP_CARD_ONE_VALUE, value: trimStr(values.internshipCardOneValue) }] : []),
    ...(values.internshipCardOneTitle !== undefined ? [{ key: SETTINGS_KEYS.INTERNSHIP_CARD_ONE_TITLE, value: trimStr(values.internshipCardOneTitle) }] : []),
    ...(values.internshipCardOneDescription !== undefined ? [{ key: SETTINGS_KEYS.INTERNSHIP_CARD_ONE_DESCRIPTION, value: trimStr(values.internshipCardOneDescription) }] : []),
    ...(values.internshipCardTwoValue !== undefined ? [{ key: SETTINGS_KEYS.INTERNSHIP_CARD_TWO_VALUE, value: trimStr(values.internshipCardTwoValue) }] : []),
    ...(values.internshipCardTwoTitle !== undefined ? [{ key: SETTINGS_KEYS.INTERNSHIP_CARD_TWO_TITLE, value: trimStr(values.internshipCardTwoTitle) }] : []),
    ...(values.internshipCardTwoDescription !== undefined ? [{ key: SETTINGS_KEYS.INTERNSHIP_CARD_TWO_DESCRIPTION, value: trimStr(values.internshipCardTwoDescription) }] : []),
    ...(values.internshipCardThreeValue !== undefined ? [{ key: SETTINGS_KEYS.INTERNSHIP_CARD_THREE_VALUE, value: trimStr(values.internshipCardThreeValue) }] : []),
    ...(values.internshipCardThreeTitle !== undefined ? [{ key: SETTINGS_KEYS.INTERNSHIP_CARD_THREE_TITLE, value: trimStr(values.internshipCardThreeTitle) }] : []),
    ...(values.internshipCardThreeDescription !== undefined ? [{ key: SETTINGS_KEYS.INTERNSHIP_CARD_THREE_DESCRIPTION, value: trimStr(values.internshipCardThreeDescription) }] : []),
    ...(values.internshipGalleryTitle !== undefined ? [{ key: SETTINGS_KEYS.INTERNSHIP_GALLERY_TITLE, value: trimStr(values.internshipGalleryTitle) }] : []),
    ...(values.internshipGalleryImageUrls !== undefined ? [{ key: SETTINGS_KEYS.INTERNSHIP_GALLERY_IMAGE_URLS, value: trimStr(values.internshipGalleryImageUrls) }] : []),
    ...(values.internshipTestimonialsTitle !== undefined ? [{ key: SETTINGS_KEYS.INTERNSHIP_TESTIMONIALS_TITLE, value: trimStr(values.internshipTestimonialsTitle) }] : []),
    ...(values.internshipClosingTitle !== undefined ? [{ key: SETTINGS_KEYS.INTERNSHIP_CLOSING_TITLE, value: trimStr(values.internshipClosingTitle) }] : []),
    ...(values.internshipClosingContent !== undefined ? [{ key: SETTINGS_KEYS.INTERNSHIP_CLOSING_CONTENT, value: trimStr(values.internshipClosingContent) }] : []),
    ...(values.internshipApplyEmail !== undefined ? [{ key: SETTINGS_KEYS.INTERNSHIP_APPLY_EMAIL, value: trimStr(values.internshipApplyEmail) }] : []),
    ...(values.internshipPrograms !== undefined ? [{ key: SETTINGS_KEYS.INTERNSHIP_PROGRAMS, value: values.internshipPrograms }] : []),
    ...(values.internshipTestimonials !== undefined ? [{ key: SETTINGS_KEYS.INTERNSHIP_TESTIMONIALS, value: values.internshipTestimonials }] : []),
    // ── Labs Hero ───────────────────────────────────────────────
    ...(values.labsHeroTitle !== undefined ? [{ key: SETTINGS_KEYS.LABS_HERO_TITLE, value: trimStr(values.labsHeroTitle) }] : []),
    ...(values.labsHeroSubtitle !== undefined ? [{ key: SETTINGS_KEYS.LABS_HERO_SUBTITLE, value: trimStr(values.labsHeroSubtitle) }] : []),
    ...(values.labsHeroDescription !== undefined ? [{ key: SETTINGS_KEYS.LABS_HERO_DESCRIPTION, value: trimStr(values.labsHeroDescription) }] : []),
    ...(values.labsHeroImageUrl !== undefined ? [{ key: SETTINGS_KEYS.LABS_HERO_IMAGE_URL, value: trimStr(values.labsHeroImageUrl) }] : []),
    ...(values.labsHeroBtn1Text !== undefined ? [{ key: SETTINGS_KEYS.LABS_HERO_BTN1_TEXT, value: trimStr(values.labsHeroBtn1Text) }] : []),
    ...(values.labsHeroBtn2Text !== undefined ? [{ key: SETTINGS_KEYS.LABS_HERO_BTN2_TEXT, value: trimStr(values.labsHeroBtn2Text) }] : []),
    // ── Labs Intro ──────────────────────────────────────────────
    ...(values.labsPageTitle !== undefined ? [{ key: SETTINGS_KEYS.LABS_PAGE_TITLE, value: trimStr(values.labsPageTitle) }] : []),
    ...(values.labsPageSubtitle !== undefined ? [{ key: SETTINGS_KEYS.LABS_PAGE_SUBTITLE, value: trimStr(values.labsPageSubtitle) }] : []),
    ...(values.labsIntroDescription !== undefined ? [{ key: SETTINGS_KEYS.LABS_INTRO_DESCRIPTION, value: trimStr(values.labsIntroDescription) }] : []),
    ...(values.labsIntroImageUrl !== undefined ? [{ key: SETTINGS_KEYS.LABS_INTRO_IMAGE_URL, value: trimStr(values.labsIntroImageUrl) }] : []),
    ...(values.labsIntroBtnText !== undefined ? [{ key: SETTINGS_KEYS.LABS_INTRO_BTN_TEXT, value: trimStr(values.labsIntroBtnText) }] : []),
    ...(values.labsIntroFeature1Title !== undefined ? [{ key: SETTINGS_KEYS.LABS_INTRO_FEATURE1_TITLE, value: trimStr(values.labsIntroFeature1Title) }] : []),
    ...(values.labsIntroFeature1Desc !== undefined ? [{ key: SETTINGS_KEYS.LABS_INTRO_FEATURE1_DESC, value: trimStr(values.labsIntroFeature1Desc) }] : []),
    ...(values.labsIntroFeature2Title !== undefined ? [{ key: SETTINGS_KEYS.LABS_INTRO_FEATURE2_TITLE, value: trimStr(values.labsIntroFeature2Title) }] : []),
    ...(values.labsIntroFeature2Desc !== undefined ? [{ key: SETTINGS_KEYS.LABS_INTRO_FEATURE2_DESC, value: trimStr(values.labsIntroFeature2Desc) }] : []),
    ...(values.labsIntroFeature3Title !== undefined ? [{ key: SETTINGS_KEYS.LABS_INTRO_FEATURE3_TITLE, value: trimStr(values.labsIntroFeature3Title) }] : []),
    ...(values.labsIntroFeature3Desc !== undefined ? [{ key: SETTINGS_KEYS.LABS_INTRO_FEATURE3_DESC, value: trimStr(values.labsIntroFeature3Desc) }] : []),
    ...(values.labsIntroFeature4Title !== undefined ? [{ key: SETTINGS_KEYS.LABS_INTRO_FEATURE4_TITLE, value: trimStr(values.labsIntroFeature4Title) }] : []),
    ...(values.labsIntroFeature4Desc !== undefined ? [{ key: SETTINGS_KEYS.LABS_INTRO_FEATURE4_DESC, value: trimStr(values.labsIntroFeature4Desc) }] : []),
    // ── Labs Spotlights (JSON array) ────────────────────────────
    ...(values.labsSpotlights !== undefined ? [{ key: SETTINGS_KEYS.LABS_SPOTLIGHTS, value: values.labsSpotlights }] : []),
    // ── Labs Careers ────────────────────────────────────────────
    ...(values.labsCareersTitle !== undefined ? [{ key: SETTINGS_KEYS.LABS_CAREERS_TITLE, value: trimStr(values.labsCareersTitle) }] : []),
    ...(values.labsCareersDescription !== undefined ? [{ key: SETTINGS_KEYS.LABS_CAREERS_DESCRIPTION, value: trimStr(values.labsCareersDescription) }] : []),
    ...(values.labsCareersBtnText !== undefined ? [{ key: SETTINGS_KEYS.LABS_CAREERS_BTN_TEXT, value: trimStr(values.labsCareersBtnText) }] : []),
    // ── Labs CTA ────────────────────────────────────────────────
    ...(values.labsCtaTitle !== undefined ? [{ key: SETTINGS_KEYS.LABS_CTA_TITLE, value: trimStr(values.labsCtaTitle) }] : []),
    ...(values.labsCtaDescription !== undefined ? [{ key: SETTINGS_KEYS.LABS_CTA_DESCRIPTION, value: trimStr(values.labsCtaDescription) }] : []),
    ...(values.labsCtaBtnText !== undefined ? [{ key: SETTINGS_KEYS.LABS_CTA_BTN_TEXT, value: trimStr(values.labsCtaBtnText) }] : []),
    
    // ── Labs Master Content (Initiatives, Rigor, Mentorship) ────
    ...(values.labsInitiatives !== undefined ? [{ key: SETTINGS_KEYS.LABS_INITIATIVES, value: values.labsInitiatives }] : []),
    ...(values.labsRigorTitle !== undefined ? [{ key: SETTINGS_KEYS.LABS_RIGOR_TITLE, value: trimStr(values.labsRigorTitle) }] : []),
    ...(values.labsRigorDescription !== undefined ? [{ key: SETTINGS_KEYS.LABS_RIGOR_DESCRIPTION, value: trimStr(values.labsRigorDescription) }] : []),
    ...(values.labsRigorPoints !== undefined ? [{ key: SETTINGS_KEYS.LABS_RIGOR_POINTS, value: values.labsRigorPoints }] : []),
    ...(values.labsRigorImage !== undefined ? [{ key: SETTINGS_KEYS.LABS_RIGOR_IMAGE, value: trimStr(values.labsRigorImage) }] : []),
    ...(values.labsMentorshipTitle !== undefined ? [{ key: SETTINGS_KEYS.LABS_MENTORSHIP_TITLE, value: trimStr(values.labsMentorshipTitle) }] : []),
    ...(values.labsMentorshipDescription !== undefined ? [{ key: SETTINGS_KEYS.LABS_MENTORSHIP_DESCRIPTION, value: trimStr(values.labsMentorshipDescription) }] : []),
    ...(values.labsMentorshipImage !== undefined ? [{ key: SETTINGS_KEYS.LABS_MENTORSHIP_IMAGE, value: trimStr(values.labsMentorshipImage) }] : []),
    ...(values.labsMentorshipQuote !== undefined ? [{ key: SETTINGS_KEYS.LABS_MENTORSHIP_QUOTE, value: trimStr(values.labsMentorshipQuote) }] : []),
    ...(values.labsMentorshipQuoteAuthor !== undefined ? [{ key: SETTINGS_KEYS.LABS_MENTORSHIP_QUOTE_AUTHOR, value: trimStr(values.labsMentorshipQuoteAuthor) }] : []),
    ...(values.labsMentorshipQuoteRole !== undefined ? [{ key: SETTINGS_KEYS.LABS_MENTORSHIP_QUOTE_ROLE, value: trimStr(values.labsMentorshipQuoteRole) }] : []),
    ...(values.labsMentorshipQuoteAvatar !== undefined ? [{ key: SETTINGS_KEYS.LABS_MENTORSHIP_QUOTE_AVATAR, value: trimStr(values.labsMentorshipQuoteAvatar) }] : []),

    // ── Services Hero ───────────────────────────────────────────
    ...(values.servicesHeroTitle !== undefined ? [{ key: SETTINGS_KEYS.SERVICES_HERO_TITLE, value: trimStr(values.servicesHeroTitle) }] : []),
    ...(values.servicesHeroGradient !== undefined ? [{ key: SETTINGS_KEYS.SERVICES_HERO_GRADIENT, value: trimStr(values.servicesHeroGradient) }] : []),
    ...(values.servicesHeroBadge !== undefined ? [{ key: SETTINGS_KEYS.SERVICES_HERO_BADGE, value: trimStr(values.servicesHeroBadge) }] : []),
    ...(values.servicesHeroDescription !== undefined ? [{ key: SETTINGS_KEYS.SERVICES_HERO_DESCRIPTION, value: trimStr(values.servicesHeroDescription) }] : []),
    ...(values.servicesHeroBtn1Text !== undefined ? [{ key: SETTINGS_KEYS.SERVICES_HERO_BTN1_TEXT, value: trimStr(values.servicesHeroBtn1Text) }] : []),
    ...(values.servicesHeroBtn1Url !== undefined ? [{ key: SETTINGS_KEYS.SERVICES_HERO_BTN1_URL, value: trimStr(values.servicesHeroBtn1Url) }] : []),
    ...(values.servicesHeroBtn2Text !== undefined ? [{ key: SETTINGS_KEYS.SERVICES_HERO_BTN2_TEXT, value: trimStr(values.servicesHeroBtn2Text) }] : []),
    ...(values.servicesHeroBtn2Url !== undefined ? [{ key: SETTINGS_KEYS.SERVICES_HERO_BTN2_URL, value: trimStr(values.servicesHeroBtn2Url) }] : []),
    // ── Services Capabilities ───────────────────────────────────
    ...(values.servicesCapTitle !== undefined ? [{ key: SETTINGS_KEYS.SERVICES_CAP_TITLE, value: trimStr(values.servicesCapTitle) }] : []),
    ...(values.servicesCapHighlight !== undefined ? [{ key: SETTINGS_KEYS.SERVICES_CAP_HIGHLIGHT, value: trimStr(values.servicesCapHighlight) }] : []),
    ...(values.servicesCapBadge !== undefined ? [{ key: SETTINGS_KEYS.SERVICES_CAP_BADGE, value: trimStr(values.servicesCapBadge) }] : []),
    ...(values.servicesCapDescription !== undefined ? [{ key: SETTINGS_KEYS.SERVICES_CAP_DESCRIPTION, value: trimStr(values.servicesCapDescription) }] : []),
    // ── Services Process ────────────────────────────────────────
    ...(values.servicesProcessTitle !== undefined ? [{ key: SETTINGS_KEYS.SERVICES_PROCESS_TITLE, value: trimStr(values.servicesProcessTitle) }] : []),
    ...(values.servicesProcessBadge !== undefined ? [{ key: SETTINGS_KEYS.SERVICES_PROCESS_BADGE, value: trimStr(values.servicesProcessBadge) }] : []),
    ...(values.servicesProcessDescription !== undefined ? [{ key: SETTINGS_KEYS.SERVICES_PROCESS_DESCRIPTION, value: trimStr(values.servicesProcessDescription) }] : []),
    ...(values.servicesProcessSteps !== undefined ? [{ key: SETTINGS_KEYS.SERVICES_PROCESS_STEPS, value: values.servicesProcessSteps }] : []),
    // ── Services Why ───────────────────────────────────────────
    ...(values.servicesWhyTitle !== undefined ? [{ key: SETTINGS_KEYS.SERVICES_WHY_TITLE, value: trimStr(values.servicesWhyTitle) }] : []),
    ...(values.servicesWhyBadge !== undefined ? [{ key: SETTINGS_KEYS.SERVICES_WHY_BADGE, value: trimStr(values.servicesWhyBadge) }] : []),
    ...(values.servicesWhyDescription !== undefined ? [{ key: SETTINGS_KEYS.SERVICES_WHY_DESCRIPTION, value: trimStr(values.servicesWhyDescription) }] : []),
    ...(values.servicesWhyItems !== undefined ? [{ key: SETTINGS_KEYS.SERVICES_WHY_ITEMS, value: trimStr(values.servicesWhyItems) }] : []),
    ...(values.servicesWhyPromiseBadge !== undefined ? [{ key: SETTINGS_KEYS.SERVICES_WHY_PROMISE_BADGE, value: trimStr(values.servicesWhyPromiseBadge) }] : []),
    ...(values.servicesWhyPromiseQuote !== undefined ? [{ key: SETTINGS_KEYS.SERVICES_WHY_PROMISE_QUOTE, value: trimStr(values.servicesWhyPromiseQuote) }] : []),
    ...(values.servicesWhyPromiseAuthor !== undefined ? [{ key: SETTINGS_KEYS.SERVICES_WHY_PROMISE_AUTHOR, value: trimStr(values.servicesWhyPromiseAuthor) }] : []),
    ...(values.servicesWhyPromiseSub !== undefined ? [{ key: SETTINGS_KEYS.SERVICES_WHY_PROMISE_SUB, value: trimStr(values.servicesWhyPromiseSub) }] : []),
    ...(values.servicesWhyPromiseTags !== undefined ? [{ key: SETTINGS_KEYS.SERVICES_WHY_PROMISE_TAGS, value: trimStr(values.servicesWhyPromiseTags) }] : []),
    // ── Services CTA ────────────────────────────────────────────
    ...(values.servicesCtaTitle !== undefined ? [{ key: SETTINGS_KEYS.SERVICES_CTA_TITLE, value: trimStr(values.servicesCtaTitle) }] : []),
    ...(values.servicesCtaBadge !== undefined ? [{ key: SETTINGS_KEYS.SERVICES_CTA_BADGE, value: trimStr(values.servicesCtaBadge) }] : []),
    ...(values.servicesCtaDescription !== undefined ? [{ key: SETTINGS_KEYS.SERVICES_CTA_DESCRIPTION, value: trimStr(values.servicesCtaDescription) }] : []),
    ...(values.servicesCtaBtn1Text !== undefined ? [{ key: SETTINGS_KEYS.SERVICES_CTA_BTN1_TEXT, value: trimStr(values.servicesCtaBtn1Text) }] : []),
    ...(values.servicesCtaBtn1Url !== undefined ? [{ key: SETTINGS_KEYS.SERVICES_CTA_BTN1_URL, value: trimStr(values.servicesCtaBtn1Url) }] : []),
    ...(values.servicesCtaBtn2Text !== undefined ? [{ key: SETTINGS_KEYS.SERVICES_CTA_BTN2_TEXT, value: trimStr(values.servicesCtaBtn2Text) }] : []),
    ...(values.servicesCtaBtn2Url !== undefined ? [{ key: SETTINGS_KEYS.SERVICES_CTA_BTN2_URL, value: trimStr(values.servicesCtaBtn2Url) }] : []),

    // ── Services What We Do ──────────────────────────────────────
    ...(values.servicesWhatTitle !== undefined ? [{ key: SETTINGS_KEYS.SERVICES_WHAT_TITLE, value: trimStr(values.servicesWhatTitle) }] : []),
    ...(values.servicesWhatDescription !== undefined ? [{ key: SETTINGS_KEYS.SERVICES_WHAT_DESCRIPTION, value: trimStr(values.servicesWhatDescription) }] : []),
    ...(values.servicesWhatFeatures !== undefined ? [{ key: SETTINGS_KEYS.SERVICES_WHAT_FEATURES, value: values.servicesWhatFeatures }] : []),
    ...(values.servicesWhatImages !== undefined ? [{ key: SETTINGS_KEYS.SERVICES_WHAT_IMAGES, value: values.servicesWhatImages }] : []),

    // ── Products Page ────────────────────────────────────────────
    ...(values.productsHeroTitle !== undefined ? [{ key: SETTINGS_KEYS.PRODUCTS_HERO_TITLE, value: trimStr(values.productsHeroTitle) }] : []),
    ...(values.productsHeroHighlight !== undefined ? [{ key: SETTINGS_KEYS.PRODUCTS_HERO_HIGHLIGHT, value: trimStr(values.productsHeroHighlight) }] : []),
    ...(values.productsHeroDescription !== undefined ? [{ key: SETTINGS_KEYS.PRODUCTS_HERO_DESCRIPTION, value: trimStr(values.productsHeroDescription) }] : []),
    ...(values.productsHeroImageUrl !== undefined ? [{ key: SETTINGS_KEYS.PRODUCTS_HERO_IMAGE_URL, value: trimStr(values.productsHeroImageUrl) }] : []),
    ...(values.productsHeroProjectsDelivered !== undefined ? [{ key: SETTINGS_KEYS.PRODUCTS_HERO_PROJECTS_DELIVERED, value: trimStr(values.productsHeroProjectsDelivered) }] : []),
    ...(values.productsHeroClientSatisfaction !== undefined ? [{ key: SETTINGS_KEYS.PRODUCTS_HERO_CLIENT_SATISFACTION, value: trimStr(values.productsHeroClientSatisfaction) }] : []),
    ...(values.productsMicroAppsTitle !== undefined ? [{ key: SETTINGS_KEYS.PRODUCTS_MICRO_APPS_TITLE, value: trimStr(values.productsMicroAppsTitle) }] : []),
    ...(values.productsMicroAppsSubtitle !== undefined ? [{ key: SETTINGS_KEYS.PRODUCTS_MICRO_APPS_SUBTITLE, value: trimStr(values.productsMicroAppsSubtitle) }] : []),
    ...(values.productsMicroAppsLeftIntro !== undefined ? [{ key: SETTINGS_KEYS.PRODUCTS_MICRO_APPS_LEFT_INTRO, value: trimStr(values.productsMicroAppsLeftIntro) }] : []),
    ...(values.productsMicroAppsLeftHeading !== undefined ? [{ key: SETTINGS_KEYS.PRODUCTS_MICRO_APPS_LEFT_HEADING, value: trimStr(values.productsMicroAppsLeftHeading) }] : []),
    ...(values.productsMicroAppsLeftText !== undefined ? [{ key: SETTINGS_KEYS.PRODUCTS_MICRO_APPS_LEFT_TEXT, value: trimStr(values.productsMicroAppsLeftText) }] : []),
    ...(values.productsMicroAppsLeftBullets !== undefined ? [{ key: SETTINGS_KEYS.PRODUCTS_MICRO_APPS_LEFT_BULLETS, value: values.productsMicroAppsLeftBullets }] : []),
    ...(values.productsMicroAppsRightTextTop !== undefined ? [{ key: SETTINGS_KEYS.PRODUCTS_MICRO_APPS_RIGHT_TEXT_TOP, value: trimStr(values.productsMicroAppsRightTextTop) }] : []),
    ...(values.productsMicroAppsRightHeading !== undefined ? [{ key: SETTINGS_KEYS.PRODUCTS_MICRO_APPS_RIGHT_HEADING, value: trimStr(values.productsMicroAppsRightHeading) }] : []),
    ...(values.productsMicroAppsRightBullets !== undefined ? [{ key: SETTINGS_KEYS.PRODUCTS_MICRO_APPS_RIGHT_BULLETS, value: values.productsMicroAppsRightBullets }] : []),
    ...(values.productsMicroAppsRightTextBottom !== undefined ? [{ key: SETTINGS_KEYS.PRODUCTS_MICRO_APPS_RIGHT_TEXT_BOTTOM, value: trimStr(values.productsMicroAppsRightTextBottom) }] : []),

    // ── Home Solutions ──────────────────────────────────────────
    ...(values.homeSolutionsTitle !== undefined ? [{ key: SETTINGS_KEYS.HOME_SOLUTIONS_TITLE, value: trimStr(values.homeSolutionsTitle) }] : []),
    ...(values.homeSolutionsBadge !== undefined ? [{ key: SETTINGS_KEYS.HOME_SOLUTIONS_BADGE, value: trimStr(values.homeSolutionsBadge) }] : []),
    ...(values.homeSolutionsDescription !== undefined ? [{ key: SETTINGS_KEYS.HOME_SOLUTIONS_DESCRIPTION, value: trimStr(values.homeSolutionsDescription) }] : []),
    ...(values.homeSolutionsItems !== undefined ? [{ key: SETTINGS_KEYS.HOME_SOLUTIONS_ITEMS, value: values.homeSolutionsItems }] : []),

    // ── Home – Services & Recent Work Sections ───────────────────
    ...(values.homeServicesTitle !== undefined ? [{ key: SETTINGS_KEYS.HOME_SERVICES_TITLE, value: trimStr(values.homeServicesTitle) }] : []),
    ...(values.homeServicesBadge !== undefined ? [{ key: SETTINGS_KEYS.HOME_SERVICES_BADGE, value: trimStr(values.homeServicesBadge) }] : []),
    ...(values.homeRecentWorkTitle !== undefined ? [{ key: SETTINGS_KEYS.HOME_RECENT_WORK_TITLE, value: trimStr(values.homeRecentWorkTitle) }] : []),
    ...(values.homeRecentWorkBadge !== undefined ? [{ key: SETTINGS_KEYS.HOME_RECENT_WORK_BADGE, value: trimStr(values.homeRecentWorkBadge) }] : []),
    ...(values.homeRecentWorkItems !== undefined ? [{ key: SETTINGS_KEYS.HOME_RECENT_WORK_ITEMS, value: values.homeRecentWorkItems }] : []),

    // ── Contact Hero & Presence ─────────────────────────────────
    ...(values.contactHeroTitle !== undefined ? [{ key: SETTINGS_KEYS.CONTACT_HERO_TITLE, value: trimStr(values.contactHeroTitle) }] : []),
    ...(values.contactHeroDescription !== undefined ? [{ key: SETTINGS_KEYS.CONTACT_HERO_DESCRIPTION, value: trimStr(values.contactHeroDescription) }] : []),
    ...(values.contactGlobalPresenceBadge !== undefined ? [{ key: SETTINGS_KEYS.CONTACT_GLOBAL_PRESENCE_BADGE, value: trimStr(values.contactGlobalPresenceBadge) }] : []),
    ...(values.contactGlobalPresenceTitle !== undefined ? [{ key: SETTINGS_KEYS.CONTACT_GLOBAL_PRESENCE_TITLE, value: trimStr(values.contactGlobalPresenceTitle) }] : []),

    // ── Contact Branch 1 ────────────────────────────────────────
    ...(values.contactBranch1Title !== undefined ? [{ key: SETTINGS_KEYS.CONTACT_BRANCH1_TITLE, value: trimStr(values.contactBranch1Title) }] : []),
    ...(values.contactBranch1Address !== undefined ? [{ key: SETTINGS_KEYS.CONTACT_BRANCH1_ADDRESS, value: trimStr(values.contactBranch1Address) }] : []),
    ...(values.contactBranch1MapLink !== undefined ? [{ key: SETTINGS_KEYS.CONTACT_BRANCH1_MAP_LINK, value: trimStr(values.contactBranch1MapLink) }] : []),
    ...(values.contactBranch1LatLong !== undefined ? [{ key: SETTINGS_KEYS.CONTACT_BRANCH1_LAT_LONG, value: trimStr(values.contactBranch1LatLong) }] : []),
    ...(values.contactBranch1MarkerX !== undefined ? [{ key: SETTINGS_KEYS.CONTACT_BRANCH1_MARKER_X, value: values.contactBranch1MarkerX }] : []),
    ...(values.contactBranch1MarkerY !== undefined ? [{ key: SETTINGS_KEYS.CONTACT_BRANCH1_MARKER_Y, value: values.contactBranch1MarkerY }] : []),

    // ── Contact Branch 2 ────────────────────────────────────────
    ...(values.contactBranch2Title !== undefined ? [{ key: SETTINGS_KEYS.CONTACT_BRANCH2_TITLE, value: trimStr(values.contactBranch2Title) }] : []),
    ...(values.contactBranch2Address !== undefined ? [{ key: SETTINGS_KEYS.CONTACT_BRANCH2_ADDRESS, value: trimStr(values.contactBranch2Address) }] : []),
    ...(values.contactBranch2MapLink !== undefined ? [{ key: SETTINGS_KEYS.CONTACT_BRANCH2_MAP_LINK, value: trimStr(values.contactBranch2MapLink) }] : []),
    ...(values.contactBranch2LatLong !== undefined ? [{ key: SETTINGS_KEYS.CONTACT_BRANCH2_LAT_LONG, value: trimStr(values.contactBranch2LatLong) }] : []),
    ...(values.contactBranch2MarkerX !== undefined ? [{ key: SETTINGS_KEYS.CONTACT_BRANCH2_MARKER_X, value: values.contactBranch2MarkerX }] : []),
    ...(values.contactBranch2MarkerY !== undefined ? [{ key: SETTINGS_KEYS.CONTACT_BRANCH2_MARKER_Y, value: values.contactBranch2MarkerY }] : []),

    // ── Contact Branch 3 ────────────────────────────────────────
    ...(values.contactBranch3Title !== undefined ? [{ key: SETTINGS_KEYS.CONTACT_BRANCH3_TITLE, value: trimStr(values.contactBranch3Title) }] : []),
    ...(values.contactBranch3Address !== undefined ? [{ key: SETTINGS_KEYS.CONTACT_BRANCH3_ADDRESS, value: trimStr(values.contactBranch3Address) }] : []),
    ...(values.contactBranch3MapLink !== undefined ? [{ key: SETTINGS_KEYS.CONTACT_BRANCH3_MAP_LINK, value: trimStr(values.contactBranch3MapLink) }] : []),
    ...(values.contactBranch3LatLong !== undefined ? [{ key: SETTINGS_KEYS.CONTACT_BRANCH3_LAT_LONG, value: trimStr(values.contactBranch3LatLong) }] : []),
    ...(values.contactBranch3MarkerX !== undefined ? [{ key: SETTINGS_KEYS.CONTACT_BRANCH3_MARKER_X, value: values.contactBranch3MarkerX }] : []),
    ...(values.contactBranch3MarkerY !== undefined ? [{ key: SETTINGS_KEYS.CONTACT_BRANCH3_MARKER_Y, value: values.contactBranch3MarkerY }] : []),

    // ── Contact Support Channels ────────────────────────────────
    ...(values.contactSupportTitle !== undefined ? [{ key: SETTINGS_KEYS.CONTACT_SUPPORT_TITLE, value: trimStr(values.contactSupportTitle) }] : []),
    ...(values.contactSupportDescription !== undefined ? [{ key: SETTINGS_KEYS.CONTACT_SUPPORT_DESCRIPTION, value: trimStr(values.contactSupportDescription) }] : []),
    ...(values.contactSupportItem1Title !== undefined ? [{ key: SETTINGS_KEYS.CONTACT_SUPPORT_ITEM1_TITLE, value: trimStr(values.contactSupportItem1Title) }] : []),
    ...(values.contactSupportItem1Desc !== undefined ? [{ key: SETTINGS_KEYS.CONTACT_SUPPORT_ITEM1_DESC, value: trimStr(values.contactSupportItem1Desc) }] : []),
    ...(values.contactSupportItem1Link !== undefined ? [{ key: SETTINGS_KEYS.CONTACT_SUPPORT_ITEM1_LINK, value: trimStr(values.contactSupportItem1Link) }] : []),
    ...(values.contactSupportItem2Title !== undefined ? [{ key: SETTINGS_KEYS.CONTACT_SUPPORT_ITEM2_TITLE, value: trimStr(values.contactSupportItem2Title) }] : []),
    ...(values.contactSupportItem2Desc !== undefined ? [{ key: SETTINGS_KEYS.CONTACT_SUPPORT_ITEM2_DESC, value: trimStr(values.contactSupportItem2Desc) }] : []),
    ...(values.contactSupportItem2Link !== undefined ? [{ key: SETTINGS_KEYS.CONTACT_SUPPORT_ITEM2_LINK, value: trimStr(values.contactSupportItem2Link) }] : []),
    ...(values.contactSupportItem3Title !== undefined ? [{ key: SETTINGS_KEYS.CONTACT_SUPPORT_ITEM3_TITLE, value: trimStr(values.contactSupportItem3Title) }] : []),
    ...(values.contactSupportItem3Desc !== undefined ? [{ key: SETTINGS_KEYS.CONTACT_SUPPORT_ITEM3_DESC, value: trimStr(values.contactSupportItem3Desc) }] : []),
    ...(values.contactSupportItem3Status !== undefined ? [{ key: SETTINGS_KEYS.CONTACT_SUPPORT_ITEM3_STATUS, value: trimStr(values.contactSupportItem3Status) }] : []),

    // ── Contact FAQs ────────────────────────────────────────────
    ...(values.contactFaqTitle !== undefined ? [{ key: SETTINGS_KEYS.CONTACT_FAQ_TITLE, value: trimStr(values.contactFaqTitle) }] : []),
    ...(values.contactFaqDescription !== undefined ? [{ key: SETTINGS_KEYS.CONTACT_FAQ_DESCRIPTION, value: trimStr(values.contactFaqDescription) }] : []),
    ...(values.contactFaq1Question !== undefined ? [{ key: SETTINGS_KEYS.CONTACT_FAQ1_QUESTION, value: trimStr(values.contactFaq1Question) }] : []),
    ...(values.contactFaq1Answer !== undefined ? [{ key: SETTINGS_KEYS.CONTACT_FAQ1_ANSWER, value: trimStr(values.contactFaq1Answer) }] : []),
    ...(values.contactFaq2Question !== undefined ? [{ key: SETTINGS_KEYS.CONTACT_FAQ2_QUESTION, value: trimStr(values.contactFaq2Question) }] : []),
    ...(values.contactFaq2Answer !== undefined ? [{ key: SETTINGS_KEYS.CONTACT_FAQ2_ANSWER, value: trimStr(values.contactFaq2Answer) }] : []),
    ...(values.contactFaq3Question !== undefined ? [{ key: SETTINGS_KEYS.CONTACT_FAQ3_QUESTION, value: trimStr(values.contactFaq3Question) }] : []),
    ...(values.contactFaq3Answer !== undefined ? [{ key: SETTINGS_KEYS.CONTACT_FAQ3_ANSWER, value: trimStr(values.contactFaq3Answer) }] : []),

    // ── Home Video ──────────────────────────────────────────────
    ...(values.homeVideoUrl !== undefined ? [{ key: SETTINGS_KEYS.HOME_VIDEO_URL, value: trimStr(values.homeVideoUrl) }] : []),
    ...(values.homeVideoEnabled !== undefined ? [{ key: SETTINGS_KEYS.HOME_VIDEO_ENABLED, value: values.homeVideoEnabled }] : []),

    // ── Contact Dynamic Branches List ───────────────────────────
    ...(values.contactBranches !== undefined ? [{ key: SETTINGS_KEYS.CONTACT_BRANCHES, value: values.contactBranches }] : []),

    // ── About Page ──────────────────────────────────────────────
    ...(values.aboutWhoTitle !== undefined ? [{ key: SETTINGS_KEYS.ABOUT_WHO_TITLE, value: trimStr(values.aboutWhoTitle) }] : []),
    ...(values.aboutWhoDescription !== undefined ? [{ key: SETTINGS_KEYS.ABOUT_WHO_DESCRIPTION, value: trimStr(values.aboutWhoDescription) }] : []),
    ...(values.aboutWhoSecondaryDescription !== undefined ? [{ key: SETTINGS_KEYS.ABOUT_WHO_SECONDARY_DESCRIPTION, value: trimStr(values.aboutWhoSecondaryDescription) }] : []),
    ...(values.aboutWhoFeatures !== undefined ? [{ key: SETTINGS_KEYS.ABOUT_WHO_FEATURES, value: values.aboutWhoFeatures }] : []),
    ...(values.aboutWhoImages !== undefined ? [{ key: SETTINGS_KEYS.ABOUT_WHO_IMAGES, value: values.aboutWhoImages }] : []),
    ...(values.aboutProcessBadge !== undefined ? [{ key: SETTINGS_KEYS.ABOUT_PROCESS_BADGE, value: trimStr(values.aboutProcessBadge) }] : []),
    ...(values.aboutProcessTitle !== undefined ? [{ key: SETTINGS_KEYS.ABOUT_PROCESS_TITLE, value: trimStr(values.aboutProcessTitle) }] : []),
    ...(values.aboutProcessFeatures !== undefined ? [{ key: SETTINGS_KEYS.ABOUT_PROCESS_FEATURES, value: values.aboutProcessFeatures }] : []),
    ...(values.aboutProcessImage !== undefined ? [{ key: SETTINGS_KEYS.ABOUT_PROCESS_IMAGE, value: trimStr(values.aboutProcessImage) }] : []),
    ...(values.aboutMissionTitle !== undefined ? [{ key: SETTINGS_KEYS.ABOUT_MISSION_TITLE, value: trimStr(values.aboutMissionTitle) }] : []),
    ...(values.aboutMissionDesc !== undefined ? [{ key: SETTINGS_KEYS.ABOUT_MISSION_DESC, value: trimStr(values.aboutMissionDesc) }] : []),
    ...(values.aboutVisionTitle !== undefined ? [{ key: SETTINGS_KEYS.ABOUT_VISION_TITLE, value: trimStr(values.aboutVisionTitle) }] : []),
    ...(values.aboutVisionDesc !== undefined ? [{ key: SETTINGS_KEYS.ABOUT_VISION_DESC, value: trimStr(values.aboutVisionDesc) }] : []),
    ...(values.aboutMissionCards !== undefined ? [{ key: SETTINGS_KEYS.ABOUT_MISSION_CARDS, value: values.aboutMissionCards }] : []),
    ...(values.aboutContactBadge !== undefined ? [{ key: SETTINGS_KEYS.ABOUT_CONTACT_BADGE, value: trimStr(values.aboutContactBadge) }] : []),
    ...(values.aboutContactTitle !== undefined ? [{ key: SETTINGS_KEYS.ABOUT_CONTACT_TITLE, value: trimStr(values.aboutContactTitle) }] : []),
    ...(values.aboutContactImage !== undefined ? [{ key: SETTINGS_KEYS.ABOUT_CONTACT_IMAGE, value: trimStr(values.aboutContactImage) }] : []),
  ]

  const currentMap = new Map(currentSettings.map((item) => [item.key, item.value]))

  const changedValues = nextValues.filter((item) => !valuesEqual(item.key, item.value, currentMap.get(item.key)))

  if (changedValues.length === 0) {
    return [] as SettingEntity[]
  }

  return Promise.all(changedValues.map((item) => upsertSetting(item)))
}
