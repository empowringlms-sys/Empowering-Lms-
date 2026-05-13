import axios from 'axios';

// Helper to get base URL with /api suffix
const getBaseUrl = () => {
    let url = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
    // Remove trailing slash if present
    if (url.endsWith("/")) {
        url = url.slice(0, -1);
    }
    // Append /api if not present
    if (!url.endsWith("/api")) {
        url += "/api";
    }
    return url;
};

const api = axios.create({
    baseURL: getBaseUrl(),
    headers: {
        'Content-Type': 'application/json',
        'x-portal': 'super-admin', // Explicitly identify Super Admin Portal requests
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

// Course APIs
export const getCourseById = (courseId) => api.get(`/courses/${courseId}`);

// New: Get specific topic from course
export const getTopicById = (courseId, topicId) =>
    api.get(`/courses/${courseId}/topics/${topicId}`);

// Topic APIs
export const addTopic = (courseId, topicName) => api.post(`/courses/${courseId}/topics`, { topicName });
export const updateTopic = (courseId, topicId, data) => api.put(`/courses/${courseId}/topics/${topicId}`, data);
export const deleteTopic = (courseId, topicId) => api.delete(`/courses/${courseId}/topics/${topicId}`);
export const editTopicName = (courseId, topicId, topicName) => api.put(`/courses/${courseId}/edit-topic-name/${topicId}`, { topicName });

// **UPDATED: Unified Content API**
export const addContent = (courseId, topicId, contentData) =>
    api.post(`/courses/${courseId}/topics/${topicId}/content`, contentData);

export const updateContent = (courseId, topicId, contentId, contentData) =>
    api.put(`/courses/${courseId}/topics/${topicId}/content/${contentId}`, contentData);

export const deleteContent = (courseId, topicId, contentId) =>
    api.delete(`/courses/${courseId}/topics/${topicId}/content/${contentId}`);

export const reorderContent = (courseId, topicId, contentIds) =>
    api.put(`/courses/${courseId}/topics/${topicId}/reorder-content`, { contentIds });

// Topic reordering
export const reorderTopics = (courseId, topics) =>
    api.put(`/courses/${courseId}/reorder-topics`, { topics });

export default api;
