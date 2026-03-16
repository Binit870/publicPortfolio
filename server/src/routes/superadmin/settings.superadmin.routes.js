import { Router } from "express";
import { getSettings, toggleMaintenance } from "../../controllers/settings.controller.js";
import { verifyJWT } from "../../middleware/auth.middleware.js";
import { requireSuperAdmin } from "../../middleware/role.middleware.js";

const router = Router();
router.use(verifyJWT, requireSuperAdmin);

router.get("/", getSettings);
router.patch("/maintenance", toggleMaintenance);

export default router;