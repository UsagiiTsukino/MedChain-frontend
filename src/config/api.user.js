import axios from './axios-customize';
/**
 *
Module User
 */

export const callUpdateUser = (
  walletAddress,
  fullName,
  email,
  phoneNumber,
  birthday,
  address,
  centerName,
  role
) => {
  return axios.put(`/users/${walletAddress}`, {
    fullName,
    email,
    phoneNumber,
    birthday,
    address,
    centerName,
    role,
  });
};

export const callFetchUser = (query) => {
  return axios.get(`/users?${query}`);
};

export const callDeleteUser = (id) => {
  return axios.delete(`/users/${id}`);
};

export const callFetchDoctor = (centerId) => {
  const params = centerId ? `?centerId=${centerId}` : '';
  return axios.get(`/users/doctors${params}`);
};
