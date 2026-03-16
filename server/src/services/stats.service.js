import Event from "../models/Event.model.js";
import Blog from "../models/Blog.model.js";
import GalleryItem from "../models/GalleryItem.model.js";

export const incrementViews = async (model, id) => {
  const models = { event: Event, blog: Blog, galleryItem: GalleryItem };
  await models[model]?.findByIdAndUpdate(id, { $inc: { "stats.views": 1 } });
};