import Message from "../models/Message.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { getPagination, paginatedResponse } from "../utils/pagination.js";

export const submitMessage = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, phone, company, message, newsletterOptIn } = req.body;
  const newMessage = await Message.create({
    firstName, lastName, email, phone, company, message, newsletterOptIn,
    ipAddress: req.ip,
  });
  return res.status(201).json(new ApiResponse(201, newMessage, "Message sent successfully"));
});

export const getAllMessages = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const filter = {};
  if (req.query.isRead !== undefined) filter.isRead = req.query.isRead === "true";

  const [messages, total] = await Promise.all([
    Message.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Message.countDocuments(filter),
  ]);
  return res.status(200).json(new ApiResponse(200, paginatedResponse(messages, total, page, limit), "Messages fetched"));
});

export const getMessageById = asyncHandler(async (req, res) => {
  const message = await Message.findByIdAndUpdate(
    req.params.id,
    { isRead: true },
    { new: true }
  );
  if (!message) throw new ApiError(404, "Message not found");
  return res.status(200).json(new ApiResponse(200, message, "Message fetched"));
});

export const deleteMessage = asyncHandler(async (req, res) => {
  const message = await Message.findByIdAndDelete(req.params.id);
  if (!message) throw new ApiError(404, "Message not found");
  return res.status(200).json(new ApiResponse(200, {}, "Message deleted"));
});

export const markAsReplied = asyncHandler(async (req, res) => {
  const message = await Message.findByIdAndUpdate(req.params.id, { isReplied: true }, { new: true });
  if (!message) throw new ApiError(404, "Message not found");
  return res.status(200).json(new ApiResponse(200, message, "Marked as replied"));
});