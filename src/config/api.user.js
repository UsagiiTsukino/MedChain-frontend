import axios from './axios-customize';
/**
 *
Module User
 */

export const callUpdateUser = (
  walletAddress,
  fullname,
  email,
  phoneNumber,
  birthday,
  address,
  centerName
) => {
  return axios.put(`/users/${walletAddress}`, {
    fullname,
    email,
    phoneNumber,
    birthday,
    address,
    centerName
  });
};

export const callFetchUser = (query) => {
  return axios.get(`/users?${query}`);
};

export const callDeleteUser = (id) => {
  return axios.delete(`/users/${id}`);
};

export const callFetchDoctor = () => {
  return axios.get('/users/doctors');
}
