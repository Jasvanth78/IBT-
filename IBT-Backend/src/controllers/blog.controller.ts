import { Request, Response } from "express";
import { ZodSchema } from "zod";
import { AuthRequest } from "../middlewares/auth.middleware";
import { asyncHandler } from "../utils/asyncHandler";
import { successResponse } from "../utils/apiResponse";
import { httpError } from "../utils/httpError";
import * as blogService from "../services/blog.service";
import {
  blogIdParamSchema,
  blogSlugParamSchema,
  listBlogQuerySchema,
} from "../validators/blog.validator";

const parseOrThrow = <T>(schema: ZodSchema<T>, data: unknown): T => {
  const parsed = schema.safeParse(data);

  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    throw httpError(400, firstIssue?.message || "Invalid request payload");
  }

  return parsed.data;
};

export const createBlog = asyncHandler(async (req: AuthRequest, res: Response) => {
  const blog = await blogService.createBlog(req.body, req.user?.sub);

  res.status(201).json(successResponse(blog, "Blog created"));
});

export const getAllBlogs = asyncHandler(async (req: Request, res: Response) => {
  const query = parseOrThrow(listBlogQuerySchema, req.query);
  const result = await blogService.getAllBlogs(query);

  if (Array.isArray(result)) {
    return res.json(successResponse(result));
  }

  res.json(successResponse(result.items, "Success", result.meta));
});

export const getBlogBySlug = asyncHandler(async (req: Request, res: Response) => {
  const { slug } = parseOrThrow(blogSlugParamSchema, req.params);
  const blog = await blogService.getBlogBySlug(slug);

  res.json(successResponse(blog));
});

export const updateBlog = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { blogId } = parseOrThrow(blogIdParamSchema, req.params);
  const blog = await blogService.updateBlog(blogId, req.body, req.user?.sub);

  res.json(successResponse(blog, "Blog updated"));
});

export const deleteBlog = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { blogId } = parseOrThrow(blogIdParamSchema, req.params);
  const result = await blogService.deleteBlog(blogId, req.user?.sub);

  res.json(successResponse(result, "Blog deleted"));
});

export const importDocument = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.file) {
    throw httpError(400, "File is required");
  }
  const result = await blogService.importDocument(req.file);
  res.status(200).json(successResponse(result, "Document imported successfully"));
});

