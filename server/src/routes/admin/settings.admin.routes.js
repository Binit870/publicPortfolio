import { Router } from "express";
import { getSettings, updateSettings, getContactPage, updateContactPage } from "../../controllers/settings.controller.js";
import { verifyJWT } from "../../middleware/auth.middleware.js";
import { requireAdmin } from "../../middleware/role.middleware.js";
import { upload } from "../../middleware/upload.middleware.js";

const router = Router();
router.use(verifyJWT, requireAdmin);

router.get("/", getSettings);
router.patch("/",
  upload.fields([
    { name: "siteLogo", maxCount: 1 },
    { name: "favicon", maxCount: 1 },
  ]),
  updateSettings
);

router.get("/contact-page", getContactPage);
router.patch("/contact-page", updateContactPage);

export default router;