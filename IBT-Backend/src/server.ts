import { env } from "./config/env";
import express from "express";
import cors from "cors";
import path from "node:path";
import { errorMiddleware } from "./middlewares/error.middleware";
import { createAppServer, initSocketServer } from "./realtime/socket";

// Routes
import authRoutes from "./routes/auth.routes";
import settingRoutes from "./routes/setting.routes";
import serviceRoutes from "./routes/service.routes";
import statRoutes from "./routes/stat.routes";
import testimonialRoutes from "./routes/testimonial.routes";
import partnerRoutes from "./routes/partner.routes";
import partnerCollegeRoutes from "./routes/partnerCollege.routes";
import clientRoutes from "./routes/client.routes";
import memberRoutes from "./routes/member.routes";
import branchRoutes from "./routes/branch.routes";
import labProjectRoutes from "./routes/labproject.routes";
import blogRoutes from "./routes/blog.routes";
import contactRoutes from "./routes/contact.routes";
import internshipRoutes from "./routes/internship.routes";
import socialLinkRoutes from "./routes/sociallink.routes";
import termsRoutes from "./routes/terms.routes";
import auditLogRoutes from "./routes/auditlog.routes";
import uploadRoutes from "./routes/upload.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import publicRoutes from "./routes/public.routes";
import labideaRoutes from "./routes/labidea.routes";

const app = express();

app.set("trust proxy", true);
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use("/uploads", express.static(path.resolve(process.cwd(), env.UPLOAD_DIR)));

// Routes
app.use("/api/auth/v1", authRoutes);
app.use("/api/settings/v1", settingRoutes);
app.use("/api/services/v1", serviceRoutes);
app.use("/api/stats/v1", statRoutes);
app.use("/api/testimonials/v1", testimonialRoutes);
app.use("/api/partners/v1", partnerRoutes);
app.use("/api/partner-colleges/v1", partnerCollegeRoutes);
app.use("/api/clients/v1", clientRoutes);
app.use("/api/members/v1", memberRoutes);
app.use("/api/branches/v1", branchRoutes);
app.use("/api/lab-projects/v1", labProjectRoutes);
app.use("/api/blogs/v1", blogRoutes);
app.use("/api/contacts/v1", contactRoutes);
app.use("/api/internship/v1", internshipRoutes);
app.use("/api/social-links/v1", socialLinkRoutes);
app.use("/api/terms/v1", termsRoutes);
app.use("/api/audit-logs/v1", auditLogRoutes);
app.use("/api/uploads/v1", uploadRoutes);
app.use("/api/dashboard/v1", dashboardRoutes);
app.use("/api/public/v1", publicRoutes);
app.use("/api/lab-ideas/v1", labideaRoutes);

// Health check
app.get("/", (_, res) => {
  res.send("API is running");
});

// Error handler (must be last)
app.use(errorMiddleware);

const PORT = env.PORT;

const httpServer = createAppServer(app);
initSocketServer(httpServer);

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});