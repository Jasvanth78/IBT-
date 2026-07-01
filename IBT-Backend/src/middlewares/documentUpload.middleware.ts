import multer from "multer";
import { env } from "../config/env";
import { httpError } from "../utils/httpError";

const allowedMimeTypes = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword" // .doc for completeness
]);

const allowedExtensions = new Set([".pdf", ".docx"]);

const fileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
  const fileExt = file.originalname.slice(file.originalname.lastIndexOf(".")).toLowerCase();
  
  if (!allowedMimeTypes.has(file.mimetype) && !allowedExtensions.has(fileExt)) {
    cb(
      httpError(
        400,
        "Unsupported file type. Only PDF and DOCX files are allowed."
      )
    );
    return;
  }

  cb(null, true);
};

export const documentUpload = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: {
    fileSize: env.IMPORT_MAX_FILE_SIZE,
  },
});
