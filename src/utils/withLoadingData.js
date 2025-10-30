import { useState } from 'react';
import { message } from 'antd';

/**
 * Hook xử lý việc tải dữ liệu với trạng thái loading
 * 
 * @param {Function} fetchFunction - Hàm async để tải dữ liệu
 * @param {Object} options - Các tùy chọn thêm cho việc tải dữ liệu
 * @param {Function} options.onSuccess - Hàm callback được thực thi khi tải dữ liệu thành công
 * @param {Function} options.onError - Hàm callback được thực thi khi tải dữ liệu thất bại
 * @param {string} options.errorMessage - Thông báo lỗi mặc định khi tải thất bại
 * @param {number} options.timeout - Thời gian tối thiểu cho trạng thái loading (ms)
 * @returns {Object} - Object chứa trạng thái loading, dữ liệu và hàm tải dữ liệu
 */
const useLoadingData = (
  fetchFunction,
  {
    onSuccess = () => {},
    onError = () => {},
    errorMessage = 'Không thể tải dữ liệu',
    timeout = 1000
  } = {}
) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const fetchData = async (...args) => {
    try {
      setLoading(true);
      
      // Ghi lại thời điểm bắt đầu tải
      const startTime = Date.now();
      
      // Tải dữ liệu
      const result = await fetchFunction(...args);
      
      // Tính thời gian đã tải
      const fetchTime = Date.now() - startTime;
      
      // Đảm bảo hiển thị trạng thái loading ít nhất là thời gian timeout
      if (fetchTime < timeout) {
        await new Promise(resolve => setTimeout(resolve, timeout - fetchTime));
      }
      
      // Cập nhật trạng thái dữ liệu
      setData(result);
      
      // Gọi callback thành công
      onSuccess(result);
      
      return result;
    } catch (error) {
      // Hiển thị thông báo lỗi
      message.error(error?.message || errorMessage);
      
      // Gọi callback lỗi
      onError(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    data,
    fetchData
  };
};

export default useLoadingData; 