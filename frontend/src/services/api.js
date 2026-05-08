import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// PDF upload — extract text + detect topics
export const uploadPdf = (file) => {
  const fd = new FormData();
  fd.append('file', file);
  return api.post('/upload-pdf', fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// Generate exam preparation plan
export const generatePlan = (data) => api.post('/generate-plan', data);

// AI chatbot — context-aware conversation
export const chatWithBot = (messages, subject, examDate, mode, topics, questionsContext) =>
  api.post('/chat', { messages, subject, examDate, mode, topics, questionsContext });

// Analytics — get platform stats
export const getAnalytics = () => api.get('/analytics');

// Analytics — track an event
export const trackEvent = (eventType) =>
  api.post(`/analytics/track?event_type=${encodeURIComponent(eventType)}`);

export default api;
