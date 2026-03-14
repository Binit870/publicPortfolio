import { Router } from "express";
import { getProfile, updateProfile } from "../../controllers/profile.controller.js";
import { verifyJWT } from "../../middleware/auth.middleware.js";
import { requireAdmin, checkPermission } from "../../middleware/role.middleware.js";
import { upload } from "../../middleware/upload.middleware.js";

const router = Router();
router.use(verifyJWT, requireAdmin);

router.get("/", getProfile);
router.patch("/", checkPermission("manageProfile"), upload.fields([
  { name: "heroImage", maxCount: 1 },
  { name: "aboutProfileImage", maxCount: 1 },
]), updateProfile);

export default router;