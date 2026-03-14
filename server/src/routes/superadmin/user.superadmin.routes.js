import { Router } from "express";
import { getAllAdmins, createAdmin, updateAdminPermissions, toggleAdminStatus, deleteAdmin } from "../../controllers/superadmin.controller.js";
import { verifyJWT } from "../../middleware/auth.middleware.js";
import { requireSuperAdmin } from "../../middleware/role.middleware.js";

const router = Router();
router.use(verifyJWT, requireSuperAdmin);

router.get("/", getAllAdmins);
router.post("/", createAdmin);
router.patch("/:id/permissions", updateAdminPermissions);
router.patch("/:id/toggle-status", toggleAdminStatus);
router.delete("/:id", deleteAdmin);

export default router;