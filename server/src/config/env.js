import dotenv from "dotenv";
dotenv.config();

const _required = (key) => {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required environment variable: ${key}`);
  return value;
};

export const ENV = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || "development",

  MONGODB_URI: _required("MONGODB_URI"),

  ACCESS_TOKEN_SECRET: _required("ACCESS_TOKEN_SECRET"),
  ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY || "15m",
  REFRESH_TOKEN_SECRET: _required("REFRESH_TOKEN_SECRET"),
  REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY || "7d",

  CLOUDINARY_CLOUD_NAME: _required("CLOUDINARY_CLOUD_NAME"),
  CLOUDINARY_API_KEY: _required("CLOUDINARY_API_KEY"),
  CLOUDINARY_API_SECRET: _required("CLOUDINARY_API_SECRET"),

  CORS_ORIGIN: process.env.CORS_ORIGIN || "http://localhost:5173",

  MAIL_HOST: process.env.MAIL_HOST,
  MAIL_PORT: process.env.MAIL_PORT || 587,
  MAIL_USER: process.env.MAIL_USER,
  MAIL_PASS: process.env.MAIL_PASS,
  MAIL_FROM: process.env.MAIL_FROM,

  ADMIN_EMAIL: process.env.ADMIN_EMAIL,
};