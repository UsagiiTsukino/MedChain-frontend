import axios from './axios-customize';

/**
 *
Module Vaccine
 */

export const callCreateVaccine = (
  name,
  description,
  image,
  manufacturer,
  country,
  disease,
  schedule,
  efficacy,
  target,
  dosage,
  price,
  stockQuantity,
  requiredDoses
) => {
  return axios.post('/vaccines', {
    name,
    description,
    imageUrl: image,
    manufacturer,
    country,
    disease,
    schedule,
    efficacy,
    target,
    dosage,
    price,
    stockQuantity,
    requiredDoses,
  });
};

export const callUpdateVaccine = (
  vaccineId,
  name,
  description,
  image,
  manufacturer,
  country,
  disease,
  schedule,
  efficacy,
  target,
  dosage,
  price,
  stockQuantity,
  requiredDoses
) => {
  return axios.put(`/vaccines/${vaccineId}`, {
    name,
    description,
    imageUrl: image,
    manufacturer,
    country,
    disease,
    schedule,
    efficacy,
    target,
    dosage,
    price,
    stockQuantity,
    requiredDoses,
  });
};

export const callFetchVaccine = (query) => {
  return axios.get(`/vaccines?${query}`);
};

export const callFetchVaccineBySku = (sku) => {
  return axios.get(`/vaccines/${sku}`);
};

export const callDeleteVaccine = (id) => {
  return axios.delete(`/vaccines/${id}`);
};
