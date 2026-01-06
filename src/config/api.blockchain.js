import axios from './axios-customize';

/**
 * Verify a certificate on blockchain by tokenId
 * Public endpoint - no authentication required
 */
const verifyCertificate = (tokenId) => {
  return axios.get(`/blockchain/verify-certificate/${tokenId}`);
};

/**
 * Get certificate by booking ID
 */
const getCertificateByBooking = (bookingId) => {
  return axios.get(`/blockchain/certificate/${bookingId}`);
};

export { verifyCertificate, getCertificateByBooking };
