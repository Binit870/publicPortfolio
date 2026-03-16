import mongoose from "mongoose";

const gallerySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    subtitle: String,
    description: String,
    layoutType: {
      type: String,
      enum: ["grid", "masonry", "carousel", "bento", "horizontal-scroll"],
      default: "grid",
    },
    allowFilter: { type: Boolean, default: true },
    categories: [
      {
        name: String,
        slug: String,
      },
    ],
    items: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "GalleryItem",
      },
    ],
    sectionOrder: Number,
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Gallery", gallerySchema);