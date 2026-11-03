import api from './api';

export const testService = {
  async getMockTests() {
    const res = await api.get('/tests');
    return res.data;
  },

  async getTestDetails(testId) {
    const res = await api.get(`/tests/${testId}`);
    return res.data;
  },

  async submitTest(testId, answers, timeTakenSeconds) {
    const res = await api.post(`/tests/${testId}/submit`, {
      test_id: testId,
      time_taken_seconds: timeTakenSeconds,
      answers
    });
    return res.data;
  },

  async getAttemptHistory() {
    const res = await api.get('/tests/attempts/history');
    return res.data;
  }
};
