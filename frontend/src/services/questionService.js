import api from './api';

export const questionService = {
  async getQuestions(subject = 'All', topic = 'All', difficulty = 'All') {
    const params = new URLSearchParams();
    if (subject && subject !== 'All') params.append('subject', subject);
    if (topic && topic !== 'All') params.append('topic', topic);
    if (difficulty && difficulty !== 'All') params.append('difficulty', difficulty);
    const res = await api.get(`/questions?${params.toString()}`);
    return res.data;
  },

  async getSubjects() {
    const res = await api.get('/subjects');
    return res.data;
  },

  async getSubjectTopics(subjectId) {
    const res = await api.get(`/subjects/${subjectId}/topics`);
    return res.data;
  },

  async getLesson(lessonId) {
    const res = await api.get(`/lessons/${lessonId}`);
    return res.data;
  }
};
