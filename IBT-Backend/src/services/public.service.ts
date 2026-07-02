import { BlogStatus, ContactType, LabStatus } from "../../generated/prisma/client";
import { prisma } from "../lib/prisma";
import { SETTINGS } from "../types/settings";
import { httpError } from "../utils/httpError";

type Pagination = {
  page?: number;
  limit?: number;
};

type PaginatedResult<T> = {
  items: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
};

const normalizeCategory = (value?: string) => value?.trim().toLowerCase() || undefined;

const buildExcerpt = (content: string, maxLength = 180) => {
  const normalized = content.replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLength) {
    return normalized;
  }

  return `${normalized.slice(0, maxLength).trimEnd()}...`;
};

const toPaginated = async <T>(
  baseQuery: {
    where: Record<string, unknown>;
    orderBy?: Record<string, "asc" | "desc">[];
  },
  filters: Pagination,
  findMany: (args: {
    where: Record<string, unknown>;
    orderBy?: Record<string, "asc" | "desc">[];
    skip?: number;
    take?: number;
  }) => Promise<T[]>,
  count: (args: { where: Record<string, unknown> }) => Promise<number>
): Promise<T[] | PaginatedResult<T>> => {
  const shouldPaginate = filters.page !== undefined && filters.limit !== undefined;

  if (!shouldPaginate) {
    return findMany({
      where: baseQuery.where,
      orderBy: baseQuery.orderBy,
    });
  }

  const skip = (filters.page! - 1) * filters.limit!;
  const take = filters.limit;

  const [items, total] = await Promise.all([
    findMany({ where: baseQuery.where, orderBy: baseQuery.orderBy, skip, take }),
    count({ where: baseQuery.where }),
  ]);

  const page = filters.page!;
  const limit = filters.limit!;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return {
    items,
    meta: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
};

const getBlogPublicWhere = (now: Date = new Date()) => ({
  status: BlogStatus.PUBLISHED,
  publishedAt: { lte: now },
});

const publicSettingKeys = [
  SETTINGS.MAINTENANCE_MODE,
  SETTINGS.MAINTENANCE_MESSAGE,
  SETTINGS.MAINTENANCE_END_TIME,
  SETTINGS.WHATSAPP_NUMBER,
  // Internship
  SETTINGS.INTERNSHIP_HERO_TITLE,
  SETTINGS.INTERNSHIP_HERO_SUBTITLE,
  SETTINGS.INTERNSHIP_HERO_DESCRIPTION,
  SETTINGS.INTERNSHIP_HERO_IMAGE_URL,
  SETTINGS.INTERNSHIP_INTRO_TITLE,
  SETTINGS.INTERNSHIP_INTRO_DESCRIPTION,
  SETTINGS.INTERNSHIP_APPROACH_TITLE,
  SETTINGS.INTERNSHIP_APPROACH_DESCRIPTION,
  SETTINGS.INTERNSHIP_CARD_ONE_VALUE,
  SETTINGS.INTERNSHIP_CARD_ONE_TITLE,
  SETTINGS.INTERNSHIP_CARD_ONE_DESCRIPTION,
  SETTINGS.INTERNSHIP_CARD_TWO_VALUE,
  SETTINGS.INTERNSHIP_CARD_TWO_TITLE,
  SETTINGS.INTERNSHIP_CARD_TWO_DESCRIPTION,
  SETTINGS.INTERNSHIP_CARD_THREE_VALUE,
  SETTINGS.INTERNSHIP_CARD_THREE_TITLE,
  SETTINGS.INTERNSHIP_CARD_THREE_DESCRIPTION,
  SETTINGS.INTERNSHIP_GALLERY_TITLE,
  SETTINGS.INTERNSHIP_GALLERY_IMAGE_URLS,
  SETTINGS.INTERNSHIP_TESTIMONIALS_TITLE,
  SETTINGS.INTERNSHIP_CLOSING_TITLE,
  SETTINGS.INTERNSHIP_CLOSING_CONTENT,
  SETTINGS.INTERNSHIP_APPLY_EMAIL,
  SETTINGS.INTERNSHIP_PROGRAMS,
  SETTINGS.INTERNSHIP_TESTIMONIALS,
  // Labs – Hero
  SETTINGS.LABS_HERO_TITLE,
  SETTINGS.LABS_HERO_SUBTITLE,
  SETTINGS.LABS_HERO_DESCRIPTION,
  SETTINGS.LABS_HERO_IMAGE_URL,
  SETTINGS.LABS_HERO_BTN1_TEXT,
  SETTINGS.LABS_HERO_BTN2_TEXT,
  // Labs – Intro
  SETTINGS.LABS_PAGE_TITLE,
  SETTINGS.LABS_PAGE_SUBTITLE,
  SETTINGS.LABS_INTRO_DESCRIPTION,
  SETTINGS.LABS_INTRO_IMAGE_URL,
  SETTINGS.LABS_INTRO_BTN_TEXT,
  SETTINGS.LABS_INTRO_FEATURE1_TITLE,
  SETTINGS.LABS_INTRO_FEATURE1_DESC,
  SETTINGS.LABS_INTRO_FEATURE2_TITLE,
  SETTINGS.LABS_INTRO_FEATURE2_DESC,
  SETTINGS.LABS_INTRO_FEATURE3_TITLE,
  SETTINGS.LABS_INTRO_FEATURE3_DESC,
  SETTINGS.LABS_INTRO_FEATURE4_TITLE,
  SETTINGS.LABS_INTRO_FEATURE4_DESC,
  // Labs – Spotlights
  SETTINGS.LABS_SPOTLIGHTS,
  // Labs – Careers
  SETTINGS.LABS_CAREERS_TITLE,
  SETTINGS.LABS_CAREERS_DESCRIPTION,
  SETTINGS.LABS_CAREERS_BTN_TEXT,
  // Labs – CTA
  SETTINGS.LABS_CTA_TITLE,
  SETTINGS.LABS_CTA_DESCRIPTION,
  SETTINGS.LABS_CTA_BTN_TEXT,

  // Labs – Initiatives, Rigor, Mentorship
  SETTINGS.LABS_INITIATIVES,
  SETTINGS.LABS_RIGOR_TITLE,
  SETTINGS.LABS_RIGOR_DESCRIPTION,
  SETTINGS.LABS_RIGOR_POINTS,
  SETTINGS.LABS_RIGOR_IMAGE,
  SETTINGS.LABS_MENTORSHIP_TITLE,
  SETTINGS.LABS_MENTORSHIP_DESCRIPTION,
  SETTINGS.LABS_MENTORSHIP_IMAGE,
  SETTINGS.LABS_MENTORSHIP_QUOTE,
  SETTINGS.LABS_MENTORSHIP_QUOTE_AUTHOR,
  SETTINGS.LABS_MENTORSHIP_QUOTE_ROLE,
  SETTINGS.LABS_MENTORSHIP_QUOTE_AVATAR,
  // Services – Hero
  SETTINGS.SERVICES_HERO_TITLE,
  SETTINGS.SERVICES_HERO_GRADIENT,
  SETTINGS.SERVICES_HERO_BADGE,
  SETTINGS.SERVICES_HERO_DESCRIPTION,
  SETTINGS.SERVICES_HERO_BTN1_TEXT,
  SETTINGS.SERVICES_HERO_BTN1_URL,
  SETTINGS.SERVICES_HERO_BTN2_TEXT,
  SETTINGS.SERVICES_HERO_BTN2_URL,
  // Services – Capabilities Header
  SETTINGS.SERVICES_CAP_TITLE,
  SETTINGS.SERVICES_CAP_HIGHLIGHT,
  SETTINGS.SERVICES_CAP_BADGE,
  SETTINGS.SERVICES_CAP_DESCRIPTION,
  // Services – Process Section
  SETTINGS.SERVICES_PROCESS_TITLE,
  SETTINGS.SERVICES_PROCESS_BADGE,
  SETTINGS.SERVICES_PROCESS_DESCRIPTION,
  SETTINGS.SERVICES_PROCESS_STEPS,
  // Services – Why Section
  SETTINGS.SERVICES_WHY_TITLE,
  SETTINGS.SERVICES_WHY_BADGE,
  SETTINGS.SERVICES_WHY_DESCRIPTION,
  SETTINGS.SERVICES_WHY_ITEMS,
  SETTINGS.SERVICES_WHY_PROMISE_BADGE,
  SETTINGS.SERVICES_WHY_PROMISE_QUOTE,
  SETTINGS.SERVICES_WHY_PROMISE_AUTHOR,
  SETTINGS.SERVICES_WHY_PROMISE_SUB,
  SETTINGS.SERVICES_WHY_PROMISE_TAGS,
  SETTINGS.SERVICES_CTA_TITLE,
  SETTINGS.SERVICES_CTA_BADGE,
  SETTINGS.SERVICES_CTA_DESCRIPTION,
  SETTINGS.SERVICES_CTA_BTN1_TEXT,
  SETTINGS.SERVICES_CTA_BTN1_URL,
  SETTINGS.SERVICES_CTA_BTN2_TEXT,
  SETTINGS.SERVICES_CTA_BTN2_URL,

  // Services – What We Do
  SETTINGS.SERVICES_WHAT_TITLE,
  SETTINGS.SERVICES_WHAT_DESCRIPTION,
  SETTINGS.SERVICES_WHAT_FEATURES,
  SETTINGS.SERVICES_WHAT_IMAGES,

  // Home – Solutions Section
  SETTINGS.HOME_SOLUTIONS_TITLE,
  SETTINGS.HOME_SOLUTIONS_BADGE,
  SETTINGS.HOME_SOLUTIONS_DESCRIPTION,
  SETTINGS.HOME_SOLUTIONS_ITEMS,

  // Home – Services & Recent Work
  SETTINGS.HOME_SERVICES_TITLE,
  SETTINGS.HOME_SERVICES_BADGE,
  SETTINGS.HOME_RECENT_WORK_TITLE,
  SETTINGS.HOME_RECENT_WORK_BADGE,
  SETTINGS.HOME_RECENT_WORK_ITEMS,

  // Home Page Video
  SETTINGS.HOME_VIDEO_URL,
  SETTINGS.HOME_VIDEO_ENABLED,

  // About Page
  SETTINGS.ABOUT_WHO_TITLE,
  SETTINGS.ABOUT_WHO_DESCRIPTION,
  SETTINGS.ABOUT_WHO_SECONDARY_DESCRIPTION,
  SETTINGS.ABOUT_WHO_FEATURES,
  SETTINGS.ABOUT_WHO_IMAGES,
  SETTINGS.ABOUT_PROCESS_BADGE,
  SETTINGS.ABOUT_PROCESS_TITLE,
  SETTINGS.ABOUT_PROCESS_FEATURES,
  SETTINGS.ABOUT_PROCESS_IMAGE,
  SETTINGS.ABOUT_MISSION_TITLE,
  SETTINGS.ABOUT_MISSION_DESC,
  SETTINGS.ABOUT_VISION_TITLE,
  SETTINGS.ABOUT_VISION_DESC,
  SETTINGS.ABOUT_MISSION_CARDS,
  SETTINGS.ABOUT_CONTACT_BADGE,
  SETTINGS.ABOUT_CONTACT_TITLE,
  SETTINGS.ABOUT_CONTACT_IMAGE,

  // Contact – Hero & Presence
  SETTINGS.CONTACT_HERO_TITLE,
  SETTINGS.CONTACT_HERO_DESCRIPTION,
  SETTINGS.CONTACT_GLOBAL_PRESENCE_BADGE,
  SETTINGS.CONTACT_GLOBAL_PRESENCE_TITLE,

  // Contact – Branch 1
  SETTINGS.CONTACT_BRANCH1_TITLE,
  SETTINGS.CONTACT_BRANCH1_ADDRESS,
  SETTINGS.CONTACT_BRANCH1_MAP_LINK,
  SETTINGS.CONTACT_BRANCH1_LAT_LONG,
  SETTINGS.CONTACT_BRANCH1_MARKER_X,
  SETTINGS.CONTACT_BRANCH1_MARKER_Y,

  // Contact – Branch 2
  SETTINGS.CONTACT_BRANCH2_TITLE,
  SETTINGS.CONTACT_BRANCH2_ADDRESS,
  SETTINGS.CONTACT_BRANCH2_MAP_LINK,
  SETTINGS.CONTACT_BRANCH2_LAT_LONG,
  SETTINGS.CONTACT_BRANCH2_MARKER_X,
  SETTINGS.CONTACT_BRANCH2_MARKER_Y,

  // Contact – Branch 3
  SETTINGS.CONTACT_BRANCH3_TITLE,
  SETTINGS.CONTACT_BRANCH3_ADDRESS,
  SETTINGS.CONTACT_BRANCH3_MAP_LINK,
  SETTINGS.CONTACT_BRANCH3_LAT_LONG,
  SETTINGS.CONTACT_BRANCH3_MARKER_X,
  SETTINGS.CONTACT_BRANCH3_MARKER_Y,

  // Contact – Support Channels
  SETTINGS.CONTACT_SUPPORT_TITLE,
  SETTINGS.CONTACT_SUPPORT_DESCRIPTION,
  SETTINGS.CONTACT_SUPPORT_ITEM1_TITLE,
  SETTINGS.CONTACT_SUPPORT_ITEM1_DESC,
  SETTINGS.CONTACT_SUPPORT_ITEM1_LINK,
  SETTINGS.CONTACT_SUPPORT_ITEM2_TITLE,
  SETTINGS.CONTACT_SUPPORT_ITEM2_DESC,
  SETTINGS.CONTACT_SUPPORT_ITEM2_LINK,
  SETTINGS.CONTACT_SUPPORT_ITEM3_TITLE,
  SETTINGS.CONTACT_SUPPORT_ITEM3_DESC,
  SETTINGS.CONTACT_SUPPORT_ITEM3_STATUS,

  // Contact – FAQs
  SETTINGS.CONTACT_FAQ_TITLE,
  SETTINGS.CONTACT_FAQ_DESCRIPTION,
  SETTINGS.CONTACT_FAQ1_QUESTION,
  SETTINGS.CONTACT_FAQ1_ANSWER,
  SETTINGS.CONTACT_FAQ2_QUESTION,
  SETTINGS.CONTACT_FAQ2_ANSWER,
  SETTINGS.CONTACT_FAQ3_QUESTION,
  SETTINGS.CONTACT_FAQ3_ANSWER,
  SETTINGS.HOME_VIDEO_URL,
  SETTINGS.HOME_VIDEO_ENABLED,
  SETTINGS.CONTACT_BRANCHES,
];

const mapPublicBlogListItem = (item: {
  id: string;
  title: string;
  slug: string;
  content: string;
  imageUrl: string | null;
  category: string | null;
  publishedAt: Date | null;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}) => ({
  id: item.id,
  title: item.title,
  slug: item.slug,
  imageUrl: item.imageUrl,
  category: item.category,
  featured: item.featured,
  publishedAt: item.publishedAt,
  excerpt: buildExcerpt(item.content),
  createdAt: item.createdAt,
  updatedAt: item.updatedAt,
});

export const getPublicHome = async () => {
  try {
    const now = new Date();

    const [
    services,
    stats,
    testimonials,
    partners,
    partnerColleges,
    clients,
    socialLinks,
    contacts,
    featuredBlogs,
    featuredProjects,
    terms,
    team,
    branches,
  ] = await Promise.all([
    prisma.service.findMany({
      select: { id: true, title: true, slug: true, description: true, imageUrl: true, tags: true, order: true },
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
      take: 6,
    }),
    prisma.stat.findMany({
      select: { id: true, label: true, value: true, category: true, order: true },
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    }),
    prisma.testimonial.findMany({
      select: { id: true, name: true, content: true, role: true, company: true, avatarUrl: true, order: true },
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
      take: 12,
    }),
    prisma.partner.findMany({
      select: { id: true, name: true, logoUrl: true, website: true, order: true },
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
      take: 12,
    }),
    prisma.partnerCollege.findMany({
      select: { id: true, name: true, logoUrl: true, website: true, order: true },
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
      take: 30,
    }),
    prisma.client.findMany({
      select: { id: true, name: true, logoUrl: true, website: true, order: true },
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
      take: 12,
    }),
    prisma.socialLink.findMany({
      select: { id: true, platform: true, logoUrl: true, url: true, order: true },
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    }),
    prisma.contact.findMany({
      select: { id: true, type: true, value: true, order: true },
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    }),
    prisma.blog.findMany({
      where: {
        ...getBlogPublicWhere(now),
        featured: true,
      },
      select: {
        id: true,
        title: true,
        slug: true,
        content: true,
        imageUrl: true,
        category: true,
        publishedAt: true,
        featured: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      take: 3,
    }),
    prisma.labProject.findMany({
      where: {
        status: { in: [LabStatus.ONGOING, LabStatus.COMPLETED] },
        featured: true,
      },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        imageUrl: true,
        gallery: true,
        tags: true,
        techStack: true,
        projectUrl: true,
        repoUrl: true,
        status: true,
        featured: true,
        order: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
      take: 6,
    }),
    prisma.terms.findFirst({
      select: { id: true, content: true, updatedAt: true },
      orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
    }),
    prisma.member.findMany({
      select: {
        id: true,
        name: true,
        role: true,
        avatarUrl: true,
        branches: {
          select: {
            order: true,
            branch: {
              select: { id: true, name: true, location: true, type: true },
            },
          },
          orderBy: { order: "asc" },
        },
        order: true,
      },
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
      take: 8,
    }),
    prisma.branch.findMany({
      select: {
        id: true,
        name: true,
        location: true,
        type: true,
        order: true,
        _count: { select: { teamMembers: true } },
      },
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    }),
    ]);

    const settings = await prisma.setting.findMany({
    where: {
      key: {
        in: publicSettingKeys,
      },
    },
    select: {
      key: true,
      value: true,
      updatedAt: true,
    },
  });

  const maintenanceMap = new Map(settings.map((item) => [item.key, item.value]));

  // Parse maintenance mode from string stored in DB
  const maintenanceModeValue = maintenanceMap.get(SETTINGS.MAINTENANCE_MODE);
  const maintenanceMode = maintenanceModeValue === "true" || maintenanceModeValue === true;

  return {
    generatedAt: now,
    hero: {
      maintenanceMode,
      maintenanceMessage: (maintenanceMap.get(SETTINGS.MAINTENANCE_MESSAGE) as string | undefined) ?? null,
      maintenanceEndTime: (maintenanceMap.get(SETTINGS.MAINTENANCE_END_TIME) as string | undefined) ?? null,
      whatsappNumber: (maintenanceMap.get(SETTINGS.WHATSAPP_NUMBER) as string | undefined) ?? null,
    },
    services,
    stats,
    testimonials,
    partners,
    partnerColleges,
    clients,
    socialLinks,
    contacts,
    team,
    branches,
    featuredBlogs: featuredBlogs.map(mapPublicBlogListItem),
    featuredProjects,
    terms,
    };
  } catch (err) {
    console.error('Public service: failed to fetch public home from DB, returning fallback.', err);

    // Return a safe fallback so the public site can still render
    return {
      generatedAt: new Date(),
      hero: {
        maintenanceMode: false,
        maintenanceMessage: null,
        maintenanceEndTime: null,
        whatsappNumber: null,
      },
      services: [],
      stats: [],
      testimonials: [],
      partners: [],
      partnerColleges: [],
      clients: [],
      socialLinks: [],
      contacts: [],
      team: [],
      branches: [],
      featuredBlogs: [],
      featuredProjects: [],
      terms: null,
    };
  }
};

export const getPublicBlogs = async (filters: {
  search?: string;
  category?: string;
  featured?: boolean;
  page?: number;
  limit?: number;
}) => {
  const where = {
    ...getBlogPublicWhere(),
    category: filters.category ? normalizeCategory(filters.category) : undefined,
    featured: filters.featured,
    OR: filters.search
      ? [
          { title: { contains: filters.search, mode: "insensitive" as const } },
          { content: { contains: filters.search, mode: "insensitive" as const } },
          { category: { contains: filters.search, mode: "insensitive" as const } },
        ]
      : undefined,
  };

  const result = await toPaginated(
    {
      where,
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    },
    filters,
    (args) =>
      prisma.blog.findMany({
        ...args,
        select: {
          id: true,
          title: true,
          slug: true,
          content: true,
          imageUrl: true,
          category: true,
          featured: true,
          publishedAt: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
    (args) => prisma.blog.count(args)
  );

  if (Array.isArray(result)) {
    return result.map(mapPublicBlogListItem);
  }

  return {
    ...result,
    items: result.items.map(mapPublicBlogListItem),
  };
};

export const getPublicFeaturedBlogs = async (filters: {
  page?: number;
  limit?: number;
}) => {
  return getPublicBlogs({
    ...filters,
    featured: true,
  });
};

export const getPublicBlogBySlug = async (slug: string) => {
  const blog = await prisma.blog.findFirst({
    where: {
      slug,
      ...getBlogPublicWhere(),
    },
    select: {
      id: true,
      title: true,
      slug: true,
      content: true,
      imageUrl: true,
      category: true,
      status: true,
      featured: true,
      publishedAt: true,
      quickTips: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!blog) {
    throw httpError(404, "Blog not found");
  }

  return blog;
};

export const getPublicProjects = async (filters: {
  search?: string;
  tag?: string;
  tech?: string;
  featured?: boolean;
  status?: LabStatus;
  page?: number;
  limit?: number;
}) => {
  const where = {
    status: filters.status ?? { in: [LabStatus.ONGOING, LabStatus.COMPLETED] },
    featured: filters.featured,
    tags: filters.tag
      ? {
          has: filters.tag.toLowerCase(),
        }
      : undefined,
    techStack: filters.tech
      ? {
          has: filters.tech.toLowerCase(),
        }
      : undefined,
    OR: filters.search
      ? [
          { title: { contains: filters.search, mode: "insensitive" as const } },
          { description: { contains: filters.search, mode: "insensitive" as const } },
          { content: { contains: filters.search, mode: "insensitive" as const } },
        ]
      : undefined,
  };

  return toPaginated(
    {
      where,
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    },
    filters,
    (args) => prisma.labProject.findMany(args),
    (args) => prisma.labProject.count(args)
  );
};

export const getPublicFeaturedProjects = async (filters: {
  page?: number;
  limit?: number;
}) => {
  return getPublicProjects({
    ...filters,
    featured: true,
  });
};

export const getPublicProjectBySlug = async (slug: string) => {
  const project = await prisma.labProject.findFirst({
    where: {
      slug,
      status: { in: [LabStatus.ONGOING, LabStatus.COMPLETED] },
    },
  });

  if (!project) {
    throw httpError(404, "Lab project not found");
  }

  return project;
};

export const getPublicServices = async (filters: {
  search?: string;
  tag?: string;
  page?: number;
  limit?: number;
}) => {
  const where = {
    title: filters.search
      ? {
          contains: filters.search,
          mode: "insensitive" as const,
        }
      : undefined,
    tags: filters.tag
      ? {
          has: filters.tag.toLowerCase(),
        }
      : undefined,
  };

  return toPaginated(
    {
      where,
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    },
    filters,
    (args) => prisma.service.findMany(args),
    (args) => prisma.service.count(args)
  );
};

export const getPublicServiceBySlug = async (slug: string) => {
  const service = await prisma.service.findUnique({ where: { slug } });

  if (!service) {
    throw httpError(404, "Service not found");
  }

  return service;
};

export const getPublicTeam = async (filters: {
  search?: string;
  branchId?: string;
  page?: number;
  limit?: number;
}) => {
  const where = {
    OR: filters.search
      ? [
          { name: { contains: filters.search, mode: "insensitive" as const } },
          { role: { contains: filters.search, mode: "insensitive" as const } },
        ]
      : undefined,
    branches: filters.branchId
      ? {
          some: {
            branchId: filters.branchId,
          },
        }
      : undefined,
  };

  const result = await toPaginated(
    {
      where,
      orderBy: [{ createdAt: "asc" }],
    },
    filters,
    (args) =>
      prisma.member.findMany({
        ...args,
        select: {
          id: true,
          name: true,
          role: true,
          avatarUrl: true,
          order: true,
          branches: {
            select: {
              order: true,
              branch: {
                select: {
                  id: true,
                  name: true,
                  location: true,
                  type: true,
                },
              },
            },
            orderBy: { order: "asc" },
          },
        },
        orderBy: [{ order: "asc" }],
      }),
    (args) => prisma.member.count(args)
  );

  return result;
};

export const getPublicBranches = async (filters: {
  search?: string;
  page?: number;
  limit?: number;
}) => {
  const where = {
    name: filters.search
      ? {
          contains: filters.search,
          mode: "insensitive" as const,
        }
      : undefined,
  };

  return toPaginated(
    {
      where,
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    },
    filters,
    (args) =>
      prisma.branch.findMany({
        ...args,
        select: {
          id: true,
          name: true,
          location: true,
          address: true,
          mapUrl: true,
          type: true,
          order: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: { teamMembers: true },
          },
        },
      }),
    (args) => prisma.branch.count(args)
  );
};

export const getPublicBranchMembers = async (
  branchId: string,
  filters: {
    search?: string;
    page?: number;
    limit?: number;
  }
) => {
  const branchExists = await prisma.branch.findUnique({ where: { id: branchId }, select: { id: true } });
  if (!branchExists) {
    throw httpError(404, "Branch not found");
  }

  const where = {
    branchId,
    member: filters.search
      ? {
          OR: [
            { name: { contains: filters.search, mode: "insensitive" as const } },
            { role: { contains: filters.search, mode: "insensitive" as const } },
          ],
        }
      : undefined,
  };

  return toPaginated(
    {
      where,
      orderBy: [{ order: "asc" }],
    },
    filters,
    (args) =>
      prisma.branchMember.findMany({
        ...args,
        include: {
          member: {
            select: {
              id: true,
              name: true,
              role: true,
              avatarUrl: true,
            },
          },
        },
      }),
    (args) => prisma.branchMember.count(args)
  );
};

export const getPublicTestimonials = async (filters: {
  page?: number;
  limit?: number;
}) => {
  return toPaginated(
    {
      where: {},
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    },
    filters,
    (args) => prisma.testimonial.findMany(args),
    (args) => prisma.testimonial.count(args)
  );
};

export const getPublicPartners = async (filters: {
  page?: number;
  limit?: number;
}) => {
  return toPaginated(
    {
      where: {},
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    },
    filters,
    (args) => prisma.partner.findMany(args),
    (args) => prisma.partner.count(args)
  );
};

export const getPublicPartnerColleges = async (filters: {
  page?: number;
  limit?: number;
}) => {
  return toPaginated(
    {
      where: {},
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    },
    filters,
    (args) => prisma.partnerCollege.findMany(args),
    (args) => prisma.partnerCollege.count(args)
  );
};

export const getPublicClients = async (filters: {
  page?: number;
  limit?: number;
}) => {
  return toPaginated(
    {
      where: {},
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    },
    filters,
    (args) => prisma.client.findMany(args),
    (args) => prisma.client.count(args)
  );
};

export const getPublicStats = async (filters: {
  category?: string;
  page?: number;
  limit?: number;
}) => {
  const where = {
    category: filters.category ? normalizeCategory(filters.category) : undefined,
  };

  return toPaginated(
    {
      where,
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    },
    filters,
    (args) => prisma.stat.findMany(args),
    (args) => prisma.stat.count(args)
  );
};

export const getPublicSocialLinks = async (filters: {
  page?: number;
  limit?: number;
}) => {
  return toPaginated(
    {
      where: {},
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    },
    filters,
    (args) => prisma.socialLink.findMany(args),
    (args) => prisma.socialLink.count(args)
  );
};

export const getPublicContacts = async (filters: {
  type?: ContactType;
  page?: number;
  limit?: number;
}) => {
  const where = {
    type: filters.type,
  };

  return toPaginated(
    {
      where,
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    },
    filters,
    (args) => prisma.contact.findMany(args),
    (args) => prisma.contact.count(args)
  );
};

export const getPublicTerms = async (filters: {
  page?: number;
  limit?: number;
}) => {
  return toPaginated(
    {
      where: {},
      orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
    },
    filters,
    (args) => prisma.terms.findMany(args),
    (args) => prisma.terms.count(args)
  );
};

export const getPublicCurrentTerms = async () => {
  const terms = await prisma.terms.findFirst({
    orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
  });

  if (!terms) {
    throw httpError(404, "Terms not found");
  }

  return terms;
};

export const getPublicSettings = async (filters: {
  page?: number;
  limit?: number;
}) => {
  return toPaginated(
    {
      where: {
        key: {
          in: publicSettingKeys,
        },
      },
      orderBy: [{ createdAt: "asc" }],
    },
    filters,
    (args) =>
      prisma.setting.findMany({
        ...args,
        select: {
          id: true,
          key: true,
          value: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
    (args) => prisma.setting.count(args)
  );
};

export const getPublicSiteConfig = async () => {
  try {
    const settings = await prisma.setting.findMany({
      where: {
        key: {
          in: publicSettingKeys,
        },
      },
      select: {
        key: true,
        value: true,
        updatedAt: true,
      },
    });

    const values = new Map(settings.map((item) => [item.key, item.value]));

  // Parse maintenance mode from string stored in DB
  const maintenanceModeValue = values.get(SETTINGS.MAINTENANCE_MODE);
  const maintenanceMode = maintenanceModeValue === "true" || maintenanceModeValue === true;

  return {
    maintenanceMode,
    maintenanceMessage: (values.get(SETTINGS.MAINTENANCE_MESSAGE) as string | undefined) ?? null,
    maintenanceEndTime: (values.get(SETTINGS.MAINTENANCE_END_TIME) as string | undefined) ?? null,
    whatsappNumber: (values.get(SETTINGS.WHATSAPP_NUMBER) as string | undefined) ?? null,
    // Internship
    internshipHeroTitle: (values.get(SETTINGS.INTERNSHIP_HERO_TITLE) as string | undefined) ?? null,
    internshipHeroSubtitle: (values.get(SETTINGS.INTERNSHIP_HERO_SUBTITLE) as string | undefined) ?? null,
    internshipHeroDescription: (values.get(SETTINGS.INTERNSHIP_HERO_DESCRIPTION) as string | undefined) ?? null,
    internshipHeroImageUrl: (values.get(SETTINGS.INTERNSHIP_HERO_IMAGE_URL) as string | undefined) ?? null,
    internshipIntroTitle: (values.get(SETTINGS.INTERNSHIP_INTRO_TITLE) as string | undefined) ?? null,
    internshipIntroDescription: (values.get(SETTINGS.INTERNSHIP_INTRO_DESCRIPTION) as string | undefined) ?? null,
    internshipApproachTitle: (values.get(SETTINGS.INTERNSHIP_APPROACH_TITLE) as string | undefined) ?? null,
    internshipApproachDescription: (values.get(SETTINGS.INTERNSHIP_APPROACH_DESCRIPTION) as string | undefined) ?? null,
    internshipCardOneValue: (values.get(SETTINGS.INTERNSHIP_CARD_ONE_VALUE) as string | undefined) ?? null,
    internshipCardOneTitle: (values.get(SETTINGS.INTERNSHIP_CARD_ONE_TITLE) as string | undefined) ?? null,
    internshipCardOneDescription: (values.get(SETTINGS.INTERNSHIP_CARD_ONE_DESCRIPTION) as string | undefined) ?? null,
    internshipCardTwoValue: (values.get(SETTINGS.INTERNSHIP_CARD_TWO_VALUE) as string | undefined) ?? null,
    internshipCardTwoTitle: (values.get(SETTINGS.INTERNSHIP_CARD_TWO_TITLE) as string | undefined) ?? null,
    internshipCardTwoDescription: (values.get(SETTINGS.INTERNSHIP_CARD_TWO_DESCRIPTION) as string | undefined) ?? null,
    internshipCardThreeValue: (values.get(SETTINGS.INTERNSHIP_CARD_THREE_VALUE) as string | undefined) ?? null,
    internshipCardThreeTitle: (values.get(SETTINGS.INTERNSHIP_CARD_THREE_TITLE) as string | undefined) ?? null,
    internshipCardThreeDescription: (values.get(SETTINGS.INTERNSHIP_CARD_THREE_DESCRIPTION) as string | undefined) ?? null,
    internshipGalleryTitle: (values.get(SETTINGS.INTERNSHIP_GALLERY_TITLE) as string | undefined) ?? null,
    internshipGalleryImageUrls: (values.get(SETTINGS.INTERNSHIP_GALLERY_IMAGE_URLS) as string | undefined) ?? null,
    internshipTestimonialsTitle: (values.get(SETTINGS.INTERNSHIP_TESTIMONIALS_TITLE) as string | undefined) ?? null,
    internshipClosingTitle: (values.get(SETTINGS.INTERNSHIP_CLOSING_TITLE) as string | undefined) ?? null,
    internshipClosingContent: (values.get(SETTINGS.INTERNSHIP_CLOSING_CONTENT) as string | undefined) ?? null,
    internshipApplyEmail: (values.get(SETTINGS.INTERNSHIP_APPLY_EMAIL) as string | undefined) ?? null,
    internshipPrograms: (values.get(SETTINGS.INTERNSHIP_PROGRAMS) as string | undefined) ?? null,
    internshipTestimonials: (values.get(SETTINGS.INTERNSHIP_TESTIMONIALS) as string | undefined) ?? null,
    // Labs – Hero
    labs_hero_title: (values.get(SETTINGS.LABS_HERO_TITLE) as string | undefined) ?? null,
    labs_hero_subtitle: (values.get(SETTINGS.LABS_HERO_SUBTITLE) as string | undefined) ?? null,
    labs_hero_description: (values.get(SETTINGS.LABS_HERO_DESCRIPTION) as string | undefined) ?? null,
    labs_hero_image_url: (values.get(SETTINGS.LABS_HERO_IMAGE_URL) as string | undefined) ?? null,
    labs_hero_btn1_text: (values.get(SETTINGS.LABS_HERO_BTN1_TEXT) as string | undefined) ?? null,
    labs_hero_btn2_text: (values.get(SETTINGS.LABS_HERO_BTN2_TEXT) as string | undefined) ?? null,
    // Labs – Intro
    labs_page_title: (values.get(SETTINGS.LABS_PAGE_TITLE) as string | undefined) ?? null,
    labs_page_subtitle: (values.get(SETTINGS.LABS_PAGE_SUBTITLE) as string | undefined) ?? null,
    labs_intro_description: (values.get(SETTINGS.LABS_INTRO_DESCRIPTION) as string | undefined) ?? null,
    labs_intro_image_url: (values.get(SETTINGS.LABS_INTRO_IMAGE_URL) as string | undefined) ?? null,
    labs_intro_btn_text: (values.get(SETTINGS.LABS_INTRO_BTN_TEXT) as string | undefined) ?? null,
    labs_intro_feature1_title: (values.get(SETTINGS.LABS_INTRO_FEATURE1_TITLE) as string | undefined) ?? null,
    labs_intro_feature1_desc: (values.get(SETTINGS.LABS_INTRO_FEATURE1_DESC) as string | undefined) ?? null,
    labs_intro_feature2_title: (values.get(SETTINGS.LABS_INTRO_FEATURE2_TITLE) as string | undefined) ?? null,
    labs_intro_feature2_desc: (values.get(SETTINGS.LABS_INTRO_FEATURE2_DESC) as string | undefined) ?? null,
    labs_intro_feature3_title: (values.get(SETTINGS.LABS_INTRO_FEATURE3_TITLE) as string | undefined) ?? null,
    labs_intro_feature3_desc: (values.get(SETTINGS.LABS_INTRO_FEATURE3_DESC) as string | undefined) ?? null,
    labs_intro_feature4_title: (values.get(SETTINGS.LABS_INTRO_FEATURE4_TITLE) as string | undefined) ?? null,
    labs_intro_feature4_desc: (values.get(SETTINGS.LABS_INTRO_FEATURE4_DESC) as string | undefined) ?? null,
    // Labs – Spotlights (stored as JSON array)
    labs_spotlights: (values.get(SETTINGS.LABS_SPOTLIGHTS) as unknown[] | undefined) ?? [],
    // Labs – Careers
    labs_careers_title: (values.get(SETTINGS.LABS_CAREERS_TITLE) as string | undefined) ?? null,
    labs_careers_description: (values.get(SETTINGS.LABS_CAREERS_DESCRIPTION) as string | undefined) ?? null,
    labs_careers_btn_text: (values.get(SETTINGS.LABS_CAREERS_BTN_TEXT) as string | undefined) ?? null,
    // Labs – CTA
    labs_cta_title: (values.get(SETTINGS.LABS_CTA_TITLE) as string | undefined) ?? null,
    labs_cta_description: (values.get(SETTINGS.LABS_CTA_DESCRIPTION) as string | undefined) ?? null,
    labs_cta_btn_text: (values.get(SETTINGS.LABS_CTA_BTN_TEXT) as string | undefined) ?? null,
    // Services – Hero
    servicesHeroTitle: (values.get(SETTINGS.SERVICES_HERO_TITLE) as string | undefined) ?? null,
    servicesHeroGradient: (values.get(SETTINGS.SERVICES_HERO_GRADIENT) as string | undefined) ?? null,
    servicesHeroBadge: (values.get(SETTINGS.SERVICES_HERO_BADGE) as string | undefined) ?? null,
    servicesHeroDescription: (values.get(SETTINGS.SERVICES_HERO_DESCRIPTION) as string | undefined) ?? null,
    servicesHeroBtn1Text: (values.get(SETTINGS.SERVICES_HERO_BTN1_TEXT) as string | undefined) ?? null,
    servicesHeroBtn1Url: (values.get(SETTINGS.SERVICES_HERO_BTN1_URL) as string | undefined) ?? null,
    servicesHeroBtn2Text: (values.get(SETTINGS.SERVICES_HERO_BTN2_TEXT) as string | undefined) ?? null,
    servicesHeroBtn2Url: (values.get(SETTINGS.SERVICES_HERO_BTN2_URL) as string | undefined) ?? null,
    // Services – Capabilities Header
    servicesCapTitle: (values.get(SETTINGS.SERVICES_CAP_TITLE) as string | undefined) ?? null,
    servicesCapHighlight: (values.get(SETTINGS.SERVICES_CAP_HIGHLIGHT) as string | undefined) ?? null,
    servicesCapBadge: (values.get(SETTINGS.SERVICES_CAP_BADGE) as string | undefined) ?? null,
    servicesCapDescription: (values.get(SETTINGS.SERVICES_CAP_DESCRIPTION) as string | undefined) ?? null,
    // Services – Process Section
    servicesProcessTitle: (values.get(SETTINGS.SERVICES_PROCESS_TITLE) as string | undefined) ?? null,
    servicesProcessBadge: (values.get(SETTINGS.SERVICES_PROCESS_BADGE) as string | undefined) ?? null,
    servicesProcessDescription: (values.get(SETTINGS.SERVICES_PROCESS_DESCRIPTION) as string | undefined) ?? null,
    servicesProcessSteps: (values.get(SETTINGS.SERVICES_PROCESS_STEPS) as unknown[] | undefined) ?? [],
    // Services – Why Section
    servicesWhyTitle: (values.get(SETTINGS.SERVICES_WHY_TITLE) as string | undefined) ?? null,
    servicesWhyBadge: (values.get(SETTINGS.SERVICES_WHY_BADGE) as string | undefined) ?? null,
    servicesWhyDescription: (values.get(SETTINGS.SERVICES_WHY_DESCRIPTION) as string | undefined) ?? null,
    servicesWhyItems: (values.get(SETTINGS.SERVICES_WHY_ITEMS) as unknown[] | undefined) ?? [],
    servicesWhyPromiseBadge: (values.get(SETTINGS.SERVICES_WHY_PROMISE_BADGE) as string | undefined) ?? null,
    servicesWhyPromiseQuote: (values.get(SETTINGS.SERVICES_WHY_PROMISE_QUOTE) as string | undefined) ?? null,
    servicesWhyPromiseAuthor: (values.get(SETTINGS.SERVICES_WHY_PROMISE_AUTHOR) as string | undefined) ?? null,
    servicesWhyPromiseSub: (values.get(SETTINGS.SERVICES_WHY_PROMISE_SUB) as string | undefined) ?? null,
    servicesWhyPromiseTags: (values.get(SETTINGS.SERVICES_WHY_PROMISE_TAGS) as string | undefined) ?? null,
    // Services – CTA Section
    servicesCtaTitle: (values.get(SETTINGS.SERVICES_CTA_TITLE) as string | undefined) ?? null,
    servicesCtaBadge: (values.get(SETTINGS.SERVICES_CTA_BADGE) as string | undefined) ?? null,
    servicesCtaDescription: (values.get(SETTINGS.SERVICES_CTA_DESCRIPTION) as string | undefined) ?? null,
    servicesCtaBtn1Text: (values.get(SETTINGS.SERVICES_CTA_BTN1_TEXT) as string | undefined) ?? null,
    servicesCtaBtn1Url: (values.get(SETTINGS.SERVICES_CTA_BTN1_URL) as string | undefined) ?? null,
    servicesCtaBtn2Text: (values.get(SETTINGS.SERVICES_CTA_BTN2_TEXT) as string | undefined) ?? null,
    servicesCtaBtn2Url: (values.get(SETTINGS.SERVICES_CTA_BTN2_URL) as string | undefined) ?? null,
    // Services – What We Do
    servicesWhatTitle: (values.get(SETTINGS.SERVICES_WHAT_TITLE) as string | undefined) ?? null,
    servicesWhatDescription: (values.get(SETTINGS.SERVICES_WHAT_DESCRIPTION) as string | undefined) ?? null,
    servicesWhatFeatures: (values.get(SETTINGS.SERVICES_WHAT_FEATURES) as unknown[] | undefined) ?? [],
    servicesWhatImages: (values.get(SETTINGS.SERVICES_WHAT_IMAGES) as string[] | undefined) ?? [],

    // Home Solutions
    homeSolutionsTitle: (values.get(SETTINGS.HOME_SOLUTIONS_TITLE) as string | undefined) ?? null,
    homeSolutionsBadge: (values.get(SETTINGS.HOME_SOLUTIONS_BADGE) as string | undefined) ?? null,
    homeSolutionsDescription: (values.get(SETTINGS.HOME_SOLUTIONS_DESCRIPTION) as string | undefined) ?? null,
    homeSolutionsItems: (values.get(SETTINGS.HOME_SOLUTIONS_ITEMS) as string[] | undefined) ?? [],

    // Home – Services & Recent Work
    homeServicesTitle: (values.get(SETTINGS.HOME_SERVICES_TITLE) as string | undefined) ?? null,
    homeServicesBadge: (values.get(SETTINGS.HOME_SERVICES_BADGE) as string | undefined) ?? null,
    homeRecentWorkTitle: (values.get(SETTINGS.HOME_RECENT_WORK_TITLE) as string | undefined) ?? null,
    homeRecentWorkBadge: (values.get(SETTINGS.HOME_RECENT_WORK_BADGE) as string | undefined) ?? null,
    homeRecentWorkItems: (values.get(SETTINGS.HOME_RECENT_WORK_ITEMS) as unknown[] | undefined) ?? [],

    // Labs – Initiatives, Rigor, Mentorship
    labs_initiatives: (values.get(SETTINGS.LABS_INITIATIVES) as unknown[] | undefined) ?? [],
    labs_rigor_title: (values.get(SETTINGS.LABS_RIGOR_TITLE) as string | undefined) ?? null,
    labs_rigor_description: (values.get(SETTINGS.LABS_RIGOR_DESCRIPTION) as string | undefined) ?? null,
    labs_rigor_points: (values.get(SETTINGS.LABS_RIGOR_POINTS) as unknown[] | undefined) ?? [],
    labs_rigor_image: (values.get(SETTINGS.LABS_RIGOR_IMAGE) as string | undefined) ?? null,
    labs_mentorship_title: (values.get(SETTINGS.LABS_MENTORSHIP_TITLE) as string | undefined) ?? null,
    labs_mentorship_description: (values.get(SETTINGS.LABS_MENTORSHIP_DESCRIPTION) as string | undefined) ?? null,
    labs_mentorship_image: (values.get(SETTINGS.LABS_MENTORSHIP_IMAGE) as string | undefined) ?? null,
    labs_mentorship_quote: (values.get(SETTINGS.LABS_MENTORSHIP_QUOTE) as string | undefined) ?? null,
    labs_mentorship_quote_author: (values.get(SETTINGS.LABS_MENTORSHIP_QUOTE_AUTHOR) as string | undefined) ?? null,
    labs_mentorship_quote_role: (values.get(SETTINGS.LABS_MENTORSHIP_QUOTE_ROLE) as string | undefined) ?? null,
    labs_mentorship_quote_avatar: (values.get(SETTINGS.LABS_MENTORSHIP_QUOTE_AVATAR) as string | undefined) ?? null,

    // Contact – Hero & Presence
    contactHeroTitle: (values.get(SETTINGS.CONTACT_HERO_TITLE) as string | undefined) ?? null,
    contactHeroDescription: (values.get(SETTINGS.CONTACT_HERO_DESCRIPTION) as string | undefined) ?? null,
    contactGlobalPresenceBadge: (values.get(SETTINGS.CONTACT_GLOBAL_PRESENCE_BADGE) as string | undefined) ?? null,
    contactGlobalPresenceTitle: (values.get(SETTINGS.CONTACT_GLOBAL_PRESENCE_TITLE) as string | undefined) ?? null,

    // Contact – Branch 1
    contactBranch1Title: (values.get(SETTINGS.CONTACT_BRANCH1_TITLE) as string | undefined) ?? null,
    contactBranch1Address: (values.get(SETTINGS.CONTACT_BRANCH1_ADDRESS) as string | undefined) ?? null,
    contactBranch1MapLink: (values.get(SETTINGS.CONTACT_BRANCH1_MAP_LINK) as string | undefined) ?? null,
    contactBranch1LatLong: (values.get(SETTINGS.CONTACT_BRANCH1_LAT_LONG) as string | undefined) ?? null,
    contactBranch1MarkerX: (values.get(SETTINGS.CONTACT_BRANCH1_MARKER_X) as string | number | undefined) ?? null,
    contactBranch1MarkerY: (values.get(SETTINGS.CONTACT_BRANCH1_MARKER_Y) as string | number | undefined) ?? null,

    // Contact – Branch 2
    contactBranch2Title: (values.get(SETTINGS.CONTACT_BRANCH2_TITLE) as string | undefined) ?? null,
    contactBranch2Address: (values.get(SETTINGS.CONTACT_BRANCH2_ADDRESS) as string | undefined) ?? null,
    contactBranch2MapLink: (values.get(SETTINGS.CONTACT_BRANCH2_MAP_LINK) as string | undefined) ?? null,
    contactBranch2LatLong: (values.get(SETTINGS.CONTACT_BRANCH2_LAT_LONG) as string | undefined) ?? null,
    contactBranch2MarkerX: (values.get(SETTINGS.CONTACT_BRANCH2_MARKER_X) as string | number | undefined) ?? null,
    contactBranch2MarkerY: (values.get(SETTINGS.CONTACT_BRANCH2_MARKER_Y) as string | number | undefined) ?? null,

    // Contact – Branch 3
    contactBranch3Title: (values.get(SETTINGS.CONTACT_BRANCH3_TITLE) as string | undefined) ?? null,
    contactBranch3Address: (values.get(SETTINGS.CONTACT_BRANCH3_ADDRESS) as string | undefined) ?? null,
    contactBranch3MapLink: (values.get(SETTINGS.CONTACT_BRANCH3_MAP_LINK) as string | undefined) ?? null,
    contactBranch3LatLong: (values.get(SETTINGS.CONTACT_BRANCH3_LAT_LONG) as string | undefined) ?? null,
    contactBranch3MarkerX: (values.get(SETTINGS.CONTACT_BRANCH3_MARKER_X) as string | number | undefined) ?? null,
    contactBranch3MarkerY: (values.get(SETTINGS.CONTACT_BRANCH3_MARKER_Y) as string | number | undefined) ?? null,

    // Contact – Support Channels
    contactSupportTitle: (values.get(SETTINGS.CONTACT_SUPPORT_TITLE) as string | undefined) ?? null,
    contactSupportDescription: (values.get(SETTINGS.CONTACT_SUPPORT_DESCRIPTION) as string | undefined) ?? null,
    contactSupportItem1Title: (values.get(SETTINGS.CONTACT_SUPPORT_ITEM1_TITLE) as string | undefined) ?? null,
    contactSupportItem1Desc: (values.get(SETTINGS.CONTACT_SUPPORT_ITEM1_DESC) as string | undefined) ?? null,
    contactSupportItem1Link: (values.get(SETTINGS.CONTACT_SUPPORT_ITEM1_LINK) as string | undefined) ?? null,
    contactSupportItem2Title: (values.get(SETTINGS.CONTACT_SUPPORT_ITEM2_TITLE) as string | undefined) ?? null,
    contactSupportItem2Desc: (values.get(SETTINGS.CONTACT_SUPPORT_ITEM2_DESC) as string | undefined) ?? null,
    contactSupportItem2Link: (values.get(SETTINGS.CONTACT_SUPPORT_ITEM2_LINK) as string | undefined) ?? null,
    contactSupportItem3Title: (values.get(SETTINGS.CONTACT_SUPPORT_ITEM3_TITLE) as string | undefined) ?? null,
    contactSupportItem3Desc: (values.get(SETTINGS.CONTACT_SUPPORT_ITEM3_DESC) as string | undefined) ?? null,
    contactSupportItem3Status: (values.get(SETTINGS.CONTACT_SUPPORT_ITEM3_STATUS) as string | undefined) ?? null,

    // Contact – FAQs
    contactFaqTitle: (values.get(SETTINGS.CONTACT_FAQ_TITLE) as string | undefined) ?? null,
    contactFaqDescription: (values.get(SETTINGS.CONTACT_FAQ_DESCRIPTION) as string | undefined) ?? null,
    contactFaq1Question: (values.get(SETTINGS.CONTACT_FAQ1_QUESTION) as string | undefined) ?? null,
    contactFaq1Answer: (values.get(SETTINGS.CONTACT_FAQ1_ANSWER) as string | undefined) ?? null,
    contactFaq2Question: (values.get(SETTINGS.CONTACT_FAQ2_QUESTION) as string | undefined) ?? null,
    contactFaq2Answer: (values.get(SETTINGS.CONTACT_FAQ2_ANSWER) as string | undefined) ?? null,
    contactFaq3Question: (values.get(SETTINGS.CONTACT_FAQ3_QUESTION) as string | undefined) ?? null,
    contactFaq3Answer: (values.get(SETTINGS.CONTACT_FAQ3_ANSWER) as string | undefined) ?? null,

    // Home Video
    homeVideoUrl: (values.get(SETTINGS.HOME_VIDEO_URL) as string | undefined) ?? null,
    homeVideoEnabled: values.get(SETTINGS.HOME_VIDEO_ENABLED) === "true" || values.get(SETTINGS.HOME_VIDEO_ENABLED) === true,

    // Contact – Dynamic Branches List
    contactBranches: (values.get(SETTINGS.CONTACT_BRANCHES) as unknown[] | undefined) ?? [],

    // About Page
    aboutWhoTitle: (values.get(SETTINGS.ABOUT_WHO_TITLE) as string | undefined) ?? null,
    aboutWhoDescription: (values.get(SETTINGS.ABOUT_WHO_DESCRIPTION) as string | undefined) ?? null,
    aboutWhoSecondaryDescription: (values.get(SETTINGS.ABOUT_WHO_SECONDARY_DESCRIPTION) as string | undefined) ?? null,
    aboutWhoFeatures: (values.get(SETTINGS.ABOUT_WHO_FEATURES) as unknown[] | undefined) ?? [],
    aboutWhoImages: (values.get(SETTINGS.ABOUT_WHO_IMAGES) as string[] | undefined) ?? [],
    aboutProcessBadge: (values.get(SETTINGS.ABOUT_PROCESS_BADGE) as string | undefined) ?? null,
    aboutProcessTitle: (values.get(SETTINGS.ABOUT_PROCESS_TITLE) as string | undefined) ?? null,
    aboutProcessFeatures: (values.get(SETTINGS.ABOUT_PROCESS_FEATURES) as unknown[] | undefined) ?? [],
    aboutProcessImage: (values.get(SETTINGS.ABOUT_PROCESS_IMAGE) as string | undefined) ?? null,
    aboutMissionTitle: (values.get(SETTINGS.ABOUT_MISSION_TITLE) as string | undefined) ?? null,
    aboutMissionDesc: (values.get(SETTINGS.ABOUT_MISSION_DESC) as string | undefined) ?? null,
    aboutVisionTitle: (values.get(SETTINGS.ABOUT_VISION_TITLE) as string | undefined) ?? null,
    aboutVisionDesc: (values.get(SETTINGS.ABOUT_VISION_DESC) as string | undefined) ?? null,
    aboutMissionCards: (values.get(SETTINGS.ABOUT_MISSION_CARDS) as unknown[] | undefined) ?? [],
    aboutContactBadge: (values.get(SETTINGS.ABOUT_CONTACT_BADGE) as string | undefined) ?? null,
    aboutContactTitle: (values.get(SETTINGS.ABOUT_CONTACT_TITLE) as string | undefined) ?? null,
    aboutContactImage: (values.get(SETTINGS.ABOUT_CONTACT_IMAGE) as string | undefined) ?? null,

    updatedAt:
      settings
        .map((item) => item.updatedAt)
        .sort((a, b) => b.getTime() - a.getTime())[0] ?? null,
  };

  } catch (err) {
    console.error('Public service: failed to fetch site config from DB, returning fallback.', err);

    // Return safe fallback configuration so clients can render consistently
    return {
      maintenanceMode: false,
      maintenanceMessage: null,
      maintenanceEndTime: null,
      whatsappNumber: null,

      // Internship
      internshipHeroTitle: null,
      internshipHeroSubtitle: null,
      internshipHeroDescription: null,
      internshipHeroImageUrl: null,
      internshipIntroTitle: null,
      internshipIntroDescription: null,
      internshipApproachTitle: null,
      internshipApproachDescription: null,
      internshipCardOneValue: null,
      internshipCardOneTitle: null,
      internshipCardOneDescription: null,
      internshipCardTwoValue: null,
      internshipCardTwoTitle: null,
      internshipCardTwoDescription: null,
      internshipCardThreeValue: null,
      internshipCardThreeTitle: null,
      internshipCardThreeDescription: null,
      internshipGalleryTitle: null,
      internshipGalleryImageUrls: [],
      internshipTestimonialsTitle: null,
      internshipClosingTitle: null,
      internshipClosingContent: null,
      internshipApplyEmail: null,

      // Labs
      labs_hero_title: null,
      labs_hero_subtitle: null,
      labs_hero_description: null,
      labs_hero_image_url: null,
      labs_hero_btn1_text: null,
      labs_hero_btn2_text: null,

      // Services (minimal)
      servicesHeroTitle: null,
      servicesHeroGradient: null,
      servicesHeroBadge: null,
      servicesHeroDescription: null,
      servicesHeroBtn1Text: null,
      servicesHeroBtn1Url: null,
      servicesHeroBtn2Text: null,
      servicesHeroBtn2Url: null,

      servicesProcessSteps: [],
      servicesWhyItems: [],
      servicesWhatFeatures: [],
      servicesWhatImages: [],

      // Home
      homeSolutionsTitle: null,
      homeSolutionsBadge: null,
      homeSolutionsDescription: null,
      homeSolutionsItems: [],
      homeServicesTitle: null,
      homeServicesBadge: null,
      homeRecentWorkTitle: null,
      homeRecentWorkBadge: null,
      homeRecentWorkItems: [],

      // Labs
      labs_initiatives: [],
      labs_rigor_title: null,
      labs_rigor_description: null,
      labs_rigor_points: [],
      labs_rigor_image: null,
      labs_mentorship_title: null,
      labs_mentorship_description: null,
      labs_mentorship_image: null,
      labs_mentorship_quote: null,
      labs_mentorship_quote_author: null,
      labs_mentorship_quote_role: null,
      labs_mentorship_quote_avatar: null,

      // Contact
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

      homeVideoUrl: null,
      homeVideoEnabled: false,
      contactBranches: [],

      // About minimal
      aboutWhoTitle: null,
      aboutWhoDescription: null,
      aboutWhoSecondaryDescription: null,
      aboutWhoFeatures: [],
      aboutWhoImages: [],

      updatedAt: null,
    };
  }
};
