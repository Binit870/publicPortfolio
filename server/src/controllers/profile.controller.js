import Profile from "../models/Profile.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

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
  try {
    const profile = await getOrCreateProfile();

    const updateData = {};

    // Recursively flatten nested objects to dot-notation
    // e.g. { home: { name: "X" } } → { "home.name": "X" }
    const flatten = (obj, prefix = "") => {
      for (const key in obj) {
        const val = obj[key];
        const dotKey = prefix ? `${prefix}.${key}` : key;

        if (
          val !== null &&
          typeof val === "object" &&
          !Array.isArray(val) &&
          !(val instanceof File)
        ) {
          flatten(val, dotKey);
        } else {
          updateData[dotKey] = val;
        }
      }
    };

    flatten(req.body);

    // Cloudinary URLs
    if (req.files?.heroImage?.[0]) {
      updateData["home.heroImage"] = req.files.heroImage[0].path;
    }
    if (req.files?.aboutProfileImage?.[0]) {
      updateData["about.profileImage"] = req.files.aboutProfileImage[0].path;
    }

    const updated = await Profile.findByIdAndUpdate(
      profile._id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    return res.status(200).json(new ApiResponse(200, updated, "Profile updated"));

  } catch (err) {
    console.error("UPDATE PROFILE ERROR:", err);
    throw err;
  }
});