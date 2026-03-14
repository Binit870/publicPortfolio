import jwt from "jsonwebtoken";
import { ENV } from "../config/env.js";
import User from "../models/User.model.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.headers["authorization"]?.replace("Bearer ", "");

  if (!token) throw new ApiError(401, "Unauthorized - No token provided");

  const decoded = jwt.verify(token, ENV.ACCESS_TOKEN_SECRET);
  const user = await User.findById(decoded._id).select("-password -refreshToken");

  if (!user) throw new ApiError(401, "Unauthorized - Invalid token");
  if (!user.isActive) throw new ApiError(403, "Account has been deactivated");

  req.user = user;
  next();
});