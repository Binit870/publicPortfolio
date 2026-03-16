import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.model.js";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected for seeding");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};

const createSuperAdmin = async () => {
  try {
    await connectDB();

    const existing = await User.findOne({ role: "superadmin" });

    if (existing) {
      console.log("Superadmin already exists");
      process.exit();
    }

    const admin = await User.create({
      name: "System Owner",
      email: process.env.SUPERADMIN_EMAIL,
      password: process.env.SUPERADMIN_PASSWORD,
      role: "superadmin",
    });

    console.log("Superadmin created:", admin.email);

    process.exit();
  } catch (error) {
    console.error("Error creating superadmin:", error);
    process.exit(1);
  }
};

createSuperAdmin();