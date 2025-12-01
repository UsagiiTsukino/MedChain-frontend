import axios from './axios-customize';

export const callChatWithAI = (message, context) => {
  return axios.post('/ai-chatbot/chat', {
    message,
    context,
  });
};

export const callGetAIContext = () => {
  return axios.get('/ai-chatbot/context');
};

export const callClearAISession = (sessionId) => {
  return axios.delete(`/ai-chatbot/session/${sessionId}`);
};
