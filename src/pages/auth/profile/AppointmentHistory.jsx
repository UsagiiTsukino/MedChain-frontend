import React, { useState } from 'react';
import {
  Card,
  Tag,
  Space,
  Button,
  Statistic,
  Tooltip,
  Progress,
  Avatar,
} from 'antd';
import {
  MedicineBoxOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  InfoCircleOutlined,
  SafetyCertificateOutlined,
  PlusOutlined,
  MessageOutlined,
} from '@ant-design/icons';
import ChatModal from '../../../components/chat/ChatModal';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import LoadingTable from '../../../components/share/LoadingTable';
import { BlockchainVerifyBadge } from '../../../components/blockchain/BlockchainComponents';

/**
 * Component hiển thị lịch sử đăng ký tiêm chủng
 */
const AppointmentHistory = ({ user, appointments, loadingAppointments }) => {
  const navigate = useNavigate();

  // State for chat modal
  const [chatVisible, setChatVisible] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  // Function to open chat modal
  const handleOpenChat = (record, appointment) => {
    console.log('[AppointmentHistory] handleOpenChat called');
    console.log('[AppointmentHistory] record:', record);
    console.log('[AppointmentHistory] appointment:', appointment);
    console.log('[AppointmentHistory] user:', user);

    // Open modal first for instant UI feedback
    setChatVisible(true);

    // Set data after modal is visible
    setTimeout(() => {
      setSelectedAppointment({
        appointmentId: appointment.appointmentId,
        doseNumber: appointment.doseNumber,
        appointmentDate: appointment.appointmentDate,
        appointmentTime: appointment.appointmentTime,
        vaccine: record.vaccine,
      });
      setSelectedDoctor(appointment.doctor);
    }, 0);
  };

  const getStatusColor = (status) => {
    const statusMap = {
      PENDING: 'orange',
      ASSIGNED: 'gold',
      PROGRESS: 'blue',
      COMPLETED: 'green',
      CANCELLED: 'red',
    };
    return statusMap[status] || 'default';
  };

  const getStatusText = (status) => {
    const statusMap = {
      PENDING: 'Chờ xử lý',
      ASSIGNED: 'Đã phân công',
      PROGRESS: 'Đang tiêm',
      COMPLETED: 'Hoàn thành',
      CANCELLED: 'Đã hủy',
    };
    return statusMap[status] || status;
  };

  const columns = [
    {
      title: 'Mã',
      dataIndex: 'bookingId',
      key: 'bookingId',
      width: 80,
      fixed: 'left',
      render: (id) => (
        <span className="font-mono text-blue-600 font-semibold">#{id}</span>
      ),
    },
    {
      title: 'Vaccine',
      key: 'vaccine',
      width: 200,
      ellipsis: true,
      render: (_, record) => (
        <div className="flex items-start gap-2">
          <MedicineBoxOutlined className="text-blue-500 mt-1 flex-shrink-0" />
          <div className="min-w-0">
            <Tooltip title={record.vaccine?.name}>
              <div className="font-medium text-gray-900 truncate">
                {record.vaccine?.name || 'N/A'}
              </div>
            </Tooltip>
            <div className="text-xs text-gray-500">
              {record.totalDoses} liều
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Trung tâm',
      key: 'center',
      width: 200,
      ellipsis: true,
      render: (_, record) => (
        <div className="flex items-start gap-2">
          <EnvironmentOutlined className="text-red-500 mt-1 flex-shrink-0" />
          <div className="min-w-0">
            <Tooltip title={record.center?.name}>
              <div className="font-medium text-gray-900 truncate">
                {record.center?.name || 'N/A'}
              </div>
            </Tooltip>
            <Tooltip title={record.center?.address}>
              <div className="text-xs text-gray-500 truncate">
                {record.center?.address || 'Hà Nội'}
              </div>
            </Tooltip>
          </div>
        </div>
      ),
    },
    {
      title: 'Lịch hẹn',
      key: 'appointment',
      width: 140,
      render: (_, record) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-gray-900">
            <CalendarOutlined className="text-orange-500" />
            <span className="font-medium">
              {dayjs(record.firstDoseDate).format('DD/MM/YYYY')}
            </span>
          </div>
          <div className="flex items-center gap-2 text-gray-500 text-xs">
            <ClockCircleOutlined />
            {record.firstDoseTime}
          </div>
        </div>
      ),
    },
    {
      title: 'Thanh toán',
      key: 'payment',
      width: 150,
      render: (_, record) => {
        const method = record.payment?.method || record.paymentMethod;
        const amount = record.payment?.amount || record.totalAmount;
        const currency = record.payment?.currency || 'VND';

        const methodMap = {
          CASH: { text: 'Tiền mặt', color: 'green' },
          PAYPAL: { text: 'PayPal', color: 'blue' },
          METAMASK: { text: 'MetaMask', color: 'purple' },
          BANK_TRANSFER: { text: 'Chuyển khoản', color: 'cyan' },
        };
        const info = methodMap[method] || {
          text: method || 'N/A',
          color: 'default',
        };

        // Format amount based on currency
        let formattedAmount;
        if (currency === 'VND') {
          formattedAmount =
            new Intl.NumberFormat('vi-VN').format(amount || 0) + 'đ';
        } else if (currency === 'ETH') {
          formattedAmount = `${(amount || 0).toFixed(4)} ETH`;
        } else if (currency === 'USD') {
          formattedAmount = `$${(amount || 0).toFixed(2)}`;
        } else {
          formattedAmount = `${amount || 0} ${currency}`;
        }

        return (
          <div className="space-y-1">
            <Tag color={info.color} className="m-0">
              {info.text}
            </Tag>
            <div className="text-xs text-gray-600 font-mono font-semibold">
              {formattedAmount}
            </div>
          </div>
        );
      },
    },
    {
      title: 'Tiến độ',
      key: 'progress',
      width: 150,
      render: (_, record) => {
        const completedDoses = record.progress?.completedDoses || 0;
        const totalDoses =
          record.progress?.totalDoses || record.totalDoses || 0;
        const percent =
          totalDoses > 0 ? Math.round((completedDoses / totalDoses) * 100) : 0;

        return (
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">
                {completedDoses}/{totalDoses} mũi
              </span>
            </div>
            <Progress
              percent={percent}
              size="small"
              strokeColor={{
                '0%': '#108ee9',
                '100%': '#87d068',
              }}
              showInfo={false}
            />
          </div>
        );
      },
    },
    {
      title: 'Bác sĩ phụ trách',
      key: 'doctor',
      width: 200,
      render: (_, record) => {
        // Lấy appointments từ record
        const appointments = record.appointments || [];
        const appointmentsWithDoctor = appointments.filter((a) => a.doctor);

        if (appointmentsWithDoctor.length === 0) {
          return (
            <div className="text-center text-gray-400 text-sm">
              Chưa phân công
            </div>
          );
        }

        return (
          <div className="space-y-2">
            {appointmentsWithDoctor.map((appointment) => (
              <div
                key={appointment.appointmentId}
                className="flex items-center gap-2 p-2 bg-purple-50 rounded-lg"
              >
                <Avatar
                  size={32}
                  className="bg-gradient-to-br from-purple-500 to-indigo-600 flex-shrink-0"
                >
                  {appointment.doctor?.fullName?.charAt(0) || 'D'}
                </Avatar>
                <div className="flex-1 min-w-0">
                  <Tooltip title={appointment.doctor?.fullName}>
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {appointment.doctor?.fullName || 'N/A'}
                    </div>
                  </Tooltip>
                  <div className="text-xs text-gray-500">
                    Mũi {appointment.doseNumber}/{record.totalDoses}
                  </div>
                </div>
                {appointment.status !== 'COMPLETED' &&
                  appointment.status !== 'CANCELLED' && (
                    <Tooltip title="Chat với bác sĩ">
                      <Button
                        type="text"
                        size="small"
                        icon={<MessageOutlined className="text-blue-500" />}
                        onClick={() => handleOpenChat(record, appointment)}
                        className="flex-shrink-0"
                      />
                    </Tooltip>
                  )}
              </div>
            ))}
          </div>
        );
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'overallStatus',
      key: 'overallStatus',
      width: 120,
      render: (overallStatus) => (
        <Tag color={getStatusColor(overallStatus)} className="m-0">
          {getStatusText(overallStatus)}
        </Tag>
      ),
    },
    {
      title: 'Blockchain',
      key: 'blockchain',
      width: 140,
      render: (_, record) => (
        <div className="flex justify-center">
          <BlockchainVerifyBadge
            bookingId={record.bookingId}
            transactionHash={record.transactionHash}
            blockchainStatus={record.blockchainStatus}
          />
        </div>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <Space direction="vertical" size="small" className="w-full">
          <Button
            type="link"
            size="small"
            icon={<InfoCircleOutlined />}
            onClick={() => navigate(`/auth/certificate/${record.bookingId}`)}
            className="w-full p-0 h-auto text-left"
          >
            Chi tiết
          </Button>
          {record.progress?.completedDoses === record.progress?.totalDoses && (
            <Button
              type="link"
              size="small"
              icon={<SafetyCertificateOutlined />}
              onClick={() => navigate(`/auth/certificate/${record.bookingId}`)}
              className="w-full p-0 h-auto text-left text-green-600"
            >
              Chứng nhận
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {appointments?.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <Statistic
                title="Tổng số mũi tiêm"
                value={appointments.length}
                prefix={<MedicineBoxOutlined />}
              />
            </Card>
            <Card>
              <Statistic
                title="Đã hoàn thành"
                value={appointments.filter((a) => a.status === 2).length}
                prefix={<CheckCircleOutlined className="text-green-500" />}
              />
            </Card>
            <Card>
              <Statistic
                title="Đang chờ"
                value={
                  appointments.filter((a) => a.status === 0 || a.status === 1)
                    .length
                }
                prefix={<ClockCircleOutlined className="text-orange-500" />}
              />
            </Card>
            <Card>
              <Statistic
                title="Đã xác thực Blockchain"
                value={
                  appointments.filter((a) => a.blockchainStatus === 'CONFIRMED')
                    .length
                }
                prefix={
                  <SafetyCertificateOutlined className="text-purple-500" />
                }
              />
            </Card>
          </div>

          <Card title="Danh sách đăng ký" className="shadow-sm">
            <LoadingTable
              columns={columns}
              dataSource={appointments}
              loading={loadingAppointments}
              rowCount={5}
              timeout={1000}
              pagination={{
                pageSize: 5,
                showTotal: (total) => `Tổng ${total} lịch hẹn`,
              }}
              rowKey="bookingId"
              scroll={{ x: 1600 }}
              size="middle"
            />
          </Card>
        </>
      ) : (
        <Card>
          <div className="flex flex-col items-center justify-center py-16">
            <div className="mb-6 text-gray-300">
              <CalendarOutlined style={{ fontSize: 80 }} />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Bạn chưa có lịch tiêm chủng nào
            </h3>
            <p className="text-gray-400 mb-6 text-center max-w-md">
              Đặt lịch ngay để bảo vệ sức khỏe của bạn và người thân. Hệ thống
              sẽ lưu trữ lịch sử tiêm chủng trên blockchain để đảm bảo an toàn.
            </p>
            <Button
              type="primary"
              size="large"
              icon={<PlusOutlined />}
              onClick={() => (window.location.href = '/booking')}
            >
              Đặt lịch tiêm ngay
            </Button>
          </div>
        </Card>
      )}

      {/* Ghi chú */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="flex items-start">
          <InfoCircleOutlined className="text-blue-500 mt-1 mr-3" />
          <div>
            <h4 className="text-sm font-medium text-blue-700 mb-1">Lưu ý</h4>
            <ul className="text-sm text-blue-600 list-disc list-inside space-y-1">
              <li>Vui lòng đến đúng giờ theo lịch hẹn</li>
              <li>Mang theo CMND/CCCD khi đến tiêm</li>
              <li>
                Thông báo cho nhân viên y tế nếu có bất kỳ vấn đề sức khỏe
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Chat Modal */}
      <ChatModal
        visible={chatVisible}
        onClose={() => {
          setChatVisible(false);
          setSelectedAppointment(null);
          setSelectedDoctor(null);
        }}
        appointment={selectedAppointment}
        currentUser={{
          walletAddress: user?.walletAddress || user?.email,
          fullName: user?.fullName,
          role: 'PATIENT',
        }}
        otherUser={selectedDoctor}
      />
    </div>
  );
};

export default AppointmentHistory;
