// src/api/axiosClient.js
import axios from "axios";

const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

const axiosClient = axios.create({
  baseURL: baseUrl,
  timeout: 10000, // 10 seconds timeout
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

axiosClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      // network error
      console.error("Network error - make sure API is running");
    } else if (error.response.status === 401) {
      console.warn("Unauthorized! Redirect to login.");
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
