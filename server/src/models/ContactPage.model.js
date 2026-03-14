import mongoose from "mongoose";

const contactPageSchema = new mongoose.Schema(
  {
    pageHeader: {
      title: { type: String, default: "Contact Us" },
      subtitle: String,
    },
    contactForm: {
      fields: {
        firstName: { label: String, placeholder: String, required: Boolean },
        lastName: { label: String, placeholder: String, required: Boolean },
        workEmail: { label: String, placeholder: String, required: Boolean },
        company: { label: String, placeholder: String },
        message: { label: String, placeholder: String },
      },
      newsletterCheckbox: { label: String },
      submitButtonText: { type: String, default: "Submit" },
      privacyPolicyText: String,
      privacyPolicyLink: String,
    },
    features: [
      {
        icon: String,
        title: String,
        description: String,
      },
    ],
    clients: [
      {
        name: String,
        logo: String,
        website: String,
      },
    ],
    popularLinksSection: {
      title: { type: String, default: "Looking for something else?" },
      description: String,
      links: [
        {
          icon: String,
          title: String,
          description: String,
          link: String,
        },
      ],
    },
    generalContact: {
      email: String,
      supportPortal: String,
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("ContactPage", contactPageSchema);