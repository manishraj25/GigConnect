import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // Replace with your backend API URL
  headers: {
    "Content-Type": "application/json",
  },

  withCredentials: true, // Include cookies in requests
});

let inMemoryToken = null;

export const setInMemoryToken = (token) => {
  inMemoryToken = token;
  API.defaults.headers.common['Authorization'] = token ? `Bearer ${token}` : undefined;
};

export const clearInMemoryToken = () => {
  inMemoryToken = null;
  delete API.defaults.headers.common['Authorization'];
};

// Interceptor to prefer cookie auth; but if server expects Authorization header and we have in-memory token, add it
API.interceptors.request.use((config) => {
  if (!config.withCredentials && inMemoryToken) {
    config.headers.Authorization = `Bearer ${inMemoryToken}`;
  }
  return config;
}, (error) => Promise.reject(error));

export default api;