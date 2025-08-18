import axios from "axios";
import { toast } from "sonner";

const api = axios.create({
  // --- THIS IS THE FIX ---
  baseURL: "http://127.0.0.1:8000/api", 
});

// Interceptor to add the token to every request
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor to handle expired tokens
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // --- ADD A CHECK FOR error.response ---
    // This prevents the TypeError on network errors
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = sessionStorage.getItem("refresh_token");
        if (!refreshToken) {
          window.location.href = '/login';
          return Promise.reject(error);
        }

        const response = await axios.post('http://127.0.0.1:8000/api/users/token/refresh/', {
          refresh: refreshToken,
        });

        const { access, refresh } = response.data;

        sessionStorage.setItem("access_token", access);
        if (refresh) {
          sessionStorage.setItem("refresh_token", refresh);
        }

        originalRequest.headers.Authorization = `Bearer ${access}`;
        return api(originalRequest);

      } catch (refreshError) {
        sessionStorage.removeItem("access_token");
        sessionStorage.removeItem("refresh_token");
        toast.error("Session expired.", { description: "Please log in again." });
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // If it's not a 401 or if there's no response (network error), reject the promise
    return Promise.reject(error);
  }
);

export default api;