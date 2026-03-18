import API from "./axiosInstance";
import { buildQueryString } from "../utils/buildQueryString";

// PUBLIC
export const getPublishedBlogsApi = async (params = {}) => {
  const { data } = await API.get(`/blogs${buildQueryString(params)}`);
  return data;
};

export const getBlogBySlugApi = async (slug) => {
  const { data } = await API.get(`/blogs/${slug}`);
  return data;
};

export const getBlogCommentsApi = async (blogId, params = {}) => {
  const { data } = await API.get(`/blogs/${blogId}/comments${buildQueryString(params)}`);
  return data;
};

export const submitCommentApi = async (blogId, commentData) => {
  const { data } = await API.post(`/blogs/${blogId}/comments`, commentData);
  return data;
};

// ADMIN
export const getAllBlogsAdminApi = async (params = {}) => {
  const { data } = await API.get(`/admin/blogs${buildQueryString(params)}`);
  return data;
};

export const createBlogApi = async (formData) => {
  const { data } = await API.post("/admin/blogs", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const updateBlogApi = async (id, formData) => {
  const { data } = await API.patch(`/admin/blogs/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const deleteBlogApi = async (id) => {
  const { data } = await API.delete(`/admin/blogs/${id}`);
  return data;
};

export const updateBlogStatusApi = async (id, status) => {
  const { data } = await API.patch(`/admin/blogs/${id}/status`, { status });
  return data;
};