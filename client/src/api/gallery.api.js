import API from "./axiosInstance";
import { buildQueryString } from "../utils/buildQueryString";

// PUBLIC
export const getGalleriesApi = async () => {
  const { data } = await API.get("/gallery");
  return data;
};

export const getGalleryByIdApi = async (id) => {
  const { data } = await API.get(`/gallery/${id}`);
  return data;
};

export const getGalleryItemsApi = async (params = {}) => {
  const { data } = await API.get(`/gallery/items${buildQueryString(params)}`);
  return data;
};

// ADMIN
export const createGalleryApi = async (galleryData) => {
  const { data } = await API.post("/admin/gallery", galleryData);
  return data;
};

export const updateGalleryApi = async (id, galleryData) => {
  const { data } = await API.patch(`/admin/gallery/${id}`, galleryData);
  return data;
};

export const deleteGalleryApi = async (id) => {
  const { data } = await API.delete(`/admin/gallery/${id}`);
  return data;
};

export const addGalleryItemApi = async (formData) => {
  const { data } = await API.post("/admin/gallery/items", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const updateGalleryItemApi = async (id, formData) => {
  const { data } = await API.patch(`/admin/gallery/items/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const deleteGalleryItemApi = async (id) => {
  const { data } = await API.delete(`/admin/gallery/items/${id}`);
  return data;
};

export const getAllGalleryItemsAdminApi = async (params = {}) => {
  const { data } = await API.get(`/gallery/items${buildQueryString(params)}`);
  return data;
};