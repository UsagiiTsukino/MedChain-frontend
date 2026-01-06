import axios from './axios-customize';

/**
 * Exchange Rate API
 */

// Lấy tỷ giá hiện tại
export const callGetExchangeRates = () => {
  return axios.get('/exchange-rates');
};

// Chuyển đổi VND sang ETH
export const callConvertVndToEth = (vndAmount) => {
  return axios.get(`/exchange-rates/convert/vnd-to-eth?amount=${vndAmount}`);
};

// Cập nhật tỷ giá thủ công (admin only)
export const callUpdateExchangeRate = (ethToVnd, usdToVnd) => {
  return axios.put('/exchange-rates/manual', { ethToVnd, usdToVnd });
};

// Refresh tỷ giá
export const callRefreshExchangeRates = () => {
  return axios.put('/exchange-rates/refresh');
};
