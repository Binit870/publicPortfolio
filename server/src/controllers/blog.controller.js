import Blog from "../models/Blog.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { getPagination, paginatedResponse } from "../utils/pagination.js";
import { generateUniqueSlug } from "../services/slug.service.js";
import { calculateReadingTime } from "../utils/readingTime.js";

// PUBLIC
export const getPublishedBlogs = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const filter = { status: "published" };
  if (req.query.category) filter.category = req.query.category;
  if (req.query.tag) filter.tags = req.query.tag;

  const [blogs, total] = await Promise.all([
    Blog.find(filter).select("-content").sort({ createdAt: -1 }).skip(skip).limit(limit).populate("author", "name avatar"),
    Blog.countDocuments(filter),
  ]);
  return res.status(200).json(new ApiResponse(200, paginatedResponse(blogs, total, page, limit), "Blogs fetched"));
});

export const getBlogBySlug = asyncHandler(async (req, res) => {
  const blog = await Blog.findOne({ slug: req.params.slug, status: "published" }).populate("author", "name avatar").populate("relatedPosts", "title slug coverImage excerpt");
  if (!blog) throw new ApiError(404, "Blog not found");
  await Blog.findByIdAndUpdate(blog._id, { $inc: { "stats.views": 1 } });
  return res.status(200).json(new ApiResponse(200, blog, "Blog fetched"));
});

// ADMIN
export const getAllBlogs = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const filter = {};
  if (req.query.status) filter.status = req.query.status;

  const [blogs, total] = await Promise.all([
    Blog.find(filter).select("-content").sort({ createdAt: -1 }).skip(skip).limit(limit).populate("author", "name"),
    Blog.countDocuments(filter),
  ]);
  return res.status(200).json(new ApiResponse(200, paginatedResponse(blogs, total, page, limit), "Blogs fetched"));
});

export const createBlog = asyncHandler(async (req, res) => {
  const slug = await generateUniqueSlug(req.body.title);
  const readingTime = calculateReadingTime(req.body.content);
  const coverImage = req.file?.path;

  const blog = await Blog.create({
    ...req.body,
    slug,
    readingTime,
    author: req.user._id,
    ...(coverImage && { coverImage }),
  });
  return res.status(201).json(new ApiResponse(201, blog, "Blog created"));
});

export const updateBlog = asyncHandler(async (req, res) => {
  const updateData = { ...req.body };
  if (req.file?.path) updateData.coverImage = req.file.path;
  if (updateData.content) updateData.readingTime = calculateReadingTime(updateData.content);

  const blog = await Blog.findByIdAndUpdate(req.params.id, { $set: updateData }, { new: true });
  if (!blog) throw new ApiError(404, "Blog not found");
  return res.status(200).json(new ApiResponse(200, blog, "Blog updated"));
});

export const deleteBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findByIdAndDelete(req.params.id);
  if (!blog) throw new ApiError(404, "Blog not found");
  return res.status(200).json(new ApiResponse(200, {}, "Blog deleted"));
});

export const updateBlogStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const blog = await Blog.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!blog) throw new ApiError(404, "Blog not found");
  return res.status(200).json(new ApiResponse(200, blog, "Status updated"));
});