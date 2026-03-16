import { Router } from "express";
import { getPublishedEvents, getEventById } from "../../controllers/event.controller.js";

const router = Router();
router.get("/", getPublishedEvents);
router.get("/:id", getEventById);

export default router;