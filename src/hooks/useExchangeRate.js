import { useState, useEffect } from 'react';
import { callGetExchangeRates } from '../config/api.exchange-rate';

/**
 * Custom hook để lấy và quản lý tỷ giá
 * Auto refresh mỗi 5 phút
 */
export const useExchangeRate = () => {
  const [rates, setRates] = useState({
    ethToVnd: 85000000, // Default fallback
    usdToVnd: 24500,
    lastUpdated: new Date(),
    source: 'default',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRates = async () => {
    try {
      setLoading(true);
      const response = await callGetExchangeRates();

      if (response?.data?.data) {
        setRates(response.data.data);
        setError(null);
      }
    } catch (err) {
      console.error('Failed to fetch exchange rates:', err);
      setError(err.message);
      // Keep using fallback rates
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();

    // Auto refresh mỗi 5 phút
    const interval = setInterval(fetchRates, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  /**
   * Chuyển đổi VND sang ETH
   */
  const convertVndToEth = (vndAmount) => {
    return vndAmount / rates.ethToVnd;
  };

  /**
   * Chuyển đổi ETH sang VND
   */
  const convertEthToVnd = (ethAmount) => {
    return ethAmount * rates.ethToVnd;
  };

  /**
   * Chuyển đổi VND sang USD
   */
  const convertVndToUsd = (vndAmount) => {
    return vndAmount / rates.usdToVnd;
  };

  /**
   * Format số tiền ETH
   */
  const formatEth = (ethAmount, decimals = 4) => {
    return parseFloat(ethAmount).toFixed(decimals);
  };

  /**
   * Format số tiền VND
   */
  const formatVnd = (vndAmount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(vndAmount);
  };

  return {
    rates,
    loading,
    error,
    convertVndToEth,
    convertEthToVnd,
    convertVndToUsd,
    formatEth,
    formatVnd,
    refresh: fetchRates,
  };
};
