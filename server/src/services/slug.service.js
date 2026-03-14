import slugify from "slugify";
import Blog from "../models/Blog.model.js";

export const generateUniqueSlug = async (title) => {
  let slug = slugify(title, { lower: true, strict: true });
  let exists = await Blog.findOne({ slug });
  let counter = 1;
  while (exists) {
    slug = `${slug}-${counter}`;
    exists = await Blog.findOne({ slug });
    counter++;
  }
  return slug;
};