import { z } from "zod";

export const createGallerySchema = z.object({
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  layoutType: z.enum(["grid", "masonry", "carousel", "bento", "horizontal-scroll"]).optional(),
  allowFilter: z.boolean().optional(),
  sectionOrder: z.number().optional(),
  isActive: z.boolean().optional(),
});

export const updateGallerySchema = createGallerySchema.partial();

export const createGalleryItemSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  mediaType: z.enum(["image", "video", "gif"]).optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  altText: z.string().optional(),
  hoverText: z.string().optional(),
  lightboxEnabled: z.boolean().optional(),
  order: z.number().optional(),
  galleryId: z.string().optional(),
});

export const updateGalleryItemSchema = createGalleryItemSchema.partial();