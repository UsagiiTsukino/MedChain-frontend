/**
 * Certificate ID Formatter (Frontend)
 * Formats raw token IDs into professional-looking certificate identifiers
 */

export class CertificateFormatter {
  /**
   * Format token ID as VaxChain Certificate Number
   * Examples:
   * 1 -> VXC-000001
   * 42 -> VXC-000042
   */
  static formatCertificateId(tokenId) {
    const numericId =
      typeof tokenId === 'string' ? parseInt(tokenId, 10) : tokenId;

    if (isNaN(numericId) || numericId <= 0) {
      return 'VXC-INVALID';
    }

    const paddedId = numericId.toString().padStart(6, '0');
    return `VXC-${paddedId}`;
  }

  /**
   * Format with year prefix
   * Examples:
   * 1 -> VXC-2026-000001
   */
  static formatWithYear(tokenId) {
    const numericId =
      typeof tokenId === 'string' ? parseInt(tokenId, 10) : tokenId;

    if (isNaN(numericId) || numericId <= 0) {
      return 'VXC-INVALID';
    }

    const year = new Date().getFullYear();
    const paddedId = numericId.toString().padStart(6, '0');
    return `VXC-${year}-${paddedId}`;
  }

  /**
   * Format with checksum digit
   * Examples:
   * 1 -> VXC-0000017
   */
  static formatWithChecksum(tokenId) {
    const numericId =
      typeof tokenId === 'string' ? parseInt(tokenId, 10) : tokenId;

    if (isNaN(numericId) || numericId <= 0) {
      return 'VXC-INVALID';
    }

    const paddedId = numericId.toString().padStart(6, '0');
    const checksum = this.calculateChecksum(paddedId);
    return `VXC-${paddedId}${checksum}`;
  }

  /**
   * Format as hexadecimal (tech-looking)
   * Examples:
   * 1 -> VXC-0x000001
   * 255 -> VXC-0x0000FF
   */
  static formatHex(tokenId) {
    const numericId =
      typeof tokenId === 'string' ? parseInt(tokenId, 10) : tokenId;

    if (isNaN(numericId) || numericId <= 0) {
      return 'VXC-INVALID';
    }

    const hexId = numericId.toString(16).toUpperCase().padStart(6, '0');
    return `VXC-0x${hexId}`;
  }

  /**
   * Parse formatted ID back to token ID
   * VXC-000042 -> 42
   * VXC-2026-000042 -> 42
   */
  static parseTokenId(formattedId) {
    if (!formattedId || !formattedId.startsWith('VXC-')) {
      return null;
    }

    const withoutPrefix = formattedId.substring(4);

    // Try hex format
    if (withoutPrefix.startsWith('0x')) {
      const hexValue = withoutPrefix.substring(2);
      return parseInt(hexValue, 16);
    }

    // Try year format
    if (withoutPrefix.includes('-')) {
      const parts = withoutPrefix.split('-');
      const lastPart = parts[parts.length - 1];
      const numericPart = lastPart.replace(/\D/g, '').substring(0, 6);
      return parseInt(numericPart, 10);
    }

    // Regular format
    const numericPart = withoutPrefix.replace(/\D/g, '').substring(0, 6);
    return parseInt(numericPart, 10);
  }

  /**
   * Calculate Luhn checksum
   */
  static calculateChecksum(id) {
    let sum = 0;
    let alternate = false;

    for (let i = id.length - 1; i >= 0; i--) {
      let digit = parseInt(id.charAt(i), 10);

      if (alternate) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      alternate = !alternate;
    }

    return (10 - (sum % 10)) % 10;
  }

  /**
   * Get display format based on preference
   */
  static format(tokenId, style = 'standard') {
    switch (style) {
      case 'year':
        return this.formatWithYear(tokenId);
      case 'checksum':
        return this.formatWithChecksum(tokenId);
      case 'hex':
        return this.formatHex(tokenId);
      case 'standard':
      default:
        return this.formatCertificateId(tokenId);
    }
  }
}

// Export convenience functions
export const formatCertificateId =
  CertificateFormatter.formatCertificateId.bind(CertificateFormatter);
export const parseTokenId =
  CertificateFormatter.parseTokenId.bind(CertificateFormatter);
export const formatWithYear =
  CertificateFormatter.formatWithYear.bind(CertificateFormatter);
export const formatHex =
  CertificateFormatter.formatHex.bind(CertificateFormatter);
