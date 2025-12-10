import axios from './axios-customize';

/**
 *
Module Center
 */

export const callCreateCenter = (
  name,
  address,
  phoneNumber,
  capacity,
  workingHours,
  image
) => {
  return axios.post('/centers', {
    name,
    address,
    phoneNumber,
    capacity,
    workingHours,
    imageUrl: image,
  });
};

export const callUpdateCenter = (
  centerId,
  name,
  address,
  phoneNumber,
  capacity,
  workingHours,
  image
) => {
  return axios.put(`/centers/${centerId}`, {
    name,
    address,
    phoneNumber,
    capacity,
    workingHours,
    imageUrl: image,
  });
};

export const callFetchCenter = (query) => {
  return axios.get(`/centers?${query}`);
};

export const callDeleteCenter = (id) => {
  return axios.delete(`/centers/${id}`);
};
