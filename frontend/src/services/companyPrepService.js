import api from './api';

export const companyPrepService = {
  async getPattern(companySlug) {
    const response = await api.get(`/company-prep/${encodeURIComponent(companySlug)}`);
    return response.data;
  },
};
