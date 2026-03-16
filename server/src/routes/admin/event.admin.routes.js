import { Router } from "express";
import { getAllEvents, createEvent, updateEvent, deleteEvent, updateEventStatus } from "../../controllers/event.controller.js";
import { verifyJWT } from "../../middleware/auth.middleware.js";
import { requireAdmin, checkPermission } from "../../middleware/role.middleware.js";
import { upload } from "../../middleware/upload.middleware.js";

const router = Router();
router.use(verifyJWT, requireAdmin, checkPermission("manageEvents"));

router.get("/", getAllEvents);
router.post("/", upload.fields([{ name: "bannerImage", maxCount: 1 }, { name: "coverImage", maxCount: 1 }]), createEvent);
router.patch("/:id", upload.fields([{ name: "bannerImage", maxCount: 1 }, { name: "coverImage", maxCount: 1 }]), updateEvent);
router.delete("/:id", deleteEvent);
router.patch("/:id/status", updateEventStatus);

export default router;