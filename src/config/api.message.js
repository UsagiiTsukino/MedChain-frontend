import axios from './axios-customize';

// Get messages for an appointment
export const callGetMessages = (appointmentId) => {
  return axios.get(`/messages/appointment/${appointmentId}`);
};

// Send a message
export const callSendMessage = (data) => {
  return axios.post('/messages', data);
};

// Mark messages as read
export const callMarkMessagesAsRead = (appointmentId, otherUserId) => {
  return axios.put(
    `/messages/appointment/${appointmentId}/read?otherUserId=${otherUserId}`
  );
};

// Get unread message count
export const callGetUnreadCount = () => {
  return axios.get('/messages/unread-count');
};

// Get unread count for specific appointment
export const callGetUnreadCountByAppointment = (appointmentId) => {
  return axios.get(`/messages/appointment/${appointmentId}/unread-count`);
};

// Get all conversations
export const callGetConversations = () => {
  return axios.get('/messages/conversations');
};
