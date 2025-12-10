import axios from './axios-customize';

/**
 * Module Appointment
 */

export const callGetAppointment = (hash) => {
  return axios.get(`/appointments/${hash}`);
};

export const callCreateOrder = (orderData) => {
  return axios.post('/orders', orderData);
};

export const callGetOrder = () => {
  return axios.get('/orders');
};

export const callCreateBooking = (
  vaccineId,
  centerId,
  time,
  firstDoseDate,
  amount,
  doseSchedules,
  method
) => {
  return axios.post('/bookings', {
    vaccineId,
    centerId,
    time,
    firstDoseDate,
    amount,
    doseSchedules,
    method,
  });
};

export const callGetBooking = (bookingId) => {
  return axios.get(`/bookings/${bookingId}`);
};

export const updatePaymentPaypal = (bookingId, paymentId) => {
  return axios.post('/payments/paypal', {
    bookingId,
    paymentId,
  });
};

export const updatePaymentMetaMask = (paymentId, bookingId) => {
  return axios.post('/payments/meta-mask', {
    paymentId,
    bookingId,
  });
};

export const callAddAppointmentMetaMark = (
  vaccineId,
  centerId,
  time,
  firstDoseDate,
  price,
  doseSchedules
) => {
  return axios.post('/appointments/meta-mark', {
    vaccineId,
    centerId,
    time,
    firstDoseDate,
    price,
    doseSchedules,
  });
};

export const callAllBookings = (page = 0, size = 10) => {
  return axios.get(`/bookings?page=${page}&size=${size}`);
};

export const callUpdateAppointment = (appointmentId, doctorId) => {
  return axios.put(`/appointments/${appointmentId}/process`, {
    doctorAddress: doctorId,
    cashierAddress: doctorId, // TODO: Get actual cashier from session
  });
};

export const callUnassignDoctor = (appointmentId) => {
  return axios.put(`/appointments/${appointmentId}/unassign-doctor`);
};

export const callCancelAppointment = (appointmentId) => {
  return axios.put(`/appointments/${appointmentId}/cancel`);
};

export const callCompleteAppointment = (appointmentId) => {
  return axios.put(`/appointments/${appointmentId}/complete`);
};

export const callFetchAppointment = () => {
  return axios.get('/appointments');
};

export const callFetchAppointmentOfCenter = (query) => {
  return axios.get(`/appointments/center?${query}`);
};

export const callMySchedule = (query) => {
  return axios.get(`/appointments/my-schedules?${query}`);
};

export const callAcceptAppointment = (appointmentId) => {
  return axios.put(`/appointments/${appointmentId}/accept`);
};

export const callVerifyAppointment = (appointmentHash, paymentHash) => {
  return axios.post('/appointments/verify', {
    appointmentHash,
    paymentHash,
  });
};

// export const callCreateAppointment = (data) => {
//   return axios.post('/appointments', data);
// };

export const callListAppointment = (params) => {
  return axios.get('/appointments', { params });
};

export const callConfirmAppointment = (id) => {
  return axios.patch(`/appointments/${id}/confirm`);
};

export const callBookAppointment = (id) => {
  return axios.post(`/appointments/${id}/book`);
};

export const callFinishAppointment = (id) => {
  return axios.post(`/appointments/${id}/finish`);
};

export const callRefundAppointment = (appointmentId) => {
  return axios.get(`/appointments/${appointmentId}/refund`);
};

export const callVerifyId = (id) => {
  return axios.get(`/appointments/${id}/verify`);
};

// ============ BLOCKCHAIN APIS ============

/**
 * Verify booking on blockchain
 * @param {string} bookingId - Booking ID to verify
 */
export const callVerifyBookingOnChain = (bookingId) => {
  return axios.get(`/bookings/${bookingId}/verify`);
};

/**
 * Get booking history with blockchain info
 */
export const callMyBookingHistory = () => {
  return axios.get('/bookings/my-history');
};

/**
 * Update payment status after MetaMask transaction
 * @param {string} bookingId - Booking ID
 * @param {string} txHash - Transaction hash from MetaMask
 */
export const callConfirmMetaMaskPayment = (bookingId, txHash) => {
  return axios.post('/payments/confirm-metamask', {
    bookingId,
    txHash,
  });
};
