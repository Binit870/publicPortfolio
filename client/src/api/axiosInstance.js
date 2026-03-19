import axios from "axios";

const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || ""}/api`,
  withCredentials: true, // ✅ sends httpOnly cookies (refreshToken) automatically
});

// ── Request interceptor — attach accessToken from localStorage ──────────────
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Response interceptor — auto-refresh on 401 ──────────────────────────────
let isRefreshing = false;
let failedQueue = []; // queue requests that came in while refresh was in progress

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

API.interceptors.response.use(
  (response) => response, // pass through successful responses

  async (error) => {
    const originalRequest = error.config;

    // Only attempt refresh on 401, and never retry the refresh call itself
    const is401 = error.response?.status === 401;
    const isRefreshCall = originalRequest.url?.includes("/auth/refresh-token");
    const alreadyRetried = originalRequest._retry;

    if (!is401 || isRefreshCall || alreadyRetried) {
      return Promise.reject(error);
    }

    // If a refresh is already in progress, queue this request
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return API(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    // Mark this request so we don't retry it again
    originalRequest._retry = true;
    isRefreshing = true;

    try {
      // POST /api/auth/refresh-token
      // withCredentials sends the httpOnly refreshToken cookie automatically
      const { data } = await API.post("/auth/refresh-token");
      const newAccessToken = data.data.accessToken;

      // Persist new access token
      localStorage.setItem("accessToken", newAccessToken);

      // Update default header for future requests
      API.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;

      // Retry all queued requests with the new token
      processQueue(null, newAccessToken);

      // Retry the original failed request
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return API(originalRequest);
    } catch (refreshError) {
      // Refresh failed — clear session and redirect to login
      processQueue(refreshError, null);
      localStorage.removeItem("accessToken");

      // Redirect to login page — adjust path to match your router
      window.location.href = "/login";

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default API;