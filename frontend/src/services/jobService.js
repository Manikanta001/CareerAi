import api from './api';

export const jobService = {
  async getAllJobs() {
    const res = await api.get('/jobs');
    return res.data;
  },

  async getRecommendedJobs() {
    const res = await api.get('/jobs/recommended');
    return res.data;
  },

  async getJobById(id) {
    const res = await api.get(`/jobs/${id}`);
    return res.data;
  }
};
