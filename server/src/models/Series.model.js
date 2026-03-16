import mongoose from "mongoose";

const seriesSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    blogs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Blog",
      },
    ],
    totalParts: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Series", seriesSchema);