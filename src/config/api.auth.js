import axios from './axios-customize';

/**
 *
Module Auth
 */

export const callRegister = (fullName, email, password) => {
  return axios.post('/auth/register', {
    fullName,
    email,
    password,
  });
};

export const callLoginWithPassword = (username, password) => {
  return axios.post('/auth/login/password', { username, password });
};

export const callLoginWithGoogle = (googleToken) => {
  return axios.post('/auth/login/google', { token: googleToken });
};

export const callFetchAccount = () => {
  return axios.get('/auth/account');
};

export const callLogout = () => {
  return axios.post('/auth/logout');
};

export const callMyAppointments = () => {
  return axios.get('/auth/my-appointments');
};

export const callMyBookings = () => {
  return axios.get('/bookings/my-history');
};

// export const callRefreshToken = () => {
//   return axios.get('/auth/refresh');
// };
