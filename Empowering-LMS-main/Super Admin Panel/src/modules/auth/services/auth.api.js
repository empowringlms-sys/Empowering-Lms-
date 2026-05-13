import axios from "axios";

// Get base URL from environment with fallback
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

// Create axios instance with proper configuration
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
   
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
   
    return response;
  },
  (error) => {
    console.error('API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message,
      response: error.response?.data
    });
    
    // Handle 401 Unauthorized - redirect to login
    if (error.response?.status === 401) {
      console.warn('Authentication failed, redirecting to login...');
      // Optional: Clear any local storage
      localStorage.removeItem('admin_token');
      // Redirect to login page
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// Debug function to check cookies
export const debugCookies = async () => {
  try {
    const response = await api.get('/api/debug/cookies');
    
    return response.data;
  } catch (error) {
    console.error('Debug Cookies Error:', error);
  }
};

// Debug function to set test cookie
export const setTestCookie = async () => {
  try {
    const response = await api.post('/api/debug/set-cookie');
    return response.data;
  } catch (error) {
    console.error('Set Test Cookie Error:', error);
  }
};

// Auth APIs
export const loginAdmin = (data) => api.post("/api/admin/login", data);
export const logoutAdmin = () => api.post("/api/admin/logout");
export const getCurrentAdmin = () => api.get("/api/admin/me");

export default api;