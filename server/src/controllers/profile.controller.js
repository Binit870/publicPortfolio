import Profile from "../models/Profile.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

// Get or create single profile document
const getOrCreateProfile = async () => {
  let profile = await Profile.findOne();
  if (!profile) profile = await Profile.create({});
  return profile;
};

export const getProfile = asyncHandler(async (req, res) => {
  const profile = await getOrCreateProfile();
  return res.status(200).json(new ApiResponse(200, profile, "Profile fetched"));
});

export const updateProfile = asyncHandler(async (req, res) => {
  const profile = await getOrCreateProfile();
  const updated = await Profile.findByIdAndUpdate(
    profile._id,
    { $set: req.body },
    { new: true, runValidators: true }
  );
  return res.status(200).json(new ApiResponse(200, updated, "Profile updated"));
});