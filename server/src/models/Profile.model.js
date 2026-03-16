import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    // HOME PAGE
    home: {
      heroImage: String,
      name: { type: String, default: "" },
      title: { type: String, default: "" },
      tagline: { type: String, default: "" },
      aboutPreview: {
        image: String,
        shortIntro: String,
      },
    },
    // ABOUT PAGE
    about: {
      profileImage: String,
      name: { type: String, default: "" },
      title: { type: String, default: "" },
      biography: { type: String, default: "" },
      achievements: [
        {
          title: String,
          description: String,
          year: String,
        },
      ],
      vision: { type: String, default: "" },
      goals: { type: String, default: "" },
    },
    // SOCIAL LINKS (used in footer and about)
    socialLinks: {
      twitter: { type: String, default: "" },
      github: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      instagram: { type: String, default: "" },
      website: { type: String, default: "" },
    },
    // FOOTER
    footer: {
      contactEmail: String,
      contactPhone: String,
      address: String,
      copyrightText: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

export default mongoose.model("Profile", profileSchema);