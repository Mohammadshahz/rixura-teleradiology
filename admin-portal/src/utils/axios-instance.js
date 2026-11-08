import axios from "axios";
import { store } from "../store";
import { logout } from "../store/auth.slice";

// Base instance
const axiosInstance = axios.create();

// Request Interceptor to attach token
axiosInstance.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => response, // success, just return response
  (error) => {
    const status = error?.response?.status;

    if (status === 401) {
      store.dispatch(logout());

      // Optional: redirect to login
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
