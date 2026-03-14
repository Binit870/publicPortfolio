import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { ENV } from "./config/env.js";
import { errorHandler } from "./middleware/error.middleware.js";
import router from "./routes/index.js";

const app = express();

// Security headers
app.use(helmet());

// CORS
app.use(cors({
  origin: ENV.CORS_ORIGIN,
  credentials: true,
}));

// Body parsers
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Cookie parser
app.use(cookieParser());

// Logger (only in development)
if (ENV.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Health check route
app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true, message: "Server is running" });
});

// All routes
app.use("/api", router);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Global error handler (must be last)
app.use(errorHandler);

export default app;