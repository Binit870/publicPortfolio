import { z } from "zod";

export const createEventSchema = z.object({
  title: z.string().min(3, "Title is required"),
  subtitle: z.string().optional(),
  overview: z.string().optional(),
  description: z.string().optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  eventMode: z.enum(["Online", "Offline", "Hybrid"]).optional(),
  dateTime: z.object({
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    timezone: z.string().optional(),
  }).optional(),
  registration: z.object({
    isFree: z.boolean().optional(),
    price: z.number().optional(),
    currency: z.string().optional(),
    maxAttendees: z.number().optional(),
  }).optional(),
  location: z.object({
    venue: z.string().optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    country: z.string().optional(),
    meetingLink: z.string().optional(),
    mapLink: z.string().optional(),
  }).optional(),
  status: z.enum(["Draft", "Published", "Cancelled", "Completed"]).optional(),
});

export const updateEventSchema = createEventSchema.partial();