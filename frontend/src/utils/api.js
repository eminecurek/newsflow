import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// İstek interceptor'u - token ekle
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('newsflow_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Yanıt interceptor'u - hata yönetimi
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('newsflow_token');
      localStorage.removeItem('newsflow_user');
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
};

// News API
export const newsAPI = {
  getNews: (params) => api.get('/news', { params }),
  getFeed: (params) => api.get('/news/feed', { params }),
  getCategories: () => api.get('/news/categories'),
};

// User API
export const userAPI = {
  updatePreferences: (data) => api.put('/user/preferences', data),
  getSaved: () => api.get('/user/saved'),
  saveArticle: (data) => api.post('/user/saved', data),
  removeSaved: (articleId) => api.delete('/user/saved', { data: { articleId } }),
  changePassword: (data) => api.put('/user/password', data),
};

export default api;
