import mongoose from "mongoose";

const galleryCollectionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, unique: true },
    galleries: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Gallery",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("GalleryCollection", galleryCollectionSchema);