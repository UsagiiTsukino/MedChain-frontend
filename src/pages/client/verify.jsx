import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  Typography,
  Spin,
  Tag,
  Descriptions,
  Button,
  Result,
  Divider,
} from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  SafetyCertificateOutlined,
  BlockOutlined,
  CalendarOutlined,
  MedicineBoxOutlined,
  EnvironmentOutlined,
  UserOutlined,
  LinkOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons';
import {
  callVerifyBookingOnChain,
  callGetBooking,
} from '../../config/api.appointment';

const { Title, Text, Paragraph } = Typography;

/**
 * Public Verify Page
 * Anyone can verify a vaccination certificate by booking ID or transaction hash
 */
const VerifyPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [verificationResult, setVerificationResult] = useState(null);
  const [bookingData, setBookingData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const verifyBooking = async () => {
      if (!bookingId) {
        setError('Không có mã đặt lịch để xác thực');
        setLoading(false);
        return;
      }

      try {
        // Get booking details
        const bookingResponse = await callGetBooking(bookingId);
        const booking = bookingResponse?.data || bookingResponse;
        setBookingData(booking);

        // Verify on blockchain
        const verifyResponse = await callVerifyBookingOnChain(bookingId);
        const verification = verifyResponse?.data || verifyResponse;
        setVerificationResult(verification);
      } catch (err) {
        setError(
          'Không thể xác thực. Mã đặt lịch không tồn tại hoặc chưa được ghi trên blockchain.'
        );
      } finally {
        setLoading(false);
      }
    };

    verifyBooking();
  }, [bookingId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <Card className="text-center p-8 rounded-2xl shadow-xl">
          <Spin size="large" />
          <p className="mt-4 text-gray-600">Đang xác thực trên Blockchain...</p>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        <Card className="max-w-lg w-full rounded-2xl shadow-xl">
          <Result
            status="error"
            title="Xác thực thất bại"
            subTitle={error}
            extra={[
              <Button key="home" type="primary" onClick={() => navigate('/')}>
                Về trang chủ
              </Button>,
            ]}
          />
        </Card>
      </div>
    );
  }

  const isVerified = verificationResult?.verified;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg mb-4">
            <SafetyCertificateOutlined className="text-white text-4xl" />
          </div>
          <Title level={2} className="mb-2">
            Xác Thực Chứng Nhận Tiêm Chủng
          </Title>
          <Paragraph type="secondary">
            Xác thực tính xác thực của chứng nhận tiêm chủng trên mạng
            Blockchain
          </Paragraph>
        </div>

        {/* Main Verification Card */}
        <Card className="rounded-2xl shadow-xl overflow-hidden mb-6">
          {/* Status Banner */}
          <div
            className={`p-6 text-center ${
              isVerified
                ? 'bg-gradient-to-r from-green-500 to-emerald-600'
                : 'bg-gradient-to-r from-red-500 to-orange-500'
            }`}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 mb-3">
              {isVerified ? (
                <CheckCircleOutlined className="text-white text-3xl" />
              ) : (
                <CloseCircleOutlined className="text-white text-3xl" />
              )}
            </div>
            <h3 className="text-white text-xl font-bold">
              {isVerified ? 'Chứng Nhận Hợp Lệ' : 'Không Thể Xác Thực'}
            </h3>
            <p className="text-white/80 text-sm">
              {isVerified
                ? 'Thông tin đã được xác nhận trên Blockchain'
                : verificationResult?.reason ||
                  'Không tìm thấy dữ liệu trên Blockchain'}
            </p>
          </div>

          {/* Booking Details */}
          {bookingData && (
            <div className="p-6">
              <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CalendarOutlined className="text-purple-500" />
                Thông Tin Đặt Lịch
              </h4>

              <Descriptions column={{ xs: 1, sm: 2 }} bordered size="small">
                <Descriptions.Item label="Mã đặt lịch">
                  <Text strong>#{bookingData.bookingId}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Trạng thái">
                  <Tag
                    color={
                      bookingData.status === 'CONFIRMED' ? 'green' : 'orange'
                    }
                  >
                    {bookingData.status}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item
                  label={
                    <>
                      <MedicineBoxOutlined /> Vaccine
                    </>
                  }
                >
                  <Text strong>{bookingData.vaccine?.name}</Text>
                </Descriptions.Item>
                <Descriptions.Item
                  label={
                    <>
                      <EnvironmentOutlined /> Trung tâm
                    </>
                  }
                >
                  {bookingData.center?.name}
                </Descriptions.Item>
                <Descriptions.Item label="Ngày tiêm">
                  {bookingData.appointmentDate}
                </Descriptions.Item>
                <Descriptions.Item label="Giờ tiêm">
                  {bookingData.appointmentTime}
                </Descriptions.Item>
              </Descriptions>
            </div>
          )}

          <Divider className="my-0" />

          {/* Blockchain Info */}
          <div className="p-6 bg-gray-50">
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <BlockOutlined className="text-blue-500" />
              Thông Tin Blockchain
            </h4>

            {bookingData?.blockchain?.txHash ? (
              <Descriptions column={1} size="small">
                <Descriptions.Item label="Transaction Hash">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Text copyable className="font-mono text-xs break-all">
                      {bookingData.blockchain.txHash}
                    </Text>
                    <a
                      href={`https://etherscan.io/tx/${bookingData.blockchain.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 flex-shrink-0"
                    >
                      <LinkOutlined /> Xem trên Etherscan
                    </a>
                  </div>
                </Descriptions.Item>
                <Descriptions.Item label="On-chain Appointment ID">
                  <Text className="font-mono">
                    #{bookingData.blockchain.appointmentId}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label="Trạng thái Blockchain">
                  <Tag
                    color={
                      bookingData.blockchain.status === 'CONFIRMED'
                        ? 'green'
                        : 'orange'
                    }
                  >
                    {bookingData.blockchain.status}
                  </Tag>
                </Descriptions.Item>
              </Descriptions>
            ) : (
              <div className="text-center py-4">
                <Text type="secondary">Chưa có thông tin blockchain</Text>
              </div>
            )}

            {/* On-chain Data */}
            {isVerified && verificationResult?.onChainData && (
              <div className="mt-4 p-4 bg-green-50 rounded-xl border border-green-200">
                <h5 className="font-semibold text-green-800 mb-3">
                  <CheckCircleOutlined className="mr-2" />
                  Dữ Liệu Trên Blockchain (Bất Biến)
                </h5>
                <Descriptions column={1} size="small">
                  <Descriptions.Item label="Vaccine">
                    {verificationResult.onChainData.vaccineName}
                  </Descriptions.Item>
                  <Descriptions.Item label="Trung tâm">
                    {verificationResult.onChainData.centerName}
                  </Descriptions.Item>
                  <Descriptions.Item label="Địa chỉ bệnh nhân">
                    <Text className="font-mono text-xs">
                      {verificationResult.onChainData.patientAddress}
                    </Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Trạng thái on-chain">
                    <Tag color="blue">
                      {verificationResult.onChainData.status}
                    </Tag>
                  </Descriptions.Item>
                </Descriptions>
              </div>
            )}
          </div>
        </Card>

        {/* Security Notice */}
        <Card className="rounded-xl bg-blue-50 border-blue-200">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <SafetyCertificateOutlined className="text-blue-500 text-2xl" />
            </div>
            <div>
              <h4 className="font-semibold text-blue-900 mb-1">
                Về Xác Thực Blockchain
              </h4>
              <p className="text-blue-700 text-sm">
                Dữ liệu được lưu trữ trên blockchain là bất biến và không thể
                sửa đổi. Mỗi chứng nhận tiêm chủng được ghi nhận với một
                transaction hash duy nhất, đảm bảo tính minh bạch và xác thực
                của thông tin tiêm chủng.
              </p>
            </div>
          </div>
        </Card>

        {/* Back Button */}
        <div className="mt-6 text-center">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/')}
            size="large"
          >
            Quay về trang chủ
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VerifyPage;
