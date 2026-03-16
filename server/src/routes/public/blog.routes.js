import { Router } from "express";
import { getPublishedBlogs, getBlogBySlug } from "../../controllers/blog.controller.js";
import { getCommentsByBlog, submitComment, replyToComment } from "../../controllers/comment.controller.js";

const router = Router();

router.get("/", getPublishedBlogs);
router.get("/:slug", getBlogBySlug);

// Comment routes (public)
router.get("/:blogId/comments", getCommentsByBlog);
router.post("/:blogId/comments", submitComment);
router.post("/comments/:commentId/reply", replyToComment);

export default router;