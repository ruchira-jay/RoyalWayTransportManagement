import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const login = (credentials) => api.post('/auth/admin/login', credentials);
export const register = (userData) => api.post('/auth/register', userData);

// Drivers - Connected to backend
export const getAllDrivers = () => api.get('/drivers');
export const approveDriver = (id) => api.put(`/drivers/approve/${id}`);
export const rejectDriver = (id) => api.put(`/drivers/reject/${id}`);

// Notifications
export const getAllNotifications = () => api.get('/notifications');
export const markAsRead = (id) => api.put(`/notifications/read/${id}`);

export default api;
