import cloudinary from "../config/cloudinary.js";

// Delete a single file from cloudinary by URL
export const deleteFromCloudinary = async (url) => {
  if (!url) return;
  try {
    // Extract public_id from cloudinary URL
    // URL format: https://res.cloudinary.com/<cloud>/image/upload/v123456/portfolio/filename.jpg
    const parts = url.split("/");
    const folderAndFile = parts.slice(parts.indexOf("portfolio")).join("/");
    const publicId = folderAndFile.replace(/\.[^/.]+$/, ""); // remove extension

    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Cloudinary delete error:", error.message);
  }
};

// Delete multiple files from cloudinary
export const deleteMultipleFromCloudinary = async (urls = []) => {
  if (!urls.length) return;
  const deletePromises = urls.map((url) => deleteFromCloudinary(url));
  await Promise.allSettled(deletePromises);
};

// Get optimized image URL with transformations
export const getOptimizedUrl = (url, options = {}) => {
  if (!url) return "";
  const {
    width = 800,
    height,
    quality = "auto",
    format = "auto",
    crop = "fill",
  } = options;

  // Insert transformation into cloudinary URL
  const uploadIndex = url.indexOf("/upload/") + "/upload/".length;
  const base = url.slice(0, uploadIndex);
  const rest = url.slice(uploadIndex);

  const transforms = [
    `w_${width}`,
    height ? `h_${height}` : null,
    `c_${crop}`,
    `q_${quality}`,
    `f_${format}`,
  ]
    .filter(Boolean)
    .join(",");

  return `${base}${transforms}/${rest}`;
};

// Get thumbnail URL (small version of image)
export const getThumbnailUrl = (url) => {
  return getOptimizedUrl(url, { width: 400, height: 300, crop: "fill" });
};