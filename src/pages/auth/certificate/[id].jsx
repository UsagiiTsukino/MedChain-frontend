import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import VaccineCertificate from '../../../components/certificate/VaccineCertificate';
import { Spin, message, Button, Progress, Timeline } from 'antd';
import {
  HomeOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import { callGetBooking } from '../../../config/api.appointment';
import dayjs from 'dayjs';

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

  // Only show certificate when ALL doses are completed
  const completedDoses = bookingData.progress?.completedDoses || 0;
  const totalDoses = bookingData.progress?.totalDoses || 0;
  const percent =
    totalDoses > 0 ? Math.round((completedDoses / totalDoses) * 100) : 0;

  if (completedDoses < totalDoses) {
    const appointments = bookingData.appointments || [];

    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-6">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-6">
            <div className="text-orange-500 text-5xl mb-4">
              <ClockCircleOutlined />
            </div>
            <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Đang trong quá trình tiêm chủng
            </h2>
            <p className="text-gray-600 text-lg">
              Vui lòng hoàn thành tất cả các mũi tiêm để nhận chứng nhận
            </p>
          </div>

          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <span className="text-lg font-semibold text-gray-700">
                Tiến độ tiêm chủng
              </span>
              <span className="text-2xl font-bold text-blue-600">
                {completedDoses}/{totalDoses} mũi
              </span>
            </div>
            <Progress
              percent={percent}
              strokeColor={{
                '0%': '#1890ff',
                '100%': '#52c41a',
              }}
              strokeWidth={12}
              format={(percent) => `${percent}%`}
            />
          </div>

          {appointments.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">
                Lịch trình tiêm
              </h3>
              <Timeline
                items={appointments.map((apt, index) => ({
                  color:
                    apt.status === 'COMPLETED'
                      ? 'green'
                      : apt.status === 'CONFIRMED'
                      ? 'blue'
                      : 'gray',
                  dot:
                    apt.status === 'COMPLETED' ? (
                      <CheckCircleOutlined />
                    ) : (
                      <ClockCircleOutlined />
                    ),
                  children: (
                    <div className="pb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-gray-900">
                          Mũi {apt.doseNumber}/{totalDoses}
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            apt.status === 'COMPLETED'
                              ? 'bg-green-100 text-green-700'
                              : apt.status === 'CONFIRMED'
                              ? 'bg-blue-100 text-blue-700'
                              : apt.status === 'ASSIGNED'
                              ? 'bg-orange-100 text-orange-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {apt.status === 'COMPLETED'
                            ? '✓ Đã hoàn thành'
                            : apt.status === 'CONFIRMED'
                            ? 'Đã xác nhận'
                            : apt.status === 'ASSIGNED'
                            ? 'Đã phân công'
                            : 'Chờ xử lý'}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        <div>
                          Ngày: {dayjs(apt.date).format('DD/MM/YYYY')} -{' '}
                          {apt.time}
                        </div>
                        {apt.status === 'COMPLETED' && (
                          <div className="text-green-600 mt-1">
                            ✓ Đã tiêm thành công
                          </div>
                        )}
                      </div>
                    </div>
                  ),
                }))}
              />
            </div>
          )}

          <div className="flex gap-3">
            <Button
              type="primary"
              size="large"
              icon={<HomeOutlined />}
              onClick={() => navigate('/')}
              className="flex-1"
            >
              Trở về trang chủ
            </Button>
            <Button
              size="large"
              onClick={() => navigate('/auth/profile')}
              className="flex-1"
            >
              Xem lịch sử
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return <VaccineCertificate bookingData={bookingData} />;
};

export default CertificatePage;
