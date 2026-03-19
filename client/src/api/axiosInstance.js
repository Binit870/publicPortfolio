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
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    const is401 = error.response?.status === 401;

    // ── SKIP LIST — never retry these routes ──
    const SKIP_URLS = [
      "/auth/refresh-token",
      "/auth/me",
      "/auth/login",
      "/auth/logout",
    ];
    const shouldSkip = SKIP_URLS.some((path) =>
      originalRequest.url?.includes(path)
    );
    const alreadyRetried = originalRequest._retry;

    if (!is401 || shouldSkip || alreadyRetried) {
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

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const { data } = await API.post("/auth/refresh-token");
      const newAccessToken = data.data.accessToken;

      localStorage.setItem("accessToken", newAccessToken);
      API.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
      processQueue(null, newAccessToken);

      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return API(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      localStorage.removeItem("accessToken");
      window.location.href = "/login";
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default API;