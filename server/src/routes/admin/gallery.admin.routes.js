import { Router } from "express";
import { createGallery, updateGallery, deleteGallery, addGalleryItem, updateGalleryItem, deleteGalleryItem } from "../../controllers/gallery.controller.js";
import { verifyJWT } from "../../middleware/auth.middleware.js";
import { requireAdmin, checkPermission } from "../../middleware/role.middleware.js";
import { upload } from "../../middleware/upload.middleware.js";

const router = Router();
router.use(verifyJWT, requireAdmin, checkPermission("manageGallery"));

router.post("/", createGallery);
router.patch("/:id", updateGallery);
router.delete("/:id", deleteGallery);
router.post("/items", upload.single("media"), addGalleryItem);
router.patch("/items/:id", upload.single("media"), updateGalleryItem);
router.delete("/items/:id", deleteGalleryItem);

export default router;