// src/api/axios.js

import axios from 'axios';
import { message } from 'antd';

// Base API configuration
const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        message.error('Session expired. Please login again.');
      }
      return Promise.reject(error.response.data);
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  login: (credentials) => api.post('/api/auth/login', credentials),
  signup: (userData) => api.post('/api/auth/signup', userData),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },
};

// Todo APIs
export const todoAPI = {
  getAllTodos: () => api.get('/api/todos'),
  getTodoById: (id) => api.get(`/api/todos/${id}`),
  createTodo: (todo) => api.post('/api/todos', todo),
  updateTodo: (id, todo) => api.put(`/api/todos/${id}`, todo),
  deleteTodo: (id) => api.delete(`/api/todos/${id}`),
};

export default api;