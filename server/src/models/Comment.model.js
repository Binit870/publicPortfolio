import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    blogId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    guestName: String,
    guestEmail: String,
    content: { type: String, required: true },
    isApproved: { type: Boolean, default: false },
    replies: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        guestName: String,
        content: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Comment", commentSchema);