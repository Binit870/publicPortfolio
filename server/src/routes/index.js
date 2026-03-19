import { Router } from "express";
import { generalLimiter } from "../middleware/rateLimit.middleware.js";

// Auth
import authRoutes from "./auth.routes.js";

// Public
import publicProfileRoutes from "./public/profile.routes.js";
import publicGalleryRoutes from "./public/gallery.routes.js";
import publicEventRoutes from "./public/event.routes.js";
import publicBlogRoutes from "./public/blog.routes.js";
import publicContactRoutes from "./public/contact.routes.js";

// Admin
import adminProfileRoutes from "./admin/profile.admin.routes.js";
import adminGalleryRoutes from "./admin/gallery.admin.routes.js";
import adminEventRoutes from "./admin/event.admin.routes.js";
import adminBlogRoutes from "./admin/blog.admin.routes.js";
import adminMessageRoutes from "./admin/message.admin.routes.js";
import adminCommentRoutes from "./admin/comment.admin.routes.js";

// Superadmin
import superAdminUserRoutes from "./superadmin/user.superadmin.routes.js";

// Upload
import uploadRoutes from "./upload.routes.js";

const router = Router();

router.use(generalLimiter);

// Auth
router.use("/auth", authRoutes);

// Public routes
router.use("/profile", publicProfileRoutes);
router.use("/gallery", publicGalleryRoutes);
router.use("/events", publicEventRoutes);
router.use("/blogs", publicBlogRoutes);
router.use("/contact", publicContactRoutes);

// Admin routes
router.use("/admin/profile", adminProfileRoutes);
router.use("/admin/gallery", adminGalleryRoutes);
router.use("/admin/events", adminEventRoutes);
router.use("/admin/blogs", adminBlogRoutes);
router.use("/admin/messages", adminMessageRoutes);
router.use("/admin/comments", adminCommentRoutes);

// Superadmin routes
router.use("/superadmin/users", superAdminUserRoutes);

// Upload routes (admin only, handled inside the route file)
router.use("/upload", uploadRoutes);

export default router;