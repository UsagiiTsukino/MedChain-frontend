export const getColorStatus = (status) => {
  switch (status) {
    case 'PENDING':
      return 'magenta';
    case 'SCHEDULED':
      return 'processing';
    case 'CONFIRMED':
    case 'COMPLETED':
      return 'success';
    case 'CANCELLED':
      return 'error';
  }
};

export const getStatusBadge = (status) => {
  const statusConfig = {
    confirmed: { color: 'success', text: 'Đã xác nhận' },
    pending: { color: 'warning', text: 'Chờ xác nhận' },
    completed: { color: 'processing', text: 'Hoàn thành' },
    cancelled: { color: 'error', text: 'Đã hủy' },
  };
  return statusConfig[status] || statusConfig.pending;
};
