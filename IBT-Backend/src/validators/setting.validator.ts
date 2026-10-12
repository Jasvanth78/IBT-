import { z } from "zod";
import { SETTINGS } from "../types/settings";

export const settingSchemas: Record<string, z.ZodTypeAny> = {
  [SETTINGS.MAINTENANCE_MODE]: 
    z.boolean("Maintenance mode must be a boolean"),
  [SETTINGS.MAINTENANCE_MESSAGE]: 
    z.string("Maintenance message must be a string")
    .min(1, "Maintenance message cannot be empty")
    .max(255, "Maintenance message must be at most 255 characters long"),
  [SETTINGS.MAINTENANCE_END_TIME]:
    z.string("Maintenance end time must be a string")
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Maintenance end time must be a valid date string",
    }),
  [SETTINGS.WHATSAPP_NUMBER]:
    z.string().max(20, "WhatsApp number must be at most 20 characters long").optional().or(z.null()),
  [SETTINGS.INTERNSHIP_HERO_TITLE]: z.string().trim().min(1).max(120),
  [SETTINGS.INTERNSHIP_HERO_SUBTITLE]: z.string().trim().min(1).max(140),
  [SETTINGS.INTERNSHIP_HERO_DESCRIPTION]: z.string().trim().min(1).max(1200),
  [SETTINGS.INTERNSHIP_HERO_IMAGE_URL]: z.string().trim().url("Internship hero image URL must be a valid URL").or(z.literal('')),
  [SETTINGS.INTERNSHIP_INTRO_TITLE]: z.string().trim().min(1).max(140),
  [SETTINGS.INTERNSHIP_INTRO_DESCRIPTION]: z.string().trim().min(1).max(2000),
  [SETTINGS.INTERNSHIP_APPROACH_TITLE]: z.string().trim().min(1).max(140),
  [SETTINGS.INTERNSHIP_APPROACH_DESCRIPTION]: z.string().trim().min(1).max(2000),
  [SETTINGS.INTERNSHIP_CARD_ONE_VALUE]: z.string().trim().min(1).max(20),
  [SETTINGS.INTERNSHIP_CARD_ONE_TITLE]: z.string().trim().min(1).max(140),
  [SETTINGS.INTERNSHIP_CARD_ONE_DESCRIPTION]: z.string().trim().min(1).max(900),
  [SETTINGS.INTERNSHIP_CARD_TWO_VALUE]: z.string().trim().min(1).max(20),
  [SETTINGS.INTERNSHIP_CARD_TWO_TITLE]: z.string().trim().min(1).max(140),
  [SETTINGS.INTERNSHIP_CARD_TWO_DESCRIPTION]: z.string().trim().min(1).max(900),
  [SETTINGS.INTERNSHIP_CARD_THREE_VALUE]: z.string().trim().min(1).max(20),
  [SETTINGS.INTERNSHIP_CARD_THREE_TITLE]: z.string().trim().min(1).max(140),
  [SETTINGS.INTERNSHIP_CARD_THREE_DESCRIPTION]: z.string().trim().min(1).max(900),
  [SETTINGS.INTERNSHIP_GALLERY_TITLE]: z.string().trim().min(1).max(140),
  [SETTINGS.INTERNSHIP_GALLERY_IMAGE_URLS]: z.string().trim().min(1).max(6000),
  [SETTINGS.INTERNSHIP_TESTIMONIALS_TITLE]: z.string().trim().min(1).max(140),
  [SETTINGS.INTERNSHIP_CLOSING_TITLE]: z.string().trim().min(1).max(180),
  [SETTINGS.INTERNSHIP_CLOSING_CONTENT]: z.string().trim().min(1).max(5000),
  [SETTINGS.INTERNSHIP_APPLY_EMAIL]: z.string().trim().email("Internship apply email must be a valid email"),
  [SETTINGS.INTERNSHIP_PROGRAMS]: z.array(z.object({
    id: z.string(),
    title: z.string().trim().max(200),
    icon: z.string().trim().max(100).optional().or(z.literal('')),
    points: z.array(z.string().trim().max(400)),
    learnMoreLink: z.string().trim().max(1000).optional().or(z.literal('')),
    colorTheme: z.string().trim().max(50).optional().or(z.literal('')),
  })).optional(),
  [SETTINGS.INTERNSHIP_TESTIMONIALS]: z.array(z.object({
    id: z.string(),
    name: z.string().trim().max(200),
    content: z.string().trim().max(2000),
    role: z.string().trim().max(200).optional().or(z.literal('')),
    avatarUrl: z.string().trim().max(2000).optional().or(z.literal('')),
  })).optional(),
  
  // About Page
  [SETTINGS.ABOUT_WHO_TITLE]: z.string().trim().max(200).optional().or(z.literal('')),
  [SETTINGS.ABOUT_WHO_DESCRIPTION]: z.string().trim().max(5000).optional().or(z.literal('')),
  [SETTINGS.ABOUT_WHO_SECONDARY_DESCRIPTION]: z.string().trim().max(5000).optional().or(z.literal('')),
  [SETTINGS.ABOUT_WHO_FEATURES]: z.array(z.any()),
  [SETTINGS.ABOUT_WHO_IMAGES]: z.array(z.string().trim().max(2000).optional().or(z.literal(''))),
  [SETTINGS.ABOUT_PROCESS_BADGE]: z.string().trim().max(100).optional().or(z.literal('')),
  [SETTINGS.ABOUT_PROCESS_TITLE]: z.string().trim().max(200).optional().or(z.literal('')),
  [SETTINGS.ABOUT_PROCESS_FEATURES]: z.array(z.object({
    title: z.string().trim().max(200),
    desc: z.string().trim().max(1000),
    icon: z.string().trim().max(100),
  })),
  [SETTINGS.ABOUT_PROCESS_IMAGE]: z.string().trim().max(2000).optional().or(z.literal('')),
  [SETTINGS.ABOUT_MISSION_TITLE]: z.string().trim().max(200).optional().or(z.literal('')),
  [SETTINGS.ABOUT_MISSION_DESC]: z.string().trim().max(2000).optional().or(z.literal('')),
  [SETTINGS.ABOUT_VISION_TITLE]: z.string().trim().max(200).optional().or(z.literal('')),
  [SETTINGS.ABOUT_VISION_DESC]: z.string().trim().max(2000).optional().or(z.literal('')),
  [SETTINGS.ABOUT_MISSION_CARDS]: z.array(z.object({
    value: z.string().trim().max(100),
    label: z.string().trim().max(200),
  })),
  [SETTINGS.ABOUT_CONTACT_BADGE]: z.string().trim().max(100).optional().or(z.literal('')),
  [SETTINGS.ABOUT_CONTACT_TITLE]: z.string().trim().max(200).optional().or(z.literal('')),
  [SETTINGS.ABOUT_CONTACT_IMAGE]: z.string().trim().max(2000).optional().or(z.literal('')),

  // Labs – Hero
  [SETTINGS.LABS_HERO_TITLE]: z.string().trim().min(1).max(120),
  [SETTINGS.LABS_HERO_SUBTITLE]: z.string().trim().min(1).max(140),
  [SETTINGS.LABS_HERO_DESCRIPTION]: z.string().trim().min(1).max(1200),
  [SETTINGS.LABS_HERO_IMAGE_URL]: z.string().trim().max(2000).or(z.literal('')),
  [SETTINGS.LABS_HERO_BTN1_TEXT]: z.string().trim().min(1).max(40),
  [SETTINGS.LABS_HERO_BTN2_TEXT]: z.string().trim().min(1).max(40),
  // Labs – Intro
  [SETTINGS.LABS_PAGE_TITLE]: z.string().trim().min(1).max(140),
  [SETTINGS.LABS_PAGE_SUBTITLE]: z.string().trim().min(1).max(140),
  [SETTINGS.LABS_INTRO_DESCRIPTION]: z.string().trim().min(1).max(2000),
  [SETTINGS.LABS_INTRO_IMAGE_URL]: z.string().trim().max(2000).or(z.literal('')),
  [SETTINGS.LABS_INTRO_BTN_TEXT]: z.string().trim().min(1).max(40),
  [SETTINGS.LABS_INTRO_FEATURE1_TITLE]: z.string().trim().min(1).max(80),
  [SETTINGS.LABS_INTRO_FEATURE1_DESC]: z.string().trim().min(1).max(200),
  [SETTINGS.LABS_INTRO_FEATURE2_TITLE]: z.string().trim().min(1).max(80),
  [SETTINGS.LABS_INTRO_FEATURE2_DESC]: z.string().trim().min(1).max(200),
  [SETTINGS.LABS_INTRO_FEATURE3_TITLE]: z.string().trim().min(1).max(80),
  [SETTINGS.LABS_INTRO_FEATURE3_DESC]: z.string().trim().min(1).max(200),
  [SETTINGS.LABS_INTRO_FEATURE4_TITLE]: z.string().trim().min(1).max(80),
  [SETTINGS.LABS_INTRO_FEATURE4_DESC]: z.string().trim().min(1).max(200),
  // Labs – Spotlights (JSON array)
  [SETTINGS.LABS_SPOTLIGHTS]: z.array(z.object({
    id: z.string(),
    badge: z.string().trim().max(60),
    title: z.string().trim().max(140),
    description: z.string().trim().max(2000),
    imageUrl: z.string().trim().max(2000).or(z.literal('')),
    list: z.string().trim().max(4000),
    projectSlug: z.string().trim().max(160).or(z.literal('')),
  })),
  // Labs – Careers
  [SETTINGS.LABS_CAREERS_TITLE]: z.string().trim().min(1).max(140),
  [SETTINGS.LABS_CAREERS_DESCRIPTION]: z.string().trim().min(1).max(2000),
  [SETTINGS.LABS_CAREERS_BTN_TEXT]: z.string().trim().min(1).max(40),
  // Labs – CTA
  [SETTINGS.LABS_CTA_TITLE]: z.string().trim().min(1).max(140),
  [SETTINGS.LABS_CTA_DESCRIPTION]: z.string().trim().min(1).max(2000),
  [SETTINGS.LABS_CTA_BTN_TEXT]: z.string().trim().min(1).max(40),

  // Labs – Initiatives, Rigor, Mentorship
  [SETTINGS.LABS_INITIATIVES]: z.array(z.object({
    id: z.string(),
    badge: z.string().trim().max(60).optional().or(z.literal('')),
    title: z.string().trim().max(200),
    description: z.string().trim().max(2000),
    imageUrl: z.string().trim().max(2000).optional().or(z.literal('')),
    link: z.string().trim().max(2000).optional().or(z.literal('')),
    btnText: z.string().trim().max(100).optional().or(z.literal('')),
    layout: z.string().trim().max(100),
  })).optional(),
  [SETTINGS.LABS_RIGOR_TITLE]: z.string().trim().max(200).optional().or(z.literal('')),
  [SETTINGS.LABS_RIGOR_DESCRIPTION]: z.string().trim().max(4000).optional().or(z.literal('')),
  [SETTINGS.LABS_RIGOR_POINTS]: z.array(z.string().trim().max(1000)).optional(),
  [SETTINGS.LABS_RIGOR_IMAGE]: z.string().trim().max(2000).optional().or(z.literal('')),
  [SETTINGS.LABS_MENTORSHIP_TITLE]: z.string().trim().max(200).optional().or(z.literal('')),
  [SETTINGS.LABS_MENTORSHIP_DESCRIPTION]: z.string().trim().max(4000).optional().or(z.literal('')),
  [SETTINGS.LABS_MENTORSHIP_IMAGE]: z.string().trim().max(2000).optional().or(z.literal('')),
  [SETTINGS.LABS_MENTORSHIP_QUOTE]: z.string().trim().max(2000).optional().or(z.literal('')),
  [SETTINGS.LABS_MENTORSHIP_QUOTE_AUTHOR]: z.string().trim().max(200).optional().or(z.literal('')),
  [SETTINGS.LABS_MENTORSHIP_QUOTE_ROLE]: z.string().trim().max(200).optional().or(z.literal('')),
  [SETTINGS.LABS_MENTORSHIP_QUOTE_AVATAR]: z.string().trim().max(2000).optional().or(z.literal('')),
  // Services – Hero
  [SETTINGS.SERVICES_HERO_TITLE]: z.string().trim().min(1).max(140),
  [SETTINGS.SERVICES_HERO_GRADIENT]: z.string().trim().min(1).max(140),
  [SETTINGS.SERVICES_HERO_BADGE]: z.string().trim().min(1).max(100),
  [SETTINGS.SERVICES_HERO_DESCRIPTION]: z.string().trim().min(1).max(2000),
  [SETTINGS.SERVICES_HERO_BTN1_TEXT]: z.string().trim().min(1).max(80),
  [SETTINGS.SERVICES_HERO_BTN1_URL]: z.string().trim().min(1).max(200),
  [SETTINGS.SERVICES_HERO_BTN2_TEXT]: z.string().trim().min(1).max(80),
  [SETTINGS.SERVICES_HERO_BTN2_URL]: z.string().trim().min(1).max(200),
  // Services – Capabilities Header
  [SETTINGS.SERVICES_CAP_TITLE]: z.string().trim().min(1).max(140),
  [SETTINGS.SERVICES_CAP_HIGHLIGHT]: z.string().trim().min(1).max(140),
  [SETTINGS.SERVICES_CAP_BADGE]: z.string().trim().min(1).max(100),
  [SETTINGS.SERVICES_CAP_DESCRIPTION]: z.string().trim().min(1).max(2000),
  // Services – Process Section
  [SETTINGS.SERVICES_PROCESS_TITLE]: z.string().trim().min(1).max(140),
  [SETTINGS.SERVICES_PROCESS_BADGE]: z.string().trim().min(1).max(100),
  [SETTINGS.SERVICES_PROCESS_DESCRIPTION]: z.string().trim().min(1).max(2000),
  [SETTINGS.SERVICES_PROCESS_STEPS]: z.array(z.object({
    step: z.string().trim().max(20),
    title: z.string().trim().max(140),
    desc: z.string().trim().max(1200),
  })),
  // Services – Why Section
  [SETTINGS.SERVICES_WHY_TITLE]: z.string().trim().min(1).max(140),
  [SETTINGS.SERVICES_WHY_BADGE]: z.string().trim().min(1).max(100),
  [SETTINGS.SERVICES_WHY_DESCRIPTION]: z.string().trim().min(1).max(2000),
  [SETTINGS.SERVICES_WHY_ITEMS]: z.array(z.object({
    title: z.string().trim().min(1).max(140),
    description: z.string().trim().max(1200),
  })),
  [SETTINGS.SERVICES_WHY_PROMISE_BADGE]: z.string().trim().min(1).max(100),
  [SETTINGS.SERVICES_WHY_PROMISE_QUOTE]: z.string().trim().min(1).max(1200),
  [SETTINGS.SERVICES_WHY_PROMISE_AUTHOR]: z.string().trim().min(1).max(140),
  [SETTINGS.SERVICES_WHY_PROMISE_SUB]: z.string().trim().min(1).max(140),
  [SETTINGS.SERVICES_WHY_PROMISE_TAGS]: z.string().trim().max(2000),
  // Services – CTA Section
  [SETTINGS.SERVICES_CTA_TITLE]: z.string().trim().min(1).max(200),
  [SETTINGS.SERVICES_CTA_BADGE]: z.string().trim().min(1).max(100),
  [SETTINGS.SERVICES_CTA_DESCRIPTION]: z.string().trim().min(1).max(2000),
  [SETTINGS.SERVICES_CTA_BTN1_TEXT]: z.string().trim().min(1).max(80),
  [SETTINGS.SERVICES_CTA_BTN1_URL]: z.string().trim().min(1).max(200),
  [SETTINGS.SERVICES_CTA_BTN2_TEXT]: z.string().trim().min(1).max(80),
  [SETTINGS.SERVICES_CTA_BTN2_URL]: z.string().trim().min(1).max(200),

  // Services – What We Do
  [SETTINGS.SERVICES_WHAT_TITLE]: z.string().trim().min(1).max(200),
  [SETTINGS.SERVICES_WHAT_DESCRIPTION]: z.string().trim().min(1).max(2000),
  [SETTINGS.SERVICES_WHAT_FEATURES]: z.array(z.object({
    title: z.string().trim().max(140),
    desc: z.string().trim().max(1200),
    icon: z.string().trim().max(100),
  })),
  [SETTINGS.SERVICES_WHAT_IMAGES]: z.array(z.string().trim().max(2000).optional().or(z.literal(''))),

  // Products Page
  [SETTINGS.PRODUCTS_HERO_TITLE]: z.string().trim().max(200).optional().or(z.literal('')),
  [SETTINGS.PRODUCTS_HERO_HIGHLIGHT]: z.string().trim().max(200).optional().or(z.literal('')),
  [SETTINGS.PRODUCTS_HERO_DESCRIPTION]: z.string().trim().max(2000).optional().or(z.literal('')),
  [SETTINGS.PRODUCTS_HERO_IMAGE_URL]: z.string().trim().max(2000).optional().or(z.literal('')),
  [SETTINGS.PRODUCTS_HERO_PROJECTS_DELIVERED]: z.string().trim().max(100).optional().or(z.literal('')),
  [SETTINGS.PRODUCTS_HERO_CLIENT_SATISFACTION]: z.string().trim().max(100).optional().or(z.literal('')),
  [SETTINGS.PRODUCTS_MICRO_APPS_TITLE]: z.string().trim().max(200).optional().or(z.literal('')),
  [SETTINGS.PRODUCTS_MICRO_APPS_SUBTITLE]: z.string().trim().max(200).optional().or(z.literal('')),
  [SETTINGS.PRODUCTS_MICRO_APPS_LEFT_INTRO]: z.string().trim().max(2000).optional().or(z.literal('')),
  [SETTINGS.PRODUCTS_MICRO_APPS_LEFT_HEADING]: z.string().trim().max(200).optional().or(z.literal('')),
  [SETTINGS.PRODUCTS_MICRO_APPS_LEFT_TEXT]: z.string().trim().max(2000).optional().or(z.literal('')),
  [SETTINGS.PRODUCTS_MICRO_APPS_LEFT_BULLETS]: z.array(z.string().trim().max(500)).optional(),
  [SETTINGS.PRODUCTS_MICRO_APPS_RIGHT_TEXT_TOP]: z.string().trim().max(5000).optional().or(z.literal('')),
  [SETTINGS.PRODUCTS_MICRO_APPS_RIGHT_HEADING]: z.string().trim().max(200).optional().or(z.literal('')),
  [SETTINGS.PRODUCTS_MICRO_APPS_RIGHT_BULLETS]: z.array(z.string().trim().max(500)).optional(),
  [SETTINGS.PRODUCTS_MICRO_APPS_RIGHT_TEXT_BOTTOM]: z.string().trim().max(2000).optional().or(z.literal('')),

  // Home – Solutions Section
  [SETTINGS.HOME_SOLUTIONS_TITLE]: z.string().trim().max(200).optional().or(z.literal('')),
  [SETTINGS.HOME_SOLUTIONS_BADGE]: z.string().trim().max(100).optional().or(z.literal('')),
  [SETTINGS.HOME_SOLUTIONS_DESCRIPTION]: z.string().trim().max(2000).optional().or(z.literal('')),
  [SETTINGS.HOME_SOLUTIONS_ITEMS]: z.array(z.string().trim().max(200).optional().or(z.literal(''))),

  // Home – Services & Recent Work
  [SETTINGS.HOME_SERVICES_TITLE]: z.string().trim().max(200).optional().or(z.literal('')),
  [SETTINGS.HOME_SERVICES_BADGE]: z.string().trim().max(100).optional().or(z.literal('')),
  [SETTINGS.HOME_RECENT_WORK_TITLE]: z.string().trim().max(200).optional().or(z.literal('')),
  [SETTINGS.HOME_RECENT_WORK_BADGE]: z.string().trim().max(100).optional().or(z.literal('')),
  [SETTINGS.HOME_RECENT_WORK_ITEMS]: z.array(z.object({
    id: z.string(),
    title: z.string().trim().max(200),
    description: z.string().trim().max(1200),
    category: z.string().trim().max(100),
    imageUrl: z.string().trim().max(2000),
    badgeClass: z.string().trim().max(200).optional().or(z.literal('')),
  })).optional(),

  // Home – Video Background
  [SETTINGS.HOME_VIDEO_URL]: z.string().trim().max(2000).or(z.literal("")),
  [SETTINGS.HOME_VIDEO_ENABLED]: z.boolean(),

  // Contact – Hero & Presence
  [SETTINGS.CONTACT_HERO_TITLE]: z.string().trim().min(1).max(200),
  [SETTINGS.CONTACT_HERO_DESCRIPTION]: z.string().trim().min(1).max(2000),
  [SETTINGS.CONTACT_GLOBAL_PRESENCE_BADGE]: z.string().trim().min(1).max(100),
  [SETTINGS.CONTACT_GLOBAL_PRESENCE_TITLE]: z.string().trim().min(1).max(200),

  // Contact – Branch 1
  [SETTINGS.CONTACT_BRANCH1_TITLE]: z.string().trim().max(140).optional().or(z.literal('')),
  [SETTINGS.CONTACT_BRANCH1_ADDRESS]: z.string().trim().max(800).optional().or(z.literal('')),
  [SETTINGS.CONTACT_BRANCH1_MAP_LINK]: z.string().trim().max(3000).optional().or(z.literal('')),
  [SETTINGS.CONTACT_BRANCH1_LAT_LONG]: z.string().trim().max(200).optional().or(z.literal('')),
  [SETTINGS.CONTACT_BRANCH1_MARKER_X]: z.string().trim().max(100).or(z.number()),
  [SETTINGS.CONTACT_BRANCH1_MARKER_Y]: z.string().trim().max(100).or(z.number()),

  // Contact – Branch 2
  [SETTINGS.CONTACT_BRANCH2_TITLE]: z.string().trim().max(140).optional().or(z.literal('')),
  [SETTINGS.CONTACT_BRANCH2_ADDRESS]: z.string().trim().max(800).optional().or(z.literal('')),
  [SETTINGS.CONTACT_BRANCH2_MAP_LINK]: z.string().trim().max(3000).optional().or(z.literal('')),
  [SETTINGS.CONTACT_BRANCH2_LAT_LONG]: z.string().trim().max(200).optional().or(z.literal('')),
  [SETTINGS.CONTACT_BRANCH2_MARKER_X]: z.string().trim().max(100).or(z.number()),
  [SETTINGS.CONTACT_BRANCH2_MARKER_Y]: z.string().trim().max(100).or(z.number()),

  // Contact – Branch 3
  [SETTINGS.CONTACT_BRANCH3_TITLE]: z.string().trim().max(140).optional().or(z.literal('')),
  [SETTINGS.CONTACT_BRANCH3_ADDRESS]: z.string().trim().max(800).optional().or(z.literal('')),
  [SETTINGS.CONTACT_BRANCH3_MAP_LINK]: z.string().trim().max(3000).optional().or(z.literal('')),
  [SETTINGS.CONTACT_BRANCH3_LAT_LONG]: z.string().trim().max(200).optional().or(z.literal('')),
  [SETTINGS.CONTACT_BRANCH3_MARKER_X]: z.string().trim().max(100).or(z.number()),
  [SETTINGS.CONTACT_BRANCH3_MARKER_Y]: z.string().trim().max(100).or(z.number()),

  // Contact – Support Channels
  [SETTINGS.CONTACT_SUPPORT_TITLE]: z.string().trim().min(1).max(200),
  [SETTINGS.CONTACT_SUPPORT_DESCRIPTION]: z.string().trim().min(1).max(2000),
  [SETTINGS.CONTACT_SUPPORT_ITEM1_TITLE]: z.string().trim().min(1).max(140),
  [SETTINGS.CONTACT_SUPPORT_ITEM1_DESC]: z.string().trim().min(1).max(400),
  [SETTINGS.CONTACT_SUPPORT_ITEM1_LINK]: z.string().trim().min(1).max(1000),
  [SETTINGS.CONTACT_SUPPORT_ITEM2_TITLE]: z.string().trim().min(1).max(140),
  [SETTINGS.CONTACT_SUPPORT_ITEM2_DESC]: z.string().trim().min(1).max(400),
  [SETTINGS.CONTACT_SUPPORT_ITEM2_LINK]: z.string().trim().min(1).max(1000),
  [SETTINGS.CONTACT_SUPPORT_ITEM3_TITLE]: z.string().trim().min(1).max(140),
  [SETTINGS.CONTACT_SUPPORT_ITEM3_DESC]: z.string().trim().min(1).max(400),
  [SETTINGS.CONTACT_SUPPORT_ITEM3_STATUS]: z.string().trim().min(1).max(100),

  // Contact – FAQs Section
  [SETTINGS.CONTACT_FAQ_TITLE]: z.string().trim().min(1).max(200),
  [SETTINGS.CONTACT_FAQ_DESCRIPTION]: z.string().trim().min(1).max(2000),
  [SETTINGS.CONTACT_FAQ1_QUESTION]: z.string().trim().min(1).max(400),
  [SETTINGS.CONTACT_FAQ1_ANSWER]: z.string().trim().min(1).max(2000),
  [SETTINGS.CONTACT_FAQ2_QUESTION]: z.string().trim().min(1).max(400),
  [SETTINGS.CONTACT_FAQ2_ANSWER]: z.string().trim().min(1).max(2000),
  [SETTINGS.CONTACT_FAQ3_QUESTION]: z.string().trim().min(1).max(400),
  [SETTINGS.CONTACT_FAQ3_ANSWER]: z.string().trim().min(1).max(2000),

  // Contact – Dynamic Branches List
  [SETTINGS.CONTACT_BRANCHES]: z.array(z.object({
    id: z.string(),
    title: z.string().trim().max(140).nullable().optional().or(z.literal('')),
    address: z.string().trim().max(1000).nullable().optional().or(z.literal('')),
    mapLink: z.string().trim().max(3000).nullable().optional().or(z.literal('')),
    latLong: z.string().trim().max(100).nullable().optional().or(z.literal('')),
    markerX: z.coerce.number().optional().default(50),
    markerY: z.coerce.number().optional().default(50),
  })).optional(),

  // Admin Notification Email
  [SETTINGS.ADMIN_NOTIFICATION_EMAIL]: z.string().trim().refine((val) => val === '' || val.split(',').every((email) => z.string().email().safeParse(email.trim()).success), 'Must be a comma-separated list of valid emails'),

  // SMTP Configuration
  [SETTINGS.SMTP_HOST]: z.string().trim().max(255).optional().or(z.literal('')),
  [SETTINGS.SMTP_PORT]: z.string().trim().max(10).optional().or(z.literal('')),
  [SETTINGS.SMTP_USER]: z.string().trim().max(255).optional().or(z.literal('')),
  [SETTINGS.SMTP_PASS]: z.string().trim().max(255).optional().or(z.literal('')),
  [SETTINGS.SMTP_FROM]: z.string().trim().email("Must be a valid email").optional().or(z.literal('')),
};

const settingKeys = Object.values(SETTINGS) as [
  (typeof SETTINGS)[keyof typeof SETTINGS],
  ...(typeof SETTINGS)[keyof typeof SETTINGS][]
];

export const settingKeySchema = z.enum(settingKeys, {
  error: "Invalid setting key",
});

export const upsertSettingSchema = z
  .object({
    key: settingKeySchema,
    value: z.unknown(),
  })
  .superRefine((data, ctx) => {
    const schema = settingSchemas[data.key];
    const parsed = schema.safeParse(data.value);

    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0];
      ctx.addIssue({
        code: "custom",
        path: ["value"],
        message: firstIssue?.message || "Invalid setting value",
      });
    }
  });