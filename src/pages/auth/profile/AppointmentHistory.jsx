import React from 'react';
import { Card, Tag, Space, Button, Statistic } from 'antd';
import {
  MedicineBoxOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  InfoCircleOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import LoadingTable from '../../../components/share/LoadingTable';

/**
 * Component hiển thị lịch sử đăng ký tiêm chủng
 *
 * @param {Array} appointments - Danh sách lịch hẹn
 * @param {boolean} loadingAppointments - Trạng thái loading dữ liệu
 * @param {Function} handleCancel - Hàm xử lý khi hủy lịch hẹn
 */
const AppointmentHistory = ({
  appointments,
  loadingAppointments,
  handleCancel,
}) => {
  const navigate = useNavigate();

  const getStatusColor = (status) => {
    const statusMap = {
      PENDING: 'orange',
      CONFIRMED: 'blue',
      COMPLETED: 'green',
      CANCELLED: 'red',
    };
    return statusMap[status] || 'default';
  };

  const getStatusText = (status) => {
    const statusMap = {
      PENDING: 'Chờ thanh toán',
      CONFIRMED: 'Đã xác nhận',
      COMPLETED: 'Hoàn thành',
      CANCELLED: 'Đã hủy',
    };
    return statusMap[status] || status;
  };

  const columns = [
    {
      title: 'Mã đặt lịch',
      dataIndex: 'bookingId',
      key: 'bookingId',
      width: 100,
      render: (id) => <span className="font-mono text-blue-600">#{id}</span>,
    },
    {
      title: 'Vaccine',
      key: 'vaccine',
      render: (_, record) => (
        <div>
          <div className="flex items-center font-medium">
            <MedicineBoxOutlined className="mr-2" />
            {record.vaccine?.name || 'N/A'}
          </div>
          <div className="text-xs text-gray-500">{record.totalDoses} liều</div>
        </div>
      ),
    },
    {
      title: 'Trung tâm',
      key: 'center',
      render: (_, record) => (
        <div className="flex items-center">
          <EnvironmentOutlined className="mr-2" />
          <div>
            <div className="font-medium">{record.center?.name || 'N/A'}</div>
            <div className="text-xs text-gray-500">
              {record.center?.address}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Lịch hẹn',
      key: 'appointment',
      render: (_, record) => (
        <div>
          <div className="flex items-center">
            <CalendarOutlined className="mr-2" />
            {dayjs(record.firstDoseDate).format('DD/MM/YYYY')}
          </div>
          <div className="flex items-center text-xs text-gray-500">
            <ClockCircleOutlined className="mr-2" />
            {record.firstDoseTime}
          </div>
        </div>
      ),
    },
    {
      title: 'Thanh toán',
      key: 'payment',
      render: (_, record) => {
        const method = record.payment?.method;
        const methodMap = {
          CASH: { text: 'Tiền mặt', color: 'green' },
          PAYPAL: { text: 'PayPal', color: 'blue' },
          METAMASK: { text: 'MetaMask', color: 'purple' },
        };
        const info = methodMap[method] || {
          text: method || 'N/A',
          color: 'default',
        };
        return (
          <div>
            <Tag color={info.color}>{info.text}</Tag>
            <div className="text-xs text-gray-600 mt-1">
              {new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND',
              }).format(record.totalAmount || 0)}
            </div>
          </div>
        );
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<InfoCircleOutlined />}
            onClick={() => navigate(`/certificate/${record.bookingId}`)}
          >
            Chi tiết
          </Button>
          {record.status === 'COMPLETED' && (
            <Button
              type="primary"
              size="small"
              icon={<DownloadOutlined />}
              onClick={() => navigate(`/certificate/${record.bookingId}`)}
            >
              Xem chứng nhận
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {appointments?.length && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          </div>

          <Card title="Danh sách đăng ký">
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
            />
          </Card>
        </>
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
    </div>
  );
};

export default AppointmentHistory;
