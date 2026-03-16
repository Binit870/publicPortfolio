import { Router } from "express";
import { getGalleries, getGalleryById, getGalleryItems } from "../../controllers/gallery.controller.js";

const router = Router();
router.get("/", getGalleries);
router.get("/items", getGalleryItems);
router.get("/:id", getGalleryById);

export default router;