import jwt from "jsonwebtoken";
import { ENV } from "../config/env.js";

export const generateAccessToken = (user) => {
  return jwt.sign(
    { _id: user._id, role: user.role, email: user.email },
    ENV.ACCESS_TOKEN_SECRET,
    { expiresIn: ENV.ACCESS_TOKEN_EXPIRY }
  );
};

export const generateRefreshToken = (user) => {
  return jwt.sign(
    { _id: user._id },
    ENV.REFRESH_TOKEN_SECRET,
    { expiresIn: ENV.REFRESH_TOKEN_EXPIRY }
  );
};

export const cookieOptions = {
  httpOnly: true,
  secure: ENV.NODE_ENV === "production",
  sameSite: "strict",
};