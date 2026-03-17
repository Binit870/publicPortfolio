import Settings from "../models/Settings.model.js";
import ContactPage from "../models/ContactPage.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { deleteFromCloudinary } from "../services/media.service.js";

// Get or create single settings document
const getOrCreateSettings = async () => {
  let settings = await Settings.findOne();
  if (!settings) settings = await Settings.create({});
  return settings;
};

// PUBLIC — get site settings (for SEO, site name, logo etc on frontend)
export const getPublicSettings = asyncHandler(async (req, res) => {
  const settings = await getOrCreateSettings();
  // Only return non-sensitive fields to public
  const publicData = {
    siteName: settings.siteName,
    siteTagline: settings.siteTagline,
    siteLogo: settings.siteLogo,
    favicon: settings.favicon,
    seo: settings.seo,
    maintenanceMode: settings.maintenanceMode,
    allowComments: settings.allowComments,
    allowContactForm: settings.allowContactForm,
  };
  return res.status(200).json(new ApiResponse(200, publicData, "Settings fetched"));
});

// ADMIN — get full settings
export const getSettings = asyncHandler(async (req, res) => {
  const settings = await getOrCreateSettings();
  return res.status(200).json(new ApiResponse(200, settings, "Settings fetched"));
});

// ADMIN — update settings
export const updateSettings = asyncHandler(async (req, res) => {
  const settings = await getOrCreateSettings();
  const updateData = { ...req.body };

  // Handle logo upload
  if (req.files?.siteLogo?.[0]) {
    if (settings.siteLogo) await deleteFromCloudinary(settings.siteLogo);
    updateData.siteLogo = req.files.siteLogo[0].path;
  }

  // Handle favicon upload
  if (req.files?.favicon?.[0]) {
    if (settings.favicon) await deleteFromCloudinary(settings.favicon);
    updateData.favicon = req.files.favicon[0].path;
  }

  const updated = await Settings.findByIdAndUpdate(
    settings._id,
    { $set: updateData },
    { new: true, runValidators: true }
  );

  return res.status(200).json(new ApiResponse(200, updated, "Settings updated"));
  
});

// ADMIN — get contact page content
export const getContactPage = asyncHandler(async (req, res) => {
  let page = await ContactPage.findOne();
  if (!page) page = await ContactPage.create({});
  return res.status(200).json(new ApiResponse(200, page, "Contact page fetched"));
});

// ADMIN — update contact page content
export const updateContactPage = asyncHandler(async (req, res) => {
  let page = await ContactPage.findOne();
  if (!page) {
    page = await ContactPage.create(req.body);
  } else {
    page = await ContactPage.findByIdAndUpdate(
      page._id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
  }
  return res.status(200).json(new ApiResponse(200, page, "Contact page updated"));
});

// SUPERADMIN — toggle maintenance mode
export const toggleMaintenance = asyncHandler(async (req, res) => {
  const settings = await getOrCreateSettings();
  const updated = await Settings.findByIdAndUpdate(
    settings._id,
    { maintenanceMode: !settings.maintenanceMode },
    { new: true }
  );
  return res.status(200).json(
    new ApiResponse(200, { maintenanceMode: updated.maintenanceMode },
      `Maintenance mode ${updated.maintenanceMode ? "enabled" : "disabled"}`)
  );
});