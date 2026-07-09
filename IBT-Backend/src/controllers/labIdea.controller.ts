import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { successResponse } from "../utils/apiResponse";
import { httpError } from "../utils/httpError";
import { prisma } from "../lib/prisma";
import { buildUploadRelativePath, buildUploadAbsoluteUrl } from "../middlewares/multer.middleware";
import { env } from "../config/env";
import { SETTINGS } from "../types/settings";
import { createLabIdeaSchema, updateLabIdeaStatusSchema, listLabIdeasQuerySchema } from "../validators/labIdea.validator";
import { sendAdminLabIdeaNotification, sendUserLabIdeaAutoReply } from "../utils/mailer";

export const submitLabIdea = asyncHandler(async (req: Request, res: Response) => {
  // Parse body, but need to handle privacyAccepted which might come as string from FormData
  const rawData = { ...req.body };
  
  const data = createLabIdeaSchema.parse(rawData);

  const attachments: string[] = [];
  if (req.files && Array.isArray(req.files)) {
    for (const file of req.files) {
      if (env.CLOUDINARY_CLOUD_NAME) {
        attachments.push(file.path);
      } else {
        const relativePath = buildUploadRelativePath("labideas", file.filename);
        attachments.push(buildUploadAbsoluteUrl(req, relativePath));
      }
    }
  }

  const labIdea = await prisma.labIdeaSubmission.create({
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      category: data.category,
      ideaTitle: data.ideaTitle,
      description: data.description,
      attachments,
      privacyAccepted: data.privacyAccepted,
    },
  });

  // Notify Admin & User (non-blocking background task)
  (async () => {
    // 1. Notify Admin
    try {
      const adminEmailSetting = await prisma.setting.findUnique({
        where: { key: SETTINGS.ADMIN_NOTIFICATION_EMAIL }
      });
      
      // Fallback order: DB Setting -> MAIL_USER from .env
      const adminEmailRaw = (adminEmailSetting?.value as string) || env.MAIL_USER;
      
      if (adminEmailRaw) {
        const adminEmails = adminEmailRaw.split(',').map(e => e.trim()).filter(e => e);

        await Promise.all(adminEmails.map(email => 
          sendAdminLabIdeaNotification({
            adminEmail: email,
            firstName: labIdea.firstName,
            lastName: labIdea.lastName,
            email: labIdea.email,
            category: labIdea.category,
            ideaTitle: labIdea.ideaTitle,
            description: labIdea.description,
            attachments: attachments,
          }).catch(err => console.error(`Failed to send admin notification to ${email}:`, err))
        ));
      }
    } catch (error) {
      console.error("Failed to send admin notification:", error);
    }

    // 2. Send User Auto-Reply (Thank You Email)
    try {
      await sendUserLabIdeaAutoReply({
        userEmail: labIdea.email,
        userName: labIdea.firstName,
        ideaTitle: labIdea.ideaTitle,
      });
    } catch (error) {
      console.error(`Failed to send user auto-reply to ${labIdea.email}:`, error);
    }
  })();

  res.status(201).json(successResponse(labIdea, "Lab Idea submitted successfully"));
});

export const getAllLabIdeas = asyncHandler(async (req: Request, res: Response) => {
  const query = listLabIdeasQuerySchema.parse(req.query);

  const where: any = {};
  if (query.search) {
    where.OR = [
      { firstName: { contains: query.search, mode: "insensitive" } },
      { lastName: { contains: query.search, mode: "insensitive" } },
      { email: { contains: query.search, mode: "insensitive" } },
      { ideaTitle: { contains: query.search, mode: "insensitive" } },
    ];
  }

  if (query.status) {
    where.status = query.status;
  }
  
  if (query.category) {
    where.category = query.category;
  }

  const page = query.page || 1;
  const limit = query.limit || 10;
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    prisma.labIdeaSubmission.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.labIdeaSubmission.count({ where }),
  ]);

  res.json(successResponse({
    items,
    meta: {
      page,
      limit,
      totalItems: total,
      totalPages: Math.ceil(total / limit),
    }
  }, "Lab Ideas retrieved successfully"));
});

export const updateLabIdeaStatus = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const { status } = updateLabIdeaStatusSchema.parse(req.body);

  const labIdea = await prisma.labIdeaSubmission.update({
    where: { id },
    data: { status },
  });

  res.json(successResponse(labIdea, "Lab Idea status updated successfully"));
});

export const deleteLabIdea = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;

  await prisma.labIdeaSubmission.delete({
    where: { id },
  });

  res.json(successResponse(null, "Lab Idea deleted successfully"));
});
