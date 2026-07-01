import { Router } from "express";
import { Role } from "../../generated/prisma/client";
import * as controller from "../controllers/blog.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";
import { validate } from "../middlewares/validate.middleware";
import { documentUpload } from "../middlewares/documentUpload.middleware";
import {
  createBlogSchema,
  updateBlogSchema,
} from "../validators/blog.validator";

const router = Router();
const cmsEditors = [Role.ADMIN, Role.MANAGER] as const;

router.get("/", controller.getAllBlogs);
router.get("/slug/:slug", controller.getBlogBySlug);

router.post(
  "/",
  authenticate,
  authorize(...cmsEditors),
  validate(createBlogSchema),
  controller.createBlog
);

router.post(
  "/import-document",
  authenticate,
  authorize(...cmsEditors),
  documentUpload.single("file"),
  controller.importDocument
);

router.patch(
  "/:blogId",
  authenticate,
  authorize(...cmsEditors),
  validate(updateBlogSchema),
  controller.updateBlog
);

router.delete(
  "/:blogId",
  authenticate,
  authorize(...cmsEditors),
  controller.deleteBlog
);

export default router;
