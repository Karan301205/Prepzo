import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  headers: { 'Content-Type': 'application/json' },
});


export const uploadPdf = (file) => {
  const fd = new FormData();
  fd.append('file', file);
  return api.post('/upload-pdf', fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const generatePlan = (data) => api.post('/generate-plan', data);

export const chatWithBot = (messages, subject, examDate, mode, topics, questionsContext) =>
  api.post('/chat', { messages, subject, examDate, mode, topics, questionsContext });

export default api;
