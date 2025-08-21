// import axios from "axios";
// import { toast } from "sonner";

// const baseURL = "http://127.0.0.1:8000/api";

// // For authenticated requests
// const api = axios.create({
//   baseURL,
// });

// // For public requests that don't need authentication
// export const publicApi = axios.create({
//   baseURL,
// });

// // Interceptor to add the token to every request for the authenticated instance
// api.interceptors.request.use(
//   (config) => {
//     const token = sessionStorage.getItem("access_token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Interceptor to handle expired tokens for the authenticated instance
// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     if (error.response && error.response.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       try {
//         const refreshToken = sessionStorage.getItem("refresh_token");
//         if (!refreshToken) {
//           window.location.href = '/login';
//           return Promise.reject(error);
//         }

//         // Use the publicApi instance to refresh the token
//         const response = await publicApi.post('/users/token/refresh/', {
//           refresh: refreshToken,
//         });

//         const { access, refresh } = response.data;

//         sessionStorage.setItem("access_token", access);
//         if (refresh) {
//           sessionStorage.setItem("refresh_token", refresh);
//         }

//         originalRequest.headers.Authorization = `Bearer ${access}`;
//         return api(originalRequest);

//       } catch (refreshError) {
//         sessionStorage.removeItem("access_token");
//         sessionStorage.removeItem("refresh_token");
//         toast.error("Session expired.", { description: "Please log in again." });
//         window.location.href = '/login';
//         return Promise.reject(refreshError);
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// export default api;


import axios from "axios";
import { toast } from "sonner";

const baseURL = "http://127.0.0.1:8000/api";

// For authenticated requests
const api = axios.create({
  baseURL,
});

// For public requests that don't need authentication
export const publicApi = axios.create({
  baseURL,
});

// This function will set the Authorization header directly
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// Interceptor to add the token to every request for the authenticated instance
api.interceptors.request.use(
  (config) => {
    // This interceptor will now be a fallback; the header should be set manually on login.
    const token = sessionStorage.getItem("access_token");
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor to handle expired tokens for the authenticated instance
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = sessionStorage.getItem("refresh_token");
        if (!refreshToken) {
          window.location.href = '/login';
          return Promise.reject(error);
        }

        const response = await publicApi.post('/users/token/refresh/', {
          refresh: refreshToken,
        });

        const { access, refresh } = response.data;

        sessionStorage.setItem("access_token", access);
        setAuthToken(access); // Immediately set the new token
        
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

    return Promise.reject(error);
  }
);

export default api;