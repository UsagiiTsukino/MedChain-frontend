import axios from './axios-customize';

/**
 * Module Appointment
 */

export const callGetAppointment = (hash) => {
  return axios.get(`/appointments/${hash}`);
};

export const callCreateOrder = (orderData) => {
  return axios.post('/orders', orderData);
}

export const callGetOrder = () => {
  return axios.get('/orders');
}

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

export const callAllBookings = () => {
  return axios.get('/bookings');
};

export const callUpdateAppointment = (appointmentId, doctorId) => {
  return axios.put('/appointments', {
    appointmentId,
    doctorId,
  });
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

export const callMySchedule = () => {
  return axios.get('/appointments/my-schedules');
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
