import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, default: "" },
    email: { type: String, required: true },
    phone: String,
    company: String,
    message: { type: String, required: true },
    newsletterOptIn: { type: Boolean, default: false },
    isRead: { type: Boolean, default: false },
    isReplied: { type: Boolean, default: false },
    ipAddress: String,
  },
  { timestamps: true }
);

export default mongoose.model("Message", messageSchema);