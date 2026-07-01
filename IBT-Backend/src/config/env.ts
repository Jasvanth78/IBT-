import dotenv from "dotenv";

dotenv.config();

export const env = {
    PORT: process.env.PORT || 5000,
    DATABASE_URL: process.env.DATABASE_URL as string,
    JWT_SECRET: process.env.JWT_SECRET as string,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN as string,
    MAIL_HOST: process.env.MAIL_HOST as string,
    MAIL_PORT: Number(process.env.MAIL_PORT),
    MAIL_USER: process.env.MAIL_USER as string,
    MAIL_PASS: process.env.MAIL_PASS || process.env.EMAIL_PASSWORD as string,
    MAIL_FROM: process.env.MAIL_FROM as string,
    BACKEND_BASE_URL: process.env.BACKEND_BASE_URL as string | undefined,
    UPLOAD_DIR: process.env.UPLOAD_DIR || "uploads",
    UPLOAD_MAX_FILE_SIZE: Number(process.env.UPLOAD_MAX_FILE_SIZE || 5 * 1024 * 1024),
    IMPORT_MAX_FILE_SIZE: Number(process.env.IMPORT_MAX_FILE_SIZE || 10 * 1024 * 1024),
    // Cloudinary Config
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME?.trim() || "",
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY?.trim() || "",
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET?.trim() || "",
};