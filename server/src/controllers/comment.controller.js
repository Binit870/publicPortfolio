import Comment from "../models/Comment.model.js";
import Blog from "../models/Blog.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { getPagination, paginatedResponse } from "../utils/pagination.js";

// PUBLIC — get approved comments for a blog
export const getCommentsByBlog = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const { blogId } = req.params;

  const [comments, total] = await Promise.all([
    Comment.find({ blogId, isApproved: true })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Comment.countDocuments({ blogId, isApproved: true }),
  ]);

  return res.status(200).json(
    new ApiResponse(200, paginatedResponse(comments, total, page, limit), "Comments fetched")
  );
});

// PUBLIC — submit a comment (guest or logged in)
export const submitComment = asyncHandler(async (req, res) => {
  const { blogId } = req.params;
  const { content, guestName, guestEmail } = req.body;

  if (!content) throw new ApiError(400, "Comment content is required");

  const blog = await Blog.findById(blogId);
  if (!blog) throw new ApiError(404, "Blog not found");
  if (!blog.allowComments) throw new ApiError(403, "Comments are disabled for this post");

  const comment = await Comment.create({
    blogId,
    content,
    guestName: guestName || null,
    guestEmail: guestEmail || null,
    isApproved: false, // needs admin approval
  });

  return res.status(201).json(
    new ApiResponse(201, comment, "Comment submitted and pending approval")
  );
});

// PUBLIC — reply to a comment
export const replyToComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const { content, guestName } = req.body;

  if (!content) throw new ApiError(400, "Reply content is required");

  const comment = await Comment.findById(commentId);
  if (!comment) throw new ApiError(404, "Comment not found");
  if (!comment.isApproved) throw new ApiError(403, "Cannot reply to unapproved comment");

  comment.replies.push({
    guestName: guestName || "Anonymous",
    content,
    createdAt: new Date(),
  });

  await comment.save();

  return res.status(201).json(
    new ApiResponse(201, comment, "Reply added")
  );
});

// ADMIN — get all comments (including unapproved)
export const getAllComments = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const filter = {};
  if (req.query.isApproved !== undefined) {
    filter.isApproved = req.query.isApproved === "true";
  }
  if (req.query.blogId) filter.blogId = req.query.blogId;

  const [comments, total] = await Promise.all([
    Comment.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("blogId", "title slug"),
    Comment.countDocuments(filter),
  ]);

  return res.status(200).json(
    new ApiResponse(200, paginatedResponse(comments, total, page, limit), "Comments fetched")
  );
});

// ADMIN — approve a comment
export const approveComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findByIdAndUpdate(
    req.params.id,
    { isApproved: true },
    { new: true }
  );
  if (!comment) throw new ApiError(404, "Comment not found");
  return res.status(200).json(new ApiResponse(200, comment, "Comment approved"));
});

// ADMIN — delete a comment
export const deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findByIdAndDelete(req.params.id);
  if (!comment) throw new ApiError(404, "Comment not found");
  return res.status(200).json(new ApiResponse(200, {}, "Comment deleted"));
});