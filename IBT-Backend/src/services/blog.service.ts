import { AuditAction, BlogStatus } from "../../generated/prisma/client";
import { prisma } from "../lib/prisma";
import { httpError } from "../utils/httpError";
import { logAction } from "../utils/logAction";
import sanitizeHtml from "sanitize-html";
import { parseDocx, parsePdf } from "../utils/documentParser";

type CreateBlogInput = {
  title: string;
  slug: string;
  content: string;
  imageUrl?: string;
  status?: BlogStatus;
  featured?: boolean;
  category?: string;
  publishedAt?: Date;
};

type UpdateBlogInput = Partial<{
  title: string;
  slug: string;
  content: string;
  imageUrl: string;
  status: BlogStatus;
  featured: boolean;
  category: string;
  publishedAt: Date | null;
}>;

type ListBlogFilters = {
  search?: string;
  category?: string;
  status?: BlogStatus;
  featured?: boolean;
  page?: number;
  limit?: number;
};

const normalizeOptional = (value?: string) => value?.trim() || undefined;
const normalizeCategory = (value?: string) => value?.trim().toLowerCase() || undefined;

const mapKnownPrismaError = (error: unknown): Error => {
  const err = error as { code?: string; meta?: { target?: string[] } };

  if (err?.code === "P2002") {
    const target = err.meta?.target?.join(", ") || "slug";
    return httpError(409, `Blog already exists for unique field: ${target}`);
  }

  return error instanceof Error ? error : new Error("Unexpected database error");
};

const ensureBlogExists = async (blogId: string) => {
  const blog = await prisma.blog.findUnique({ where: { id: blogId } });

  if (!blog) {
    throw httpError(404, "Blog not found");
  }

  return blog;
};

const resolvePublishedAtOnCreate = (
  status: BlogStatus,
  publishedAt?: Date
): Date | null => {
  if (status !== BlogStatus.PUBLISHED) {
    if (publishedAt !== undefined) {
      throw httpError(400, "publishedAt is allowed only when status is PUBLISHED");
    }

    return null;
  }

  return publishedAt ?? new Date();
};

const resolvePublishedAtOnUpdate = (
  nextStatus: BlogStatus,
  existingStatus: BlogStatus,
  existingPublishedAt: Date | null,
  incomingPublishedAt: Date | null | undefined
): Date | null => {
  if (nextStatus !== BlogStatus.PUBLISHED) {
    if (incomingPublishedAt !== undefined && incomingPublishedAt !== null) {
      throw httpError(400, "publishedAt is allowed only when status is PUBLISHED");
    }

    return null;
  }

  const resolved =
    incomingPublishedAt !== undefined
      ? incomingPublishedAt
      : existingStatus === BlogStatus.PUBLISHED
      ? existingPublishedAt
      : new Date();

  if (resolved === null) {
    return existingStatus === BlogStatus.PUBLISHED ? existingPublishedAt : new Date();
  }

  return resolved;
};

const assertFeaturedRule = (featured: boolean, status: BlogStatus) => {
  if (featured && status !== BlogStatus.PUBLISHED) {
    throw httpError(400, "Featured can be true only when status is PUBLISHED");
  }
};

export const createBlog = async (input: CreateBlogInput, userId?: string) => {
  const status = input.status ?? BlogStatus.DRAFT;
  const featured = input.featured ?? false;

  assertFeaturedRule(featured, status);

  const publishedAt = resolvePublishedAtOnCreate(status, input.publishedAt);

  try {
    const created = await prisma.blog.create({
      data: {
        title: input.title,
        slug: input.slug,
        content: input.content,
        imageUrl: normalizeOptional(input.imageUrl),
        status,
        featured,
        category: normalizeCategory(input.category),
        publishedAt,
      },
    });

    await logAction({
      userId,
      action: AuditAction.CREATE,
      entity: "Blog",
      entityId: created.id,
      newData: {
        id: created.id,
        slug: created.slug,
        title: created.title,
        status: created.status,
        featured: created.featured,
        category: created.category,
      },
    });

    return created;
  } catch (error) {
    throw mapKnownPrismaError(error);
  }
};

export const getAllBlogs = async (filters: ListBlogFilters) => {
  const shouldPaginate = filters.page !== undefined && filters.limit !== undefined;
  const skip = shouldPaginate ? (filters.page! - 1) * filters.limit! : undefined;
  const take = shouldPaginate ? filters.limit : undefined;

  const where = {
    status: filters.status,
    featured: filters.featured,
    category: filters.category ? normalizeCategory(filters.category) : undefined,
    OR: filters.search
      ? [
          { title: { contains: filters.search, mode: "insensitive" as const } },
          { content: { contains: filters.search, mode: "insensitive" as const } },
          { category: { contains: filters.search, mode: "insensitive" as const } },
        ]
      : undefined,
  };

  const orderBy = [{ publishedAt: "desc" as const }, { createdAt: "desc" as const }];

  if (!shouldPaginate) {
    return prisma.blog.findMany({
      where,
      orderBy,
    });
  }

  const [items, total] = await Promise.all([
    prisma.blog.findMany({
      where,
      orderBy,
      skip,
      take,
    }),
    prisma.blog.count({ where }),
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

export const getBlogBySlug = async (slug: string) => {
  const blog = await prisma.blog.findUnique({ where: { slug } });

  if (!blog) {
    throw httpError(404, "Blog not found");
  }

  return blog;
};

export const updateBlog = async (
  blogId: string,
  input: UpdateBlogInput,
  userId?: string
) => {
  const existing = await ensureBlogExists(blogId);

  const nextStatus = input.status ?? existing.status;
  const nextFeatured = input.featured ?? existing.featured;

  assertFeaturedRule(nextFeatured, nextStatus);

  const nextPublishedAt = resolvePublishedAtOnUpdate(
    nextStatus,
    existing.status,
    existing.publishedAt,
    input.publishedAt
  );

  try {
    const updated = await prisma.blog.update({
      where: { id: blogId },
      data: {
        title: input.title,
        slug: input.slug,
        content: input.content,
        imageUrl: input.imageUrl !== undefined ? normalizeOptional(input.imageUrl) : undefined,
        status: input.status,
        featured: input.featured,
        category: input.category !== undefined ? normalizeCategory(input.category) : undefined,
        publishedAt: nextPublishedAt,
      },
    });

    await logAction({
      userId,
      action: AuditAction.UPDATE,
      entity: "Blog",
      entityId: updated.id,
      oldData: {
        id: existing.id,
        slug: existing.slug,
        title: existing.title,
        status: existing.status,
        featured: existing.featured,
        category: existing.category,
      },
      newData: {
        id: updated.id,
        slug: updated.slug,
        title: updated.title,
        status: updated.status,
        featured: updated.featured,
        category: updated.category,
      },
    });

    return updated;
  } catch (error) {
    throw mapKnownPrismaError(error);
  }
};

export const deleteBlog = async (blogId: string, userId?: string) => {
  const existing = await ensureBlogExists(blogId);

  await prisma.blog.delete({ where: { id: blogId } });

  await logAction({
    userId,
    action: AuditAction.DELETE,
    entity: "Blog",
    entityId: existing.id,
    oldData: {
      id: existing.id,
      slug: existing.slug,
      title: existing.title,
      status: existing.status,
      featured: existing.featured,
      category: existing.category,
    },
  });

  return { success: true };
};

export const importDocument = async (
  file: Express.Multer.File
): Promise<{ success: boolean; html: string; warnings: string[] }> => {
  const extension = file.originalname.slice(file.originalname.lastIndexOf(".")).toLowerCase();
  
  let parsed: { html: string; warnings: string[] };
  
  if (extension === ".docx") {
    parsed = await parseDocx(file.buffer);
  } else if (extension === ".pdf") {
    parsed = await parsePdf(file.buffer);
  } else {
    throw httpError(400, "Only .docx and .pdf files are supported.");
  }
  
  const cleanHtml = sanitizeHtml(parsed.html, {
    allowedTags: [
      "h1", "h2", "h3", "h4", "h5", "h6", "blockquote", "p", "a", "ul", "ol",
      "nl", "li", "b", "i", "strong", "em", "strike", "code", "hr", "br", "div",
      "table", "thead", "caption", "tbody", "tr", "th", "td", "pre", "iframe", "img", "u"
    ],
    allowedAttributes: {
      a: ["href", "name", "target", "title"],
      img: ["src", "alt", "title", "width", "height", "style"],
      table: ["style"],
      td: ["style"],
      th: ["style"],
      div: ["style"],
      p: ["style"],
    },
    allowedStyles: {
      "*": {
        "text-align": [/^left$/, /^right$/, /^center$/, /^justify$/],
        "font-size": [/^\d+(px|em|rem|pt|%)?$/],
        "font-weight": [/^(bold|normal|\d+)$/],
        "margin": [/^\d+(px|em|rem|pt|%)?$/],
        "margin-bottom": [/^\d+(px|em|rem|pt|%)?$/],
        "margin-top": [/^\d+(px|em|rem|pt|%)?$/],
        "padding": [/^\d+(px|em|rem|pt|%)?$/],
        "width": [/^\d+(px|em|rem|pt|%)?$/],
        "height": [/^\d+(px|em|rem|pt|%)?$/],
        "max-width": [/^\d+(px|em|rem|pt|%)?$/],
        "border-collapse": [/^collapse$/],
        "border": [/^\d+px\s+solid\s+.*$/],
        "vertical-align": [/^(top|middle|bottom)$/],
      }
    },
    selfClosing: ["img", "br", "hr", "area", "base", "basefont", "input", "link", "meta"],
  });
  
  return {
    success: true,
    html: cleanHtml,
    warnings: parsed.warnings,
  };
};
