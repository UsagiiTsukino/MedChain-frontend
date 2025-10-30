import axios from './axios-customize';

/**
 *
Module Permission
 */

export const callCreatePermission = (
  name,
  method,
  apiPath,
  module
) => {
  return axios.post('/permissions', {
    name,
    method,
    apiPath,
    module
  });
};

export const callUpdatePermission = (
  id,
  name,
  method,
  apiPath,
  module
) => {
  return axios.put('/permissions', {
    id,
    name,
    method,
    apiPath,
    module
  });
};

export const callFetchPermission = (query) => {
  return axios.get(`/permissions?${query}`);
};

export const callDeletePermission = (id) => {
  return axios.delete(`/permissions/${id}`);
};

