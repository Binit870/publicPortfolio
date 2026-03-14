import { ENV } from "./config/env.js";
import connectDB from "./config/db.js";
import app from "./app.js";

const startServer = async () => {
  try {
    await connectDB();

    const server = app.listen(ENV.PORT, () => {
      console.log(`Server running in ${ENV.NODE_ENV} mode on port ${ENV.PORT}`);
    });

    // Handle unhandled promise rejections
    process.on("unhandledRejection", (err) => {
      console.error(`Unhandled Rejection: ${err.message}`);
      server.close(() => process.exit(1));
    });

    // Handle uncaught exceptions
    process.on("uncaughtException", (err) => {
      console.error(`Uncaught Exception: ${err.message}`);
      process.exit(1);
    });

  } catch (error) {
    console.error(`Server startup failed: ${error.message}`);
    process.exit(1);
  }
};

startServer();