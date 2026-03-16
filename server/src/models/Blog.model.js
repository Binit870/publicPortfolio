import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, unique: true },
    excerpt: String,
    content: { type: String, required: true },
    coverImage: String,
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: String,
    tags: [String],
    series: {
      seriesId: mongoose.Schema.Types.ObjectId,
      seriesTitle: String,
      partNumber: Number,
    },
    seo: {
      metaTitle: String,
      metaDescription: String,
      keywords: [String],
    },
    images: [String],
    codeSnippets: [
      {
        language: String,
        code: String,
      },
    ],
    stats: {
      views: { type: Number, default: 0 },
      likes: { type: Number, default: 0 },
      bookmarks: { type: Number, default: 0 },
      shares: { type: Number, default: 0 },
    },
    readingTime: Number,
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    allowComments: { type: Boolean, default: true },
    relatedPosts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Blog",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Blog", blogSchema);