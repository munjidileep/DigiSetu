// Centralized Axios instance with credentials support
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Include session cookies
});

// Request interceptor to set Content-Type for JSON requests only
api.interceptors.request.use((config) => {
  // Only set Content-Type to JSON if no Content-Type is specified
  // and the data is not FormData (which needs multipart/form-data)
  if (!config.headers['Content-Type'] && !(config.data instanceof FormData)) {
    config.headers['Content-Type'] = 'application/json';
  }
  return config;
});

// Global error handler
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;
