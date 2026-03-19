import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || '/api';

const api = axios.create({ baseURL: API_BASE });

api.interceptors.request.use(config => {
  const token = localStorage.getItem('mindwell_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('mindwell_token');
      localStorage.removeItem('mindwell_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
};

export const moodAPI = {
  log: (data) => api.post('/mood', data),
  history: (period = 'week') => api.get(`/mood/history?period=${period}`),
  delete: (id) => api.delete(`/mood/${id}`),
};

export const chatAPI = {
  send: (data) => api.post('/chat', data),
  history: () => api.get('/chat/history'),
  deleteSession: (id) => api.delete(`/chat/${id}`),
};

export const profileAPI = {
  get: () => api.get('/profile'),
  update: (data) => api.put('/profile', data),
  changePassword: (data) => api.put('/profile/password', data),
  delete: () => api.delete('/profile'),
};

export default api;
