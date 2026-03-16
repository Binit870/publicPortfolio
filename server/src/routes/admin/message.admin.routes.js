import { Router } from "express";
import { getAllMessages, getMessageById, deleteMessage, markAsReplied } from "../../controllers/message.controller.js";
import { verifyJWT } from "../../middleware/auth.middleware.js";
import { requireAdmin, checkPermission } from "../../middleware/role.middleware.js";

const router = Router();
router.use(verifyJWT, requireAdmin, checkPermission("manageMessages"));

router.get("/", getAllMessages);
router.get("/:id", getMessageById);
router.delete("/:id", deleteMessage);
router.patch("/:id/replied", markAsReplied);

export default router;