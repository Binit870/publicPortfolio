import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    siteName: { type: String, default: "" },
    siteTagline: { type: String, default: "" },
    siteLogo: { type: String, default: "" },
    favicon: { type: String, default: "" },
    seo: {
      metaTitle: String,
      metaDescription: String,
      keywords: [String],
      ogImage: String,
    },
    maintenanceMode: { type: Boolean, default: false },
    allowComments: { type: Boolean, default: true },
    allowContactForm: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Settings", settingsSchema);