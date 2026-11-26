import api from './api';

export const authService = {
  async register(name, email, password) {
    const res = await api.post('/auth/register', { name, email, password });
    if (res.data?.access_token) {
      localStorage.setItem('careerai_token', res.data.access_token);
      localStorage.setItem('careerai_user', JSON.stringify(res.data.user));
    }
    return res.data;
  },

  async login(email, password) {
    const res = await api.post('/auth/login', { email, password });
    if (res.data?.access_token) {
      localStorage.setItem('careerai_token', res.data.access_token);
      localStorage.setItem('careerai_user', JSON.stringify(res.data.user));
    }
    return res.data;
  },

  logout() {
    localStorage.removeItem('careerai_token');
    localStorage.removeItem('careerai_user');
  },

  getCurrentUserFromStorage() {
    const userStr = localStorage.getItem('careerai_user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      localStorage.removeItem('careerai_user');
      return null;
    }
  },

  async fetchMe() {
    const res = await api.get('/auth/me');
    return res.data;
  },

  async getProfile() {
    const res = await api.get('/profile');
    return res.data;
  },

  async updateProfile(profileData) {
    const res = await api.put('/profile', profileData);
    return res.data;
  }
};
