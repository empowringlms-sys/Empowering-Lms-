// src/services/courseApi.js
import axios from 'axios';

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api`;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'x-portal': 'company', // Explicitly identify Company Portal
  },
});

// Add request interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("admin_token");
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