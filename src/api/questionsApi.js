import api from './api.js';

export const questionsApi = {
  key: 'questions',
  create: async (question) => {
    const { data } = await api.post('/questions', question);

    return data;
  },
  fetch: async () => {
    const { data } = await api.get('/questions');

    return data;
  },
  edit: async (question) => {
    const { data } = await api.patch(`/questions/${question.id}`, question);

    return data;
  },
  delete: async (id) => {
    const { data } = await api.delete(`/questions/${id}`);

    return data;
  },
  sse: () => {
    return new EventSource(`${import.meta.env.VITE_BASE_API_URL}/questions/sse`);
  },
};
