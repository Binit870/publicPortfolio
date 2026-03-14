import { Router } from "express";
import { submitMessage } from "../../controllers/message.controller.js";
import { contactLimiter } from "../../middleware/rateLimit.middleware.js";
import ContactPage from "../../models/ContactPage.model.js";
import ApiResponse from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";

const router = Router();

router.get("/", asyncHandler(async (req, res) => {
  let page = await ContactPage.findOne({ isActive: true });
  if (!page) page = await ContactPage.create({});
  return res.status(200).json(new ApiResponse(200, page, "Contact page fetched"));
}));

router.post("/submit", contactLimiter, submitMessage);

export default router;