import multer from "multer";
import { storage } from "../config/cloudinary.js";

export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, 
});