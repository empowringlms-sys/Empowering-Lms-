// src/utils/axiosInstance.js
import axios from 'axios';
import { getAuthHeaders } from './authHeaders';

const axiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api` || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
axiosInstance.interceptors.request.use(
  (config) => {
    const authHeaders = getAuthHeaders();
    
    // Only add Authorization header if token exists
    if (authHeaders.Authorization) {
      config.headers.Authorization = authHeaders.Authorization;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle responses - DON'T auto-redirect
axiosInstance.interceptors.response.use(
  (response) => {
    return response.data || response;
  },
  (error) => {
    const { response } = error;
    
    if (response?.status === 401) {
      // Clear local storage only if it's an auth-related endpoint
      if (error.config.url.includes('/users/')) {
        localStorage.removeItem('authToken');
      }
    }
    
    // Return a consistent error format
    return Promise.reject({
      success: false,
      message: response?.data?.message || error.message || 'Something went wrong',
      status: response?.status,
      data: response?.data,
    });
  }
);

export default axiosInstance;