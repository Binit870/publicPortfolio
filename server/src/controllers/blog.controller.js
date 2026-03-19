import Blog from "../models/Blog.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { getPagination, paginatedResponse } from "../utils/pagination.js";
import { generateUniqueSlug } from "../services/slug.service.js";
import { calculateReadingTime } from "../utils/readingTime.js";

/* ─────────────────────────────────────────────
   Helper — safely parse a JSON string field
   (FormData sends everything as strings)
───────────────────────────────────────────────*/
function parseField(value, fallback) {
  if (value === undefined || value === null) return fallback;
  if (typeof value !== "string") return value; // already parsed
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

/* ─────────────────────────────────────────────
   PUBLIC routes
───────────────────────────────────────────────*/

export const getPublishedBlogs = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const filter = { status: "published" };
  if (req.query.category) filter.category = req.query.category;
  if (req.query.tag)      filter.tags     = req.query.tag;

  const [blogs, total] = await Promise.all([
    Blog.find(filter)
      .select("-content")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("author", "name avatar"),
    Blog.countDocuments(filter),
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, paginatedResponse(blogs, total, page, limit), "Blogs fetched"));
});

export const getBlogBySlug = asyncHandler(async (req, res) => {
  const blog = await Blog.findOne({ slug: req.params.slug, status: "published" })
    .populate("author", "name avatar")
    .populate("relatedPosts", "title slug coverImage excerpt");

  if (!blog) throw new ApiError(404, "Blog not found");

  // Increment view count without waiting
  Blog.findByIdAndUpdate(blog._id, { $inc: { "stats.views": 1 } }).exec();

  return res
    .status(200)
    .json(new ApiResponse(200, blog, "Blog fetched"));
});

/* ─────────────────────────────────────────────
   ADMIN routes
───────────────────────────────────────────────*/

export const getAllBlogs = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const filter = {};
  if (req.query.status) filter.status = req.query.status;

  const [blogs, total] = await Promise.all([
    Blog.find(filter)
      .select("-content")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("author", "name"),
    Blog.countDocuments(filter),
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, paginatedResponse(blogs, total, page, limit), "Blogs fetched"));
});

// ✅ NEW — fetch a single blog by ID (includes content, for edit page)
export const getBlogById = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate("author", "name");
  if (!blog) throw new ApiError(404, "Blog not found");

  return res
    .status(200)
    .json(new ApiResponse(200, blog, "Blog fetched"));
});

export const createBlog = asyncHandler(async (req, res) => {
  const slug        = await generateUniqueSlug(req.body.title);
  const readingTime = calculateReadingTime(req.body.content);
  const coverImage  = req.file?.path;

  // FormData sends tags and seo as JSON strings — parse them
  const tags = parseField(req.body.tags, []);
  const seo  = parseField(req.body.seo,  {});

  // allowComments comes as the string "true"/"false" from FormData
  const allowComments = req.body.allowComments === "false" ? false : true;

  const blog = await Blog.create({
    ...req.body,
    tags,
    seo,
    allowComments,
    slug,
    readingTime,
    author: req.user._id,
    ...(coverImage && { coverImage }),
  });

  return res
    .status(201)
    .json(new ApiResponse(201, blog, "Blog created"));
});

export const updateBlog = asyncHandler(async (req, res) => {
  const updateData = { ...req.body };

  // Parse JSON string fields that arrive via FormData
  if (updateData.tags !== undefined) updateData.tags = parseField(updateData.tags, []);
  if (updateData.seo  !== undefined) updateData.seo  = parseField(updateData.seo,  {});
  if (updateData.allowComments !== undefined) {
    updateData.allowComments = updateData.allowComments === "false" ? false : true;
  }

  if (req.file?.path)       updateData.coverImage  = req.file.path;
  if (updateData.content)   updateData.readingTime = calculateReadingTime(updateData.content);

  const blog = await Blog.findByIdAndUpdate(
    req.params.id,
    { $set: updateData },
    { new: true }
  );

  if (!blog) throw new ApiError(404, "Blog not found");

  return res
    .status(200)
    .json(new ApiResponse(200, blog, "Blog updated"));
});

export const deleteBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findByIdAndDelete(req.params.id);
  if (!blog) throw new ApiError(404, "Blog not found");

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Blog deleted"));
});

export const updateBlogStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!["draft", "published", "archived"].includes(status)) {
    throw new ApiError(400, "Invalid status value");
  }

  const blog = await Blog.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );

  if (!blog) throw new ApiError(404, "Blog not found");

  return res
    .status(200)
    .json(new ApiResponse(200, blog, "Status updated"));
});