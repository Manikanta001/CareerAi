import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach Bearer token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('careerai_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 unauth
api.interceptors.response.use(
  // Keep Axios's response shape while removing the backend's `{success,
  // message, data}` envelope so all services consistently consume `data`.
  (response) => {
    const payload = response.data;
    if (payload && typeof payload === 'object' && 'success' in payload && 'data' in payload) {
      return { ...response, data: payload.data };
    }
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('careerai_token');
      localStorage.removeItem('careerai_user');
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        window.location.href = '/login';
      }
    }
    const detail = error.response?.data?.detail || error.response?.data?.message;
    const errorMsg = Array.isArray(detail)
      ? detail.map((item) => item?.msg || String(item)).join('; ')
      : typeof detail === 'string'
        ? detail
        : error.message || 'API request failed';
    return Promise.reject(new Error(errorMsg));
  }
);

export default api;
