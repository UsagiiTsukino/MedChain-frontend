import React, { useEffect, useState } from 'react';
import {
  Card,
  Tag,
  Button,
  Space,
  message,
  Tooltip,
  Modal,
  Descriptions,
  Divider,
} from 'antd';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  ReloadOutlined,
  EyeOutlined,
  CalendarOutlined,
  UserOutlined,
  MedicineBoxOutlined,
  EnvironmentOutlined,
  DollarOutlined,
} from '@ant-design/icons';
import { callAllBookings } from '../../config/api.appointment';
import dayjs from 'dayjs';
import LoadingTable from '../../components/share/LoadingTable';
import useLoadingData from '../../utils/withLoadingData';

const AppointmentManagementPage = () => {
  const { confirm } = Modal;
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Sử dụng custom hook để quản lý trạng thái loading
  const {
    loading,
    data: appointments,
    fetchData: fetchAppointments,
  } = useLoadingData(
    async () => {
      const response = await callAllBookings();
      const data = response?.data?.data || response?.data || response;
      const result = data?.result || data || [];

      // Debug: Check data structure
      if (result.length > 0) {
        // eslint-disable-next-line no-console
        console.log('[Appointments] First item:', result[0]);
      }

      return result;
    },
    {
      errorMessage: 'Không thể tải danh sách lịch hẹn',
      timeout: 1000,
    }
  );

  useEffect(() => {
    fetchAppointments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleComplete = () => {
    confirm({
      title: 'Xác nhận hoàn thành',
      icon: <CheckCircleOutlined />,
      content: 'Xác nhận bệnh nhân đã hoàn thành tiêm chủng?',
      async onOk() {
        try {
          // TODO: Add API endpoint
          message.success('Cập nhật trạng thái thành công');
          fetchAppointments();
        } catch {
          message.error('Cập nhật thất bại');
        }
      },
    });
  };

  const handleCancel = () => {
    confirm({
      title: 'Xác nhận hủy lịch',
      icon: <ExclamationCircleOutlined />,
      content: 'Bạn có chắc chắn muốn hủy lịch hẹn này?',
      async onOk() {
        try {
          // TODO: Add API endpoint
          message.success('Hủy lịch thành công');
          fetchAppointments();
        } catch {
          message.error('Hủy lịch thất bại');
        }
      },
    });
  };

  const handleViewDetail = (booking) => {
    setSelectedBooking(booking);
    setDetailModalVisible(true);
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
      title: 'Bệnh nhân',
      dataIndex: ['patient', 'fullName'],
      key: 'patientName',
      render: (name, record) => (
        <div>
          <div className="font-medium">{name || 'N/A'}</div>
          <div className="text-xs text-gray-500">{record.patient?.email}</div>
        </div>
      ),
    },
    {
      title: 'Vaccine',
      dataIndex: ['vaccine', 'name'],
      key: 'vaccineName',
      render: (name, record) => (
        <div>
          <div className="font-medium">{name || 'N/A'}</div>
          <div className="text-xs text-gray-500">
            {record.totalDoses} liều -{' '}
            {new Intl.NumberFormat('vi-VN', {
              style: 'currency',
              currency: 'VND',
            }).format(record.totalAmount || 0)}
          </div>
        </div>
      ),
    },
    {
      title: 'Trung tâm',
      dataIndex: ['center', 'name'],
      key: 'centerName',
      render: (name, record) => (
        <div>
          <div className="font-medium">{name || 'N/A'}</div>
          <div className="text-xs text-gray-500">{record.center?.address}</div>
        </div>
      ),
    },
    {
      title: 'Lịch hẹn',
      key: 'appointment',
      render: (_, record) => (
        <div>
          <div className="flex items-center gap-1">
            <CalendarOutlined className="text-blue-500" />
            <span>{dayjs(record.firstDoseDate).format('DD/MM/YYYY')}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <ClockCircleOutlined />
            <span>{record.firstDoseTime}</span>
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
        return <Tag color={info.color}>{info.text}</Tag>;
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const statusMap = {
          PENDING: {
            text: 'Chờ thanh toán',
            color: 'warning',
            icon: <ClockCircleOutlined />,
          },
          CONFIRMED: {
            text: 'Đã xác nhận',
            color: 'processing',
            icon: <CheckCircleOutlined />,
          },
          COMPLETED: {
            text: 'Hoàn thành',
            color: 'success',
            icon: <CheckCircleOutlined />,
          },
          CANCELLED: {
            text: 'Đã hủy',
            color: 'error',
            icon: <CloseCircleOutlined />,
          },
        };
        const info = statusMap[status] || {
          text: status,
          color: 'default',
          icon: <ExclamationCircleOutlined />,
        };
        return (
          <Tag icon={info.icon} color={info.color}>
            {info.text}
          </Tag>
        );
      },
    },
    {
      title: 'Tiến độ',
      dataIndex: 'overallStatus',
      key: 'overallStatus',
      render: (status) => {
        const statusMap = {
          PROGRESS: { text: 'Đang tiêm', color: 'blue' },
          COMPLETED: { text: 'Hoàn tất', color: 'green' },
          CANCELLED: { text: 'Đã hủy', color: 'red' },
        };
        const info = statusMap[status] || { text: status, color: 'default' };
        return <Tag color={info.color}>{info.text}</Tag>;
      },
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space>
          <Tooltip title="Xem chi tiết">
            <Button
              type="link"
              icon={<EyeOutlined />}
              onClick={() => handleViewDetail(record)}
            />
          </Tooltip>
          {record.status === 'CONFIRMED' && (
            <Tooltip title="Xác nhận đã tiêm">
              <Button
                type="link"
                icon={<CheckCircleOutlined />}
                onClick={() => handleComplete(record.bookingId)}
              />
            </Tooltip>
          )}
          {record.status === 'PENDING' && (
            <Tooltip title="Hủy lịch">
              <Button
                type="link"
                danger
                icon={<CloseCircleOutlined />}
                onClick={() => handleCancel(record.bookingId)}
              />
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  return (
    <>
      <Modal
        title={
          <div className="text-xl font-semibold">
            Chi tiết đặt lịch #{selectedBooking?.bookingId}
          </div>
        }
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            Đóng
          </Button>,
        ]}
        width={800}
      >
        {selectedBooking && (
          <div className="space-y-4">
            <Divider orientation="left">
              <UserOutlined /> Thông tin bệnh nhân
            </Divider>
            <Descriptions column={2} bordered size="small">
              <Descriptions.Item label="Họ tên" span={2}>
                {selectedBooking.patient?.fullName || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {selectedBooking.patient?.email || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">
                {selectedBooking.patient?.phoneNumber || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Địa chỉ" span={2}>
                {selectedBooking.patient?.address || 'N/A'}
              </Descriptions.Item>
            </Descriptions>

            <Divider orientation="left">
              <MedicineBoxOutlined /> Thông tin vaccine
            </Divider>
            <Descriptions column={2} bordered size="small">
              <Descriptions.Item label="Tên vaccine" span={2}>
                {selectedBooking.vaccine?.name || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Nhà sản xuất">
                {selectedBooking.vaccine?.manufacturer || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Xuất xứ">
                {selectedBooking.vaccine?.country || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Tổng số liều">
                {selectedBooking.totalDoses || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Giá mỗi liều">
                {selectedBooking.vaccine?.price
                  ? new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND',
                    }).format(selectedBooking.vaccine.price)
                  : 'N/A'}
              </Descriptions.Item>
            </Descriptions>

            <Divider orientation="left">
              <EnvironmentOutlined /> Thông tin trung tâm
            </Divider>
            <Descriptions column={2} bordered size="small">
              <Descriptions.Item label="Tên trung tâm" span={2}>
                {selectedBooking.center?.name || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Địa chỉ" span={2}>
                {selectedBooking.center?.address || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">
                {selectedBooking.center?.phoneNumber || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Giờ làm việc">
                {selectedBooking.center?.workingHours || 'N/A'}
              </Descriptions.Item>
            </Descriptions>

            <Divider orientation="left">
              <CalendarOutlined /> Lịch hẹn & Thanh toán
            </Divider>
            <Descriptions column={2} bordered size="small">
              <Descriptions.Item label="Ngày hẹn">
                {dayjs(selectedBooking.firstDoseDate).format('DD/MM/YYYY')}
              </Descriptions.Item>
              <Descriptions.Item label="Giờ hẹn">
                {selectedBooking.firstDoseTime}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                {selectedBooking.status === 'PENDING' && (
                  <Tag icon={<ClockCircleOutlined />} color="warning">
                    Chờ thanh toán
                  </Tag>
                )}
                {selectedBooking.status === 'CONFIRMED' && (
                  <Tag icon={<CheckCircleOutlined />} color="processing">
                    Đã xác nhận
                  </Tag>
                )}
                {selectedBooking.status === 'COMPLETED' && (
                  <Tag icon={<CheckCircleOutlined />} color="success">
                    Hoàn thành
                  </Tag>
                )}
                {selectedBooking.status === 'CANCELLED' && (
                  <Tag icon={<CloseCircleOutlined />} color="error">
                    Đã hủy
                  </Tag>
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Tiến độ">
                {selectedBooking.overallStatus === 'PROGRESS' && (
                  <Tag color="blue">Đang tiêm</Tag>
                )}
                {selectedBooking.overallStatus === 'COMPLETED' && (
                  <Tag color="green">Hoàn tất</Tag>
                )}
                {selectedBooking.overallStatus === 'CANCELLED' && (
                  <Tag color="red">Đã hủy</Tag>
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Phương thức thanh toán">
                {selectedBooking.payment?.method === 'CASH' && (
                  <Tag color="green">Tiền mặt</Tag>
                )}
                {selectedBooking.payment?.method === 'PAYPAL' && (
                  <Tag color="blue">PayPal</Tag>
                )}
                {selectedBooking.payment?.method === 'METAMASK' && (
                  <Tag color="purple">MetaMask</Tag>
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Tổng tiền">
                <span className="text-lg font-semibold text-green-600">
                  {new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                  }).format(selectedBooking.totalAmount || 0)}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="Ngày tạo" span={2}>
                {dayjs(selectedBooking.createdAt).format('DD/MM/YYYY HH:mm:ss')}
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Modal>

      <div className="p-6">
        <Card
          title={
            <div className="flex items-center gap-2">
              <CalendarOutlined className="text-blue-500" />
              <span className="text-xl font-semibold">
                Quản lý đặt lịch tiêm chủng
              </span>
            </div>
          }
          extra={
            <Button
              type="primary"
              icon={<ReloadOutlined />}
              onClick={() => fetchAppointments()}
            >
              Làm mới
            </Button>
          }
        >
          <LoadingTable
            columns={columns}
            dataSource={appointments}
            loading={loading}
            rowKey="bookingId"
            pagination={{
              pageSize: 10,
              showTotal: (total) => `Tổng ${total} đặt lịch`,
              showSizeChanger: true,
              pageSizeOptions: ['10', '20', '50'],
            }}
          />
        </Card>
      </div>
    </>
  );
};

export default AppointmentManagementPage;
