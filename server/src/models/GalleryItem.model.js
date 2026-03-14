import mongoose from "mongoose";

const galleryItemSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    mediaType: {
      type: String,
      enum: ["image", "video", "gif"],
      default: "image",
    },
    mediaUrl: { type: String, required: true },
    thumbnail: String,
    category: String,
    tags: [String],
    altText: String,
    hoverText: String,
    lightboxEnabled: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
    stats: {
      views: { type: Number, default: 0 },
      likes: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

export default mongoose.model("GalleryItem", galleryItemSchema);