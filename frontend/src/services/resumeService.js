import api from './api';

export const resumeService = {
  async uploadResume(file) {
    const formData = new FormData();
    formData.append('file', file);
    const res = await api.post('/resume/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  async getLatestAnalysis() {
    const res = await api.get('/resume');
    return res.data;
  },

  async getOnboardingStatus() {
    const res = await api.get('/resume/onboarding-status');
    return res.data;
  },

  async getOnboardingReport() {
    const res = await api.get('/resume/onboarding-report');
    return res.data;
  },

  async completeOnboarding() {
    const res = await api.post('/resume/onboarding-complete');
    return res.data;
  },

  async getLearningProgress() {
    const res = await api.get('/resume/learning-progress');
    return res.data;
  },

  async saveLearningProgress(completedSkills) {
    const res = await api.put('/resume/learning-progress', { completed_skills: completedSkills });
    return res.data;
  }
};
