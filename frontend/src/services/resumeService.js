import api from './api';

export const resumeService = {
  async uploadResume(file) {
    const formData = new FormData();
    formData.append('file', file);
    const res = await api.post('/resume/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },

  async getLatestAnalysis() {
    const res = await api.get('/resume');
    return res.data;
  }
};
