import API from "./axiosInstance";
import { buildQueryString } from "../utils/buildQueryString";

// PUBLIC
export const getPublishedEventsApi = async (params = {}) => {
  const { data } = await API.get(`/events${buildQueryString(params)}`);
  return data;
};

export const getEventByIdApi = async (id) => {
  const { data } = await API.get(`/events/${id}`);
  return data;
};

// ADMIN
export const getAllEventsAdminApi = async (params = {}) => {
  const { data } = await API.get(`/admin/events${buildQueryString(params)}`);
  return data;
};

export const createEventApi = async (formData) => {
  const { data } = await API.post("/admin/events", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const updateEventApi = async (id, formData) => {
  const { data } = await API.patch(`/admin/events/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const deleteEventApi = async (id) => {
  const { data } = await API.delete(`/admin/events/${id}`);
  return data;
};

export const updateEventStatusApi = async (id, status) => {
  const { data } = await API.patch(`/admin/events/${id}/status`, { status });
  return data;
};