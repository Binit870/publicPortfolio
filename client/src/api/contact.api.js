import API from "./axiosInstance";

// PUBLIC
export const getContactPageApi = async () => {
  const { data } = await API.get("/contact");
  return data;
};

export const submitContactFormApi = async (formData) => {
  const { data } = await API.post("/contact/submit", formData);
  return data;
};

// ADMIN
export const getContactPageAdminApi = async () => {
  const { data } = await API.get("/admin/settings/contact-page");
  return data;
};

export const updateContactPageAdminApi = async (updateData) => {
  const { data } = await API.patch("/admin/settings/contact-page", updateData);
  return data;
};