import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// For iOS Simulator use localhost
// For physical iPhone/iPad use your Mac's IP address
const API_URL = 'http://192.168.8.132:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Add token to requests
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const login = (credentials) => api.post('/auth/login', credentials);
export const register = (userData) => api.post('/auth/register', userData);

// Drivers
export const getAllDrivers = () => api.get('/drivers');
export const registerDriver = (driverData) => api.post('/drivers/register', driverData);

// Notifications
export const getAllNotifications = () => api.get('/notifications');
export const sendNotification = (notificationData) => api.post('/notifications/send', notificationData);

// Users
export const updateUserChildren = (userId, children) => api.put(`/auth/users/${userId}/children`, { children });

// Students
export const getAllStudents = () => api.get('/students');
export const getStudentsByDriver = (driverId) => api.get(`/students/driver/${driverId}`);

export default api;
