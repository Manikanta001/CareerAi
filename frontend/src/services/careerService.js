import api from './api';

export const careerService = {
  async getAllCareers() {
    const res = await api.get('/careers');
    return res.data;
  },

  async getRecommendedCareers() {
    const res = await api.get('/careers/recommended');
    return res.data;
  },

  async getCareerById(id) {
    const res = await api.get(`/careers/${id}`);
    return res.data;
  },

  async getSkillGaps(targetCareer = '') {
    const res = await api.get(`/skills/gaps${targetCareer ? `?target_career=${encodeURIComponent(targetCareer)}` : ''}`);
    return res.data;
  }
};
