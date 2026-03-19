import Gallery from "../models/Gallery.model.js";
import GalleryItem from "../models/GalleryItem.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { getPagination, paginatedResponse } from "../utils/pagination.js";
import { deleteFromCloudinary } from "../services/media.service.js";

function parseField(value, fallback) {
  if (value === undefined || value === null) return fallback;
  if (typeof value !== "string") return value;
  try { return JSON.parse(value); } catch { return fallback; }
}

// PUBLIC
export const getGalleries = asyncHandler(async (req, res) => {
  const galleries = await Gallery.find({ isActive: true })
    .populate("items")
    .sort({ sectionOrder: 1 });
  return res.status(200).json(new ApiResponse(200, galleries, "Galleries fetched"));
});

export const getGalleryById = asyncHandler(async (req, res) => {
  const gallery = await Gallery.findById(req.params.id).populate("items");
  if (!gallery) throw new ApiError(404, "Gallery not found");
  return res.status(200).json(new ApiResponse(200, gallery, "Gallery fetched"));
});

export const getGalleryItems = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const filter = {};
  if (req.query.category) filter.category = req.query.category;

  const [items, total] = await Promise.all([
    GalleryItem.find(filter).sort({ order: 1 }).skip(skip).limit(limit),
    GalleryItem.countDocuments(filter),
  ]);
  return res.status(200).json(new ApiResponse(200, paginatedResponse(items, total, page, limit), "Items fetched"));
});

// ADMIN — Gallery CRUD
export const createGallery = asyncHandler(async (req, res) => {
  const gallery = await Gallery.create(req.body);
  return res.status(201).json(new ApiResponse(201, gallery, "Gallery created"));
});

export const updateGallery = asyncHandler(async (req, res) => {
  const gallery = await Gallery.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true }
  );
  if (!gallery) throw new ApiError(404, "Gallery not found");
  return res.status(200).json(new ApiResponse(200, gallery, "Gallery updated"));
});

export const deleteGallery = asyncHandler(async (req, res) => {
  const gallery = await Gallery.findByIdAndDelete(req.params.id);
  if (!gallery) throw new ApiError(404, "Gallery not found");
  return res.status(200).json(new ApiResponse(200, {}, "Gallery deleted"));
});

// ADMIN — Gallery Item CRUD
export const addGalleryItem = asyncHandler(async (req, res) => {
  const mediaUrl = req.file?.path;
  if (!mediaUrl) throw new ApiError(400, "Media file is required");

  const tags = parseField(req.body.tags, []);
  const lightboxEnabled = req.body.lightboxEnabled === "false" ? false : true;

  const item = await GalleryItem.create({
    title: req.body.title,
    description: req.body.description,
    mediaType: req.body.mediaType || "image",
    mediaUrl,
    thumbnail: req.file?.path,
    category: req.body.category,
    tags,
    altText: req.body.altText,
    hoverText: req.body.hoverText,
    lightboxEnabled,
    order: parseInt(req.body.order) || 0,
  });

  if (req.body.galleryId) {
    await Gallery.findByIdAndUpdate(req.body.galleryId, { $push: { items: item._id } });
  }

  return res.status(201).json(new ApiResponse(201, item, "Item added"));
});

export const updateGalleryItem = asyncHandler(async (req, res) => {
  const tags = parseField(req.body.tags, undefined);
  const lightboxEnabled = req.body.lightboxEnabled !== undefined
    ? req.body.lightboxEnabled === "false" ? false : true
    : undefined;

  const updateData = {
    ...(req.body.title && { title: req.body.title }),
    ...(req.body.description !== undefined && { description: req.body.description }),
    ...(req.body.mediaType && { mediaType: req.body.mediaType }),
    ...(req.body.category !== undefined && { category: req.body.category }),
    ...(tags !== undefined && { tags }),
    ...(req.body.altText !== undefined && { altText: req.body.altText }),
    ...(req.body.hoverText !== undefined && { hoverText: req.body.hoverText }),
    ...(lightboxEnabled !== undefined && { lightboxEnabled }),
    ...(req.body.order !== undefined && { order: parseInt(req.body.order) || 0 }),
  };

  // new image uploaded — replace old one on cloudinary
  if (req.file?.path) {
    const existing = await GalleryItem.findById(req.params.id);
    if (existing?.mediaUrl) {
      await deleteFromCloudinary(existing.mediaUrl).catch(() => {});
    }
    updateData.mediaUrl = req.file.path;
    updateData.thumbnail = req.file.path;
  }

  const item = await GalleryItem.findByIdAndUpdate(
    req.params.id,
    { $set: updateData },
    { new: true }
  );
  if (!item) throw new ApiError(404, "Item not found");
  return res.status(200).json(new ApiResponse(200, item, "Item updated"));
});

export const deleteGalleryItem = asyncHandler(async (req, res) => {
  const item = await GalleryItem.findById(req.params.id);
  if (!item) throw new ApiError(404, "Item not found");

  // delete from cloudinary
  if (item.mediaUrl) {
    await deleteFromCloudinary(item.mediaUrl).catch(() => {});
  }

  await GalleryItem.findByIdAndDelete(req.params.id);
  await Gallery.updateMany({ items: item._id }, { $pull: { items: item._id } });

  return res.status(200).json(new ApiResponse(200, {}, "Item deleted"));
});