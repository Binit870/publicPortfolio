import { Router } from "express";
import {
  signup,
  login,
  logout,
  refreshAccessToken,
  getMe,
  changePassword
} from "../controllers/auth.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { authLimiter } from "../middleware/rateLimit.middleware.js";

const router = Router();
router.post("/signup",authLimiter, signup);
router.post("/login", authLimiter, login);
router.post("/logout", verifyJWT, logout);
router.post("/refresh-token", refreshAccessToken);
router.get("/me", verifyJWT, getMe);
router.post("/change-password", verifyJWT, changePassword);

export default router;