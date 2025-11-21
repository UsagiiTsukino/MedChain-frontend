'use strict';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  CheckCircleOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  MedicineBoxOutlined,
  PhoneOutlined,
  MailOutlined,
  PrinterOutlined,
  HomeOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  Result,
  Divider,
  Timeline,
  Space,
  Typography,
  Spin,
  message,
} from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import {
  updatePaymentPaypal,
  callGetBooking,
} from '../../config/api.appointment';
import confetti from 'canvas-confetti';

const { Title, Text, Paragraph } = Typography;

const SuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const booking_id = searchParams.get('booking');
  const payment_id = searchParams.get('payment');
  const payerID = searchParams.get('PayerID');
  const token = searchParams.get('token');

  const [bookingDetails, setBookingDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch booking details
  useEffect(() => {
    const fetchBookingDetails = async () => {
      if (!booking_id) {
        setLoading(false);
        return;
      }

      try {
        const data = await callGetBooking(booking_id);
        console.log('[Success] Booking response:', data);
        if (data) {
          console.log('[Success] Mapping data:', data);
          setBookingDetails({
            bookingId: data.bookingId,
            vaccineName: data.vaccine?.name || 'N/A',
            centerName: data.center?.name || 'N/A',
            centerAddress: data.center?.address || 'N/A',
            centerPhone: data.center?.phoneNumber || 'N/A',
            appointmentDate: data.appointmentDate
              ? dayjs(data.appointmentDate).format('DD/MM/YYYY')
              : 'N/A',
            appointmentTime: data.appointmentTime || 'N/A',
            totalDoses: data.totalDoses || 1,
            paymentMethod:
              data.payment?.method === 'CASH'
                ? 'Tiền mặt'
                : data.payment?.method === 'PAYPAL'
                ? 'PayPal'
                : data.payment?.method === 'METAMASK'
                ? 'MetaMask'
                : data.payment?.method || 'N/A',
            totalAmount: data.totalAmount
              ? `${data.totalAmount.toLocaleString()} VNĐ`
              : 'N/A',
            status: data.status,
          });
        } else {
          console.error('[Success] No data in response');
        }
      } catch (error) {
        console.error('[Success] Error fetching booking:', error);
        message.error('Không thể tải thông tin đặt lịch');
        setBookingDetails(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [booking_id]);

  useEffect(() => {
    const handleUpdate = async () => {
      if (token && payerID && booking_id && payment_id) {
        await updatePaymentPaypal(booking_id, payment_id);
      }
    };
    handleUpdate();
  }, [booking_id, payerID, payment_id, token]);

  // Confetti animation on mount
  useEffect(() => {
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#52c41a', '#1890ff', '#faad14'],
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#52c41a', '#1890ff', '#faad14'],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
        <div className="text-center">
          <Spin size="large" />
          <p className="mt-4 text-gray-600">Đang tải thông tin đặt lịch...</p>
        </div>
      </div>
    );
  }

  if (!bookingDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Result
          status="warning"
          title="Không tìm thấy thông tin đặt lịch"
          extra={
            <Button type="primary" onClick={() => navigate('/')}>
              Về trang chủ
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Success Header */}
        <Card className="text-center shadow-2xl rounded-2xl border-0 mb-8">
          <div className="py-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6 animate-bounce">
              <CheckCircleOutlined className="text-6xl text-green-500" />
            </div>
            <Title level={1} className="!mb-2 !text-green-600">
              Đặt lịch thành công!
            </Title>
            <Paragraph className="text-lg text-gray-600">
              Cảm ơn bạn đã tin tưởng dịch vụ tiêm chủng của chúng tôi
            </Paragraph>
            <div className="mt-6 inline-block bg-blue-50 px-6 py-3 rounded-lg">
              <Text className="text-sm text-gray-500">Mã đặt lịch</Text>
              <Title level={3} className="!mb-0 !mt-1 text-blue-600">
                #{bookingDetails?.bookingId || 'N/A'}
              </Title>
            </div>
          </div>
        </Card>

        {/* Booking Details */}
        <Card
          title={
            <span className="text-xl font-semibold">
              <MedicineBoxOutlined className="mr-2 text-blue-500" />
              Thông tin đặt lịch
            </span>
          }
          className="shadow-lg rounded-xl mb-6"
        >
          <div className="space-y-6">
            {/* Vaccine Info */}
            <div className="flex items-start p-4 bg-blue-50 rounded-lg">
              <MedicineBoxOutlined className="text-2xl text-blue-500 mt-1 mr-4" />
              <div className="flex-1">
                <Text className="text-sm text-gray-500">Vaccine</Text>
                <div className="font-semibold text-lg text-gray-800">
                  {bookingDetails?.vaccineName || 'N/A'}
                </div>
                <Text className="text-sm text-gray-600">
                  Tổng số mũi tiêm: {bookingDetails?.totalDoses || 0}
                </Text>
              </div>
            </div>

            <Divider className="my-4" />

            {/* Appointment Schedule */}
            <div>
              <Title level={5} className="!mb-4 flex items-center">
                <CalendarOutlined className="mr-2 text-green-500" />
                Lịch hẹn mũi tiêm đầu tiên
              </Title>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center mb-2">
                    <CalendarOutlined className="text-green-600 mr-2" />
                    <Text strong>Ngày hẹn</Text>
                  </div>
                  <Text className="text-lg">
                    {bookingDetails?.appointmentDate || 'N/A'}
                  </Text>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <div className="flex items-center mb-2">
                    <ClockCircleOutlined className="text-purple-600 mr-2" />
                    <Text strong>Giờ hẹn</Text>
                  </div>
                  <Text className="text-lg">
                    {bookingDetails?.appointmentTime || 'N/A'}
                  </Text>
                </div>
              </div>
            </div>

            <Divider className="my-4" />

            {/* Center Info */}
            <div>
              <Title level={5} className="!mb-4 flex items-center">
                <EnvironmentOutlined className="mr-2 text-red-500" />
                Địa điểm tiêm chủng
              </Title>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="font-semibold text-lg mb-2">
                  {bookingDetails?.centerName || 'N/A'}
                </div>
                <div className="flex items-start text-gray-600">
                  <EnvironmentOutlined className="mt-1 mr-2" />
                  <span>{bookingDetails?.centerAddress || 'N/A'}</span>
                </div>
              </div>
            </div>

            <Divider className="my-4" />

            {/* Payment Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-orange-50 rounded-lg">
                <Text className="text-sm text-gray-500">
                  Phương thức thanh toán
                </Text>
                <div className="font-semibold text-lg mt-1">
                  {bookingDetails?.paymentMethod || 'N/A'}
                </div>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg">
                <Text className="text-sm text-gray-500">Tổng chi phí</Text>
                <div className="font-semibold text-lg mt-1 text-orange-600">
                  {bookingDetails?.totalAmount || '0 VNĐ'}
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Important Notes */}
        <Card
          title="Lưu ý quan trọng"
          className="shadow-lg rounded-xl mb-6 border-l-4 border-orange-400"
        >
          <Timeline
            items={[
              {
                color: 'blue',
                children: (
                  <div>
                    <Text strong>Đến đúng giờ</Text>
                    <div className="text-gray-600">
                      Vui lòng có mặt trước giờ hẹn 15 phút để hoàn tất thủ tục
                    </div>
                  </div>
                ),
              },
              {
                color: 'green',
                children: (
                  <div>
                    <Text strong>Mang theo giấy tờ</Text>
                    <div className="text-gray-600">
                      CMND/CCCD, Sổ tiêm chủng (nếu có)
                    </div>
                  </div>
                ),
              },
              {
                color: 'purple',
                children: (
                  <div>
                    <Text strong>Kiểm tra sức khỏe</Text>
                    <div className="text-gray-600">
                      Đảm bảo sức khỏe tốt trước khi tiêm
                    </div>
                  </div>
                ),
              },
              {
                color: 'red',
                children: (
                  <div>
                    <Text strong>Liên hệ hỗ trợ</Text>
                    <div className="text-gray-600 flex items-center gap-4 mt-2">
                      <span className="flex items-center">
                        <PhoneOutlined className="mr-2" />
                        1900-xxxx
                      </span>
                      <span className="flex items-center">
                        <MailOutlined className="mr-2" />
                        support@vaxchain.io
                      </span>
                    </div>
                  </div>
                ),
              },
            ]}
          />
        </Card>

        {/* Action Buttons */}
        <Card className="shadow-lg rounded-xl">
          <Space direction="vertical" className="w-full" size="large">
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                type="primary"
                size="large"
                icon={<PrinterOutlined />}
                onClick={handlePrint}
                className="px-8"
              >
                In phiếu hẹn
              </Button>
              <Button
                size="large"
                icon={<HomeOutlined />}
                onClick={() => navigate('/')}
                className="px-8"
              >
                Về trang chủ
              </Button>
              <Link to="/auth/profile">
                <Button size="large" className="px-8">
                  Xem lịch sử đặt lịch
                </Button>
              </Link>
            </div>
            <Divider className="my-2" />
            <div className="text-center text-gray-500 text-sm">
              <Text>Một email xác nhận đã được gửi đến hộp thư của bạn</Text>
            </div>
          </Space>
        </Card>
      </div>
    </div>
  );
};

export default SuccessPage;
