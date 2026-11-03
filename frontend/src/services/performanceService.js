import api from './api';

export const performanceService = {
  async getPerformance() {
    const res = await api.get('/performance');
    return res.data;
  },

  async getDailyPlan() {
    const res = await api.get('/recommendations/daily');
    return res.data;
  },

  async getCodingProblems() {
    const res = await api.get('/coding/problems');
    return res.data;
  },

  async getInterviewQuestions(category = 'All') {
    const res = await api.get(`/interview/questions${category !== 'All' ? `?category=${category}` : ''}`);
    return res.data;
  },

  async askAssistant(message) {
    const res = await api.post('/assistant/chat', { message });
    return res.data;
  }
};
