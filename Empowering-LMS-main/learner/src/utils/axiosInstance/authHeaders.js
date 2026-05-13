// src/utils/authHeaders.js
export const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  
  if (!token) {
    console.warn('No auth token found');
    return {};
  }
  
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

export const getAuthHeadersWithContentType = (contentType = 'application/json') => {
  const token = localStorage.getItem('authToken');
  
  if (!token) {
    console.warn('No auth token found');
    return {
      'Content-Type': contentType,
    };
  }
  
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': contentType,
  };
};

export const getToken = () => {
  return localStorage.getItem('authToken');
};

export const isLogin = () => {
  return !!localStorage.getItem('authToken');
};