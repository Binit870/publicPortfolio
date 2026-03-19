import mongoose from "mongoose";
import connectDB from "../config/db.js";
import Event from "../models/Event.model.js";

const seed = async () => {
  await connectDB();

  const exists = await Event.findOne();
  if (exists) {
    console.log("Events already seeded");
    process.exit(0);
  }

  await Event.create({
    title: "Global Tech Summit 2026",
    subtitle: "Where Innovation Meets Opportunity — Join 2,000+ leaders shaping the future of technology.",
    overview: `The Global Tech Summit 2026 brings together the brightest minds in technology, innovation, and entrepreneurship for three days of immersive learning, networking, and collaboration.\n\nThis year's theme, "Building Tomorrow," explores how emerging technologies like AI, quantum computing, and sustainable tech are reshaping industries worldwide.`,
    description: "Three days of immersive learning, networking, and collaboration.",
    category: "Technology",
    tags: ["Technology", "AI", "Machine Learning", "Cloud Computing", "Startups", "Networking"],
    eventMode: "Hybrid",
    dateTime: {
      startDate: new Date("2026-03-28"),
      endDate: new Date("2026-03-30"),
      timezone: "PST (UTC-8)",
    },
    registration: {
      isFree: true,
      price: 0,
      registrationDeadline: new Date("2026-03-25"),
      maxAttendees: 2000,
    },
    highlights: {
      duration: "3 Days",
      mode: "Hybrid",
    },
    location: {
      venue: "Moscone Center",
      address: "747 Howard Street",
      city: "San Francisco",
      country: "United States",
      meetingLink: "https://meet.globaltechsummit.com/2026",
    },
    agenda: [
      { startTime: "9:00 AM", endTime: "9:30 AM", title: "Registration & Welcome Coffee", description: "Check in, grab your badge, and connect with fellow attendees." },
      { startTime: "9:30 AM", endTime: "10:30 AM", title: "Opening Keynote: Building Tomorrow", description: "Our headline speaker sets the vision for the future of technology." },
      { startTime: "10:45 AM", endTime: "12:00 PM", title: "Panel: AI in Enterprise", description: "Industry leaders discuss practical AI deployment strategies." },
      { startTime: "12:00 PM", endTime: "1:00 PM", title: "Networking Lunch", description: "Curated round-table discussions over a gourmet lunch experience." },
      { startTime: "1:00 PM", endTime: "2:30 PM", title: "Workshop: Hands-on with LLMs", description: "Build and deploy a production-ready AI application in 90 minutes." },
      { startTime: "4:00 PM", endTime: "5:00 PM", title: "Closing Keynote & Awards", description: "Celebrating innovation with our annual Tech Pioneer Awards ceremony." },
    ],
    speakers: [
      { name: "Dr. Sarah Chen", designation: "CTO, NovaTech AI", bio: "Leading AI researcher with 15+ years in machine learning.", photo: "" },
      { name: "Marcus Rivera", designation: "CEO, CloudScale", bio: "Serial entrepreneur who scaled three startups to $100M+ valuations.", photo: "" },
      { name: "Aisha Patel", designation: "VP Engineering, Quantum Labs", bio: "Quantum computing pioneer pushing the boundaries of computational physics.", photo: "" },
      { name: "James Okonkwo", designation: "Director of Innovation, TechCorp", bio: "Transforms enterprise R&D into market-leading products.", photo: "" },
    ],
    organizer: {
      name: "TechEvents Global",
      organization: "TechEvents Global Inc.",
      bio: "We produce world-class technology conferences that bring together innovators, investors, and industry leaders.",
      followers: 24500,
      eventsHosted: 54,
      website: "https://techevents.global",
    },
    gallery: [
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=600&h=400&fit=crop",
    ],
    status: "Published",
    stats: { views: 0, registrations: 0, likes: 0 },
  });

  console.log("Event seeded successfully");
  process.exit(0);
};

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});