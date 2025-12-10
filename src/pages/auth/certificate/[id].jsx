import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import VaccineCertificate from '../../../components/certificate/VaccineCertificate';
import { Spin, message, Button } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import { callGetBooking } from '../../../config/api.appointment';

const CertificatePage = () => {
  const { id } = useParams(); // bookingId
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [bookingData, setBookingData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Gọi API để lấy thông tin booking
        const response = await callGetBooking(id);

        if (response) {
          console.log('Booking data:', response);
          setBookingData(response);
        } else {
          message.error('Không thể tải thông tin chứng nhận');
        }
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu chứng nhận:', error);
        message.error('Đã xảy ra lỗi khi tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Spin size="large" tip="Đang tải chứng nhận tiêm chủng..." />
      </div>
    );
  }

  if (!bookingData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="text-red-500 text-5xl mb-4">
          <i className="fas fa-exclamation-circle" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Không tìm thấy chứng nhận</h2>
        <p className="text-gray-500 mb-6">
          Mã đăng ký không hợp lệ hoặc chưa hoàn thành tiêm chủng
        </p>
        <Button
          type="primary"
          size="large"
          icon={<HomeOutlined />}
          onClick={() => navigate('/')}
        >
          Trở về trang chủ
        </Button>
      </div>
    );
  }

  // Only show certificate for completed bookings
  if (bookingData.overallStatus !== 'COMPLETED') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="text-orange-500 text-5xl mb-4">
          <i className="fas fa-clock" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Chứng nhận chưa sẵn sàng</h2>
        <p className="text-gray-500">
          Vui lòng hoàn thành tất cả các mũi tiêm để nhận chứng nhận
        </p>
        <p className="text-sm text-gray-400 mt-2 mb-6">
          Trạng thái hiện tại: {bookingData.overallStatus}
        </p>
        <Button
          type="primary"
          size="large"
          icon={<HomeOutlined />}
          onClick={() => navigate('/')}
        >
          Trở về trang chủ
        </Button>
      </div>
    );
  }

  return <VaccineCertificate bookingData={bookingData} />;
};

export default CertificatePage;
