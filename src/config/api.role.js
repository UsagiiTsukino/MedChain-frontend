import axios from './axios-customize';

/**
 *
Module Role
 */

export const callFetchRole = (query) => {
  return axios.get(`/roles?${query}`);
};

export const callUpdateRole = (role, id) => {
  return axios.put(`/roles/${id}`, { ...role })
}