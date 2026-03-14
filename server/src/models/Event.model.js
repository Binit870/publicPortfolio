import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    subtitle: String,
    overview: String,
    description: String,
    bannerImage: String,
    coverImage: String,
    category: String,
    tags: [String],
    eventMode: {
      type: String,
      enum: ["Online", "Offline", "Hybrid"],
      default: "Online",
    },
    dateTime: {
      startDate: Date,
      endDate: Date,
      timezone: String,
    },
    registration: {
      isFree: { type: Boolean, default: true },
      price: { type: Number, default: 0 },
      currency: { type: String, default: "USD" },
      registrationDeadline: Date,
      maxAttendees: Number,
    },
    highlights: {
      duration: String,
      mode: String,
    },
    location: {
      venue: String,
      address: String,
      city: String,
      country: String,
      meetingLink: String,
      mapLink: String,
    },
    agenda: [
      {
        startTime: String,
        endTime: String,
        title: String,
        description: String,
      },
    ],
    organizer: {
      name: String,
      organization: String,
      logo: String,
      bio: String,
      email: String,
      website: String,
      followers: Number,
      eventsHosted: Number,
    },
    speakers: [
      {
        name: String,
        photo: String,
        designation: String,
        bio: String,
      },
    ],
    gallery: [String],
    attendees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    status: {
      type: String,
      enum: ["Draft", "Published", "Cancelled", "Completed"],
      default: "Draft",
    },
    stats: {
      views: { type: Number, default: 0 },
      registrations: { type: Number, default: 0 },
      likes: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

export default mongoose.model("Event", eventSchema);