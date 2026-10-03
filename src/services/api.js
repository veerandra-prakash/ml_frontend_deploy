import axios from 'axios';

// Node.js Express Backend Base URL configured via environment variable
const baseURL = import.meta.env.VITE_API_URL || '/api';

const API = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request Interceptor: Attach JWT Token from localStorage
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('insurewise_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response Interceptor: Handle HTTP 401 Unauthorized globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token if expired or invalid
      localStorage.removeItem('insurewise_token');
      localStorage.removeItem('insurewise_user');
    }
    return Promise.reject(error);
  }
);

export default API;
