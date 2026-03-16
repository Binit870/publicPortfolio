import { Router } from "express";
import { uploadSingle, uploadMultiple, deleteFile } from "../controllers/upload.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { requireAdmin } from "../middleware/role.middleware.js";
import { upload } from "../middleware/upload.middleware.js";

const router = Router();

// All upload routes require admin login
router.use(verifyJWT, requireAdmin);

// Single file upload (profile image, blog cover, event banner etc)
router.post("/single", upload.single("file"), uploadSingle);

// Multiple files upload (gallery items)
router.post("/multiple", upload.array("files", 20), uploadMultiple);

// Delete file from cloudinary
router.delete("/", deleteFile);

export default router;