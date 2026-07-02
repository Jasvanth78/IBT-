import { BlogStatus } from "../../generated/prisma/client";
import { z } from "zod";

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const parseBoolean = (value: unknown) => {
  if (value === undefined) return undefined;
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    const normalized = value.toLowerCase();
    if (normalized === "true") return true;
    if (normalized === "false") return false;
  }

  return value;
};

const parseDate = (value: unknown) => {
  if (value === undefined || value === "") return undefined;
  if (value instanceof Date) return value;

  if (typeof value === "string" || typeof value === "number") {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? value : parsed;
  }

  return value;
};

const parseNullableDate = (value: unknown) => {
  if (value === null) return null;
  return parseDate(value);
};

const blogSlugSchema = z
  .string("Blog slug is required")
  .min(2, "Blog slug must be at least 2 characters long")
  .max(160, "Blog slug must be at most 160 characters long")
  .regex(
    slugRegex,
    "Blog slug must use lowercase letters, numbers, and hyphens only"
  );

const blogTitleSchema = z
  .string("Blog title is required")
  .min(1, "Blog title is required")
  .max(220, "Blog title must be at most 220 characters long");

const blogCategorySchema = z
  .string("Blog category must be a string")
  .trim()
  .min(1, "Blog category cannot be empty")
  .max(80, "Blog category must be at most 80 characters long");

const blogImageUrlSchema = z
  .string("Blog image URL must be a string")
  .trim()
  .min(1, "Blog image URL cannot be empty")
  .max(500, "Blog image URL must be at most 500 characters long");

const blogContentSchema = z
  .string("Blog content is required")
  .min(1, "Blog content is required")
  .max(5000000, "Blog content must be at most 5000000 characters long");

const validatePublishRules = (
  data: {
    status?: BlogStatus;
    featured?: boolean;
    publishedAt?: Date | null;
  },
  ctx: z.RefinementCtx
) => {
  const status = data.status;

  if (data.featured === true && status !== undefined && status !== BlogStatus.PUBLISHED) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["featured"],
      message: "Featured can be true only when status is PUBLISHED",
    });
  }

  if (
    status !== undefined &&
    status !== BlogStatus.PUBLISHED &&
    data.publishedAt !== undefined &&
    data.publishedAt !== null
  ) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["publishedAt"],
      message: "publishedAt is allowed only when status is PUBLISHED",
    });
  }

};

export const createBlogSchema = z
  .object({
    title: blogTitleSchema,
    slug: blogSlugSchema,
    content: blogContentSchema,
    imageUrl: blogImageUrlSchema.optional(),
    status: z.nativeEnum(BlogStatus).optional(),
    featured: z.boolean("Featured must be a boolean").optional(),
    category: blogCategorySchema.optional(),
    publishedAt: z.preprocess(parseDate, z.date().optional()),
    quickTips: z.array(z.string()).optional(),
  })
  .superRefine(validatePublishRules);

export const updateBlogSchema = z
  .object({
    title: blogTitleSchema.optional(),
    slug: blogSlugSchema.optional(),
    content: blogContentSchema.optional(),
    imageUrl: blogImageUrlSchema.optional(),
    status: z.nativeEnum(BlogStatus).optional(),
    featured: z.boolean("Featured must be a boolean").optional(),
    category: blogCategorySchema.optional(),
    publishedAt: z.preprocess(parseNullableDate, z.date().nullable().optional()),
    quickTips: z.array(z.string()).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
  })
  .superRefine(validatePublishRules);

export const blogIdParamSchema = z.object({
  blogId: z.string().uuid("Invalid blogId format"),
});

export const blogSlugParamSchema = z.object({
  slug: blogSlugSchema,
});

export const listBlogQuerySchema = z
  .object({
    search: z.string().trim().min(1).max(150).optional(),
    category: blogCategorySchema.optional(),
    status: z.nativeEnum(BlogStatus).optional(),
    featured: z.preprocess(parseBoolean, z.boolean().optional()),
    page: z.coerce.number().int().min(1).optional(),
    limit: z.coerce.number().int().min(1).max(100).optional(),
  })
  .refine((data) => (data.page === undefined) === (data.limit === undefined), {
    message: "Both page and limit are required for pagination",
  });
