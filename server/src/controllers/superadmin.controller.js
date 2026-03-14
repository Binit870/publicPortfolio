import User from "../models/User.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getAllAdmins = asyncHandler(async (req, res) => {
  const admins = await User.find({ role: "admin" }).select("-password -refreshToken");
  return res.status(200).json(new ApiResponse(200, admins, "Admins fetched"));
});

export const createAdmin = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const exists = await User.findOne({ email });
  if (exists) throw new ApiError(409, "Email already exists");
  const admin = await User.create({ name, email, password, role: "admin" });
  const result = await User.findById(admin._id).select("-password -refreshToken");
  return res.status(201).json(new ApiResponse(201, result, "Admin created"));
});

export const updateAdminPermissions = asyncHandler(async (req, res) => {
  const { permissions } = req.body;
  const admin = await User.findOneAndUpdate(
    { _id: req.params.id, role: "admin" },
    { $set: { permissions } },
    { new: true }
  ).select("-password -refreshToken");
  if (!admin) throw new ApiError(404, "Admin not found");
  return res.status(200).json(new ApiResponse(200, admin, "Permissions updated"));
});

export const toggleAdminStatus = asyncHandler(async (req, res) => {
  const admin = await User.findOne({ _id: req.params.id, role: "admin" });
  if (!admin) throw new ApiError(404, "Admin not found");
  admin.isActive = !admin.isActive;
  await admin.save({ validateBeforeSave: false });
  return res.status(200).json(new ApiResponse(200, { isActive: admin.isActive }, `Admin ${admin.isActive ? "activated" : "deactivated"}`));
});

export const deleteAdmin = asyncHandler(async (req, res) => {
  const admin = await User.findOneAndDelete({ _id: req.params.id, role: "admin" });
  if (!admin) throw new ApiError(404, "Admin not found");
  return res.status(200).json(new ApiResponse(200, {}, "Admin deleted"));
});