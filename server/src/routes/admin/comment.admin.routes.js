import { Router } from "express";
import { getAllComments, approveComment, deleteComment } from "../../controllers/comment.controller.js";
import { verifyJWT } from "../../middleware/auth.middleware.js";
import { requireAdmin } from "../../middleware/role.middleware.js";

const router = Router();
router.use(verifyJWT, requireAdmin);

router.get("/", getAllComments);
router.patch("/:id/approve", approveComment);
router.delete("/:id", deleteComment);

export default router;