import { Request, Response } from "express";
import fs from "node:fs";
import path from "node:path";
import { asyncHandler } from "../utils/asyncHandler";
import { successResponse } from "../utils/apiResponse";
import { httpError } from "../utils/httpError";
import { prisma } from "../lib/prisma";
import { sendOTPEmail, sendAdminInternshipNotification, sendUserInternshipAutoReply } from "../utils/mailer";
import { z } from "zod";
import { buildUploadRelativePath, buildUploadAbsoluteUrl } from "../middlewares/multer.middleware";
import { env } from "../config/env";
import { SETTINGS } from "../types/settings";

const otpSchema = z.object({
  email: z.string().email().toLowerCase(),
});

const applicationSchema = z.object({
  name: z.string().min(2),
  email: z.string().email().toLowerCase(),
  phone: z.string().min(10),
  about: z.string().min(2),
  skills: z.string().min(2),
  jobType: z.string().min(2),
  applicationType: z.string().toUpperCase(),
  otp: z.string().length(6),
});

export const requestOTP = asyncHandler(async (req: Request, res: Response) => {
  const { email } = otpSchema.parse(req.body);

  // Generate 6 digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  // Upsert OTP
  await prisma.oneTimePassword.create({
    data: {
      email,
      otp,
      expiresAt,
    },
  });

  await sendOTPEmail(email, otp);

  res.json(successResponse(null, "OTP sent to your email"));
});

export const submitApplication = asyncHandler(async (req: Request, res: Response) => {
  const data = applicationSchema.parse(req.body);

  // Verify OTP
  const otpRecord = await prisma.oneTimePassword.findFirst({
    where: {
      email: data.email,
      otp: data.otp,
      expiresAt: {
        gt: new Date(),
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  if (!otpRecord) {
    throw httpError(400, "Invalid or expired OTP");
  }

  let resumeUrl: string | undefined = undefined;
  if (req.file) {
    const allowedMimeTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    const extension = path.extname(req.file.originalname).toLowerCase();
    const allowedExtensions = [".pdf", ".doc", ".docx"];

    if (!allowedMimeTypes.includes(req.file.mimetype) || !allowedExtensions.includes(extension)) {
      if (!env.CLOUDINARY_CLOUD_NAME && req.file.path) {
        try {
          fs.unlinkSync(req.file.path);
        } catch (unlinkError) {
          console.error("Failed to delete invalid resume file:", unlinkError);
        }
      }
      throw httpError(400, "Only document files (PDF, DOC, DOCX) are allowed for resumes.");
    }

    if (env.CLOUDINARY_CLOUD_NAME) {
      resumeUrl = req.file.path;
    } else {
      const category = (req.params.category || "internship").toString().toLowerCase();
      const relativePath = buildUploadRelativePath(category, req.file.filename);
      resumeUrl = buildUploadAbsoluteUrl(req, relativePath);
    }
  }

  // Save Application
  const application = await prisma.internshipApplication.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      about: data.about,
      skills: data.skills,
      jobType: data.jobType,
      applicationType: data.applicationType,
      resumeUrl,
    },
  });

  // Delete all OTPs for this email after successful verification
  await prisma.oneTimePassword.deleteMany({
    where: {
      email: data.email,
    },
  });

  // Notify Admin & User (non-blocking background task)
  (async () => {
    // 1. Notify Admin
    try {
      const adminEmailSetting = await prisma.setting.findUnique({
        where: { key: SETTINGS.ADMIN_NOTIFICATION_EMAIL }
      });
      
      // Fallback order: DB Setting -> MAIL_USER from .env (mailtojasvanth88@gmail.com)
      const adminEmailRaw = (adminEmailSetting?.value as string) || env.MAIL_USER;
      
      console.log("Attempting to notify admin:", adminEmailRaw);
      
      if (adminEmailRaw) {
        const adminEmails = adminEmailRaw.split(',').map(e => e.trim()).filter(e => e);

        await Promise.all(adminEmails.map(email => 
          sendAdminInternshipNotification({
            adminEmail: email,
            name: application.name,
            email: application.email,
            phone: application.phone,
            jobType: application.jobType,
            applicationType: application.applicationType,
            about: application.about,
            skills: application.skills,
            resumeUrl: application.resumeUrl,
          }).catch(err => console.error(`Failed to send admin notification to ${email}:`, err))
        ));
      } else {
        console.error("No admin email found in settings or ENV!");
      }
    } catch (error) {
      console.error("Failed to send admin notification:", error);
    }

    // 2. Send User Auto-Reply (Thank You Email)
    try {
      await sendUserInternshipAutoReply({
        userEmail: application.email,
        userName: application.name,
        applicationType: application.applicationType,
      });
    } catch (error) {
      console.error(`Failed to send user auto-reply to ${application.email}:`, error);
    }
  })();

  res.status(201).json(successResponse(application, "Application submitted successfully"));
});

export const getAllApplications = asyncHandler(async (req: Request, res: Response) => {
  const applications = await prisma.internshipApplication.findMany({
    orderBy: { createdAt: 'desc' },
  });
  res.json(successResponse(applications, "Applications retrieved successfully"));
});

export const updateApplicationStatus = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const { status } = req.body;

  if (!status) {
    throw httpError(400, "Status is required");
  }

  const application = await prisma.internshipApplication.update({
    where: { id: id as string },
    data: { status },
  });

  res.json(successResponse(application, "Application status updated successfully"));
});

export const deleteApplication = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;

  await prisma.internshipApplication.delete({
    where: { id },
  });

  res.json(successResponse(null, "Application deleted successfully"));
});
