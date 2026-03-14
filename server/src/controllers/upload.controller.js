import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import { deleteFromCloudinary } from "../services/media.service.js";

// Single file upload — used for profile images, blog covers etc
export const uploadSingle = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, "No file uploaded");

  return res.status(200).json(
    new ApiResponse(200, {
      url: req.file.path,
      filename: req.file.filename,
      mimetype: req.file.mimetype,
      size: req.file.size,
    }, "File uploaded successfully")
  );
});

// Multiple files upload — used for gallery
export const uploadMultiple = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    throw new ApiError(400, "No files uploaded");
  }

  const uploaded = req.files.map((file) => ({
    url: file.path,
    filename: file.filename,
    mimetype: file.mimetype,
    size: file.size,
  }));

  return res.status(200).json(
    new ApiResponse(200, uploaded, `${uploaded.length} file(s) uploaded successfully`)
  );
});

// Delete a file from cloudinary
export const deleteFile = asyncHandler(async (req, res) => {
  const { url } = req.body;
  if (!url) throw new ApiError(400, "File URL is required");

  await deleteFromCloudinary(url);

  return res.status(200).json(
    new ApiResponse(200, {}, "File deleted successfully")
  );
});