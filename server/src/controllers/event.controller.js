import Event from "../models/Event.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { getPagination, paginatedResponse } from "../utils/pagination.js";

// PUBLIC
export const getPublishedEvents = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const filter = { status: "Published" };
  if (req.query.category) filter.category = req.query.category;
  if (req.query.mode) filter.eventMode = req.query.mode;

  const [events, total] = await Promise.all([
    Event.find(filter).sort({ "dateTime.startDate": 1 }).skip(skip).limit(limit),
    Event.countDocuments(filter),
  ]);
  return res.status(200).json(new ApiResponse(200, paginatedResponse(events, total, page, limit), "Events fetched"));
});

export const getEventById = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event || event.status !== "Published") throw new ApiError(404, "Event not found");
  await Event.findByIdAndUpdate(req.params.id, { $inc: { "stats.views": 1 } });
  return res.status(200).json(new ApiResponse(200, event, "Event fetched"));
});

// ADMIN
export const getAllEvents = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const filter = {};
  if (req.query.status) filter.status = req.query.status;

  const [events, total] = await Promise.all([
    Event.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Event.countDocuments(filter),
  ]);
  return res.status(200).json(new ApiResponse(200, paginatedResponse(events, total, page, limit), "Events fetched"));
});

export const createEvent = asyncHandler(async (req, res) => {
  const eventData = { ...req.body };
  if (req.files?.bannerImage?.[0]) eventData.bannerImage = req.files.bannerImage[0].path;
  if (req.files?.coverImage?.[0]) eventData.coverImage = req.files.coverImage[0].path;

  const event = await Event.create(eventData);
  return res.status(201).json(new ApiResponse(201, event, "Event created"));
});

export const updateEvent = asyncHandler(async (req, res) => {
  const updateData = { ...req.body };
  if (req.files?.bannerImage?.[0]) updateData.bannerImage = req.files.bannerImage[0].path;
  if (req.files?.coverImage?.[0]) updateData.coverImage = req.files.coverImage[0].path;

  const event = await Event.findByIdAndUpdate(req.params.id, { $set: updateData }, { new: true });
  if (!event) throw new ApiError(404, "Event not found");
  return res.status(200).json(new ApiResponse(200, event, "Event updated"));
});

export const deleteEvent = asyncHandler(async (req, res) => {
  const event = await Event.findByIdAndDelete(req.params.id);
  if (!event) throw new ApiError(404, "Event not found");
  return res.status(200).json(new ApiResponse(200, {}, "Event deleted"));
});

export const updateEventStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const event = await Event.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!event) throw new ApiError(404, "Event not found");
  return res.status(200).json(new ApiResponse(200, event, "Status updated"));
});