import axios from 'axios';

// Get Base URL
const getBaseUrl = () => {
    let url = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
    if (url.endsWith("/")) url = url.slice(0, -1);
    if (!url.endsWith("/api")) url += "/api";
    return url;
};

const api = axios.create({
    baseURL: getBaseUrl(),
    headers: {
        'Content-Type': 'application/json',
        'x-portal': 'super-admin',
    },
    withCredentials: true,
});

// Add request interceptor to attach Bearer token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("super_admin_token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const getAllCompanies = () => api.get('/super-admin/companies');
export const getCompanyDetails = (companyId) => api.get(`/super-admin/companies/${companyId}`);
export const toggleCompanyAccess = (companyId) => api.patch(`/super-admin/companies/${companyId}/access`);

export default api;
