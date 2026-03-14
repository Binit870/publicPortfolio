import { Router } from "express";
import { getAllBlogs, createBlog, updateBlog, deleteBlog, updateBlogStatus } from "../../controllers/blog.controller.js";
import { verifyJWT } from "../../middleware/auth.middleware.js";
import { requireAdmin, checkPermission } from "../../middleware/role.middleware.js";
import { upload } from "../../middleware/upload.middleware.js";

const router = Router();
router.use(verifyJWT, requireAdmin, checkPermission("manageUpdates"));

router.get("/", getAllBlogs);
router.post("/", upload.single("coverImage"), createBlog);
router.patch("/:id", upload.single("coverImage"), updateBlog);
router.delete("/:id", deleteBlog);
router.patch("/:id/status", updateBlogStatus);

export default router;