import api from './api';

export const questionService = {
  async getQuestions(subject = 'All', topic = 'All', difficulty = 'All', company = 'All') {
    const params = new URLSearchParams();
    if (subject && subject !== 'All') params.append('subject', subject);
    if (topic && topic !== 'All') params.append('topic', topic);
    if (difficulty && difficulty !== 'All') params.append('difficulty', difficulty);
    if (company && company !== 'All') params.append('company', company);
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

  async getTopicLessons(topicId) {
    const res = await api.get(`/topics/${topicId}/lessons`);
    return res.data;
  },

  async getLesson(lessonId, topicId, topicTitle) {
    const params = new URLSearchParams();
    if (topicId) params.append('topic_id', topicId);
    if (topicTitle) params.append('topic_title', topicTitle);
    const query = params.toString();
    const res = await api.get(`/lessons/${lessonId}${query ? `?${query}` : ''}`);
    return res.data;
  }
};
