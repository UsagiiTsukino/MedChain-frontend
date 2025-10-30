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
    switch (status) {
      case 0:
        return 'orange';
      case 2:
        return 'green';
      case 3:
        return 'red';
      default:
        return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 0:
        return 'Chờ xác nhận';
      case 1:
        return 'Chờ tiêm';
      case 2:
        return 'Đã tiêm';
      default:
        return 'Đã hủy';
    }
  };

  const columns = [
    {
      title: 'Vaccine',
      dataIndex: 'vaccineName',
      key: 'vaccineName',
      render: (text) => (
        <div className="flex items-center">
          <MedicineBoxOutlined className="mr-2" />
          {text}
        </div>
      ),
    },
    {
      title: 'Cơ sở tiêm chủng',
      dataIndex: 'centerName',
      key: 'centerName',
      render: (text) => (
        <div className="flex items-center">
          <EnvironmentOutlined className="mr-2" />
          {text}
        </div>
      ),
    },
    {
      title: 'Ngày tiêm',
      dataIndex: 'date',
      key: 'date',
      render: (text) => (
        <div className="flex items-center">
          <CalendarOutlined className="mr-2" />
          {dayjs(text).format('DD/MM/YYYY')}
        </div>
      ),
    },
    {
      title: 'Giờ tiêm',
      dataIndex: 'time',
      key: 'time',
      render: (text) => (
        <div className="flex items-center">
          <ClockCircleOutlined className="mr-2" />
          {text}
        </div>
      ),
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
          {record.status === 4 && <Tag color="green">Đã hoàn tiền</Tag>}
          {record.status === 3 && <Tag color="red">Đợi hoàn tiền</Tag>}
          {(record.status === 1 || record.status === 0) && (
            <Button
              type="link"
              danger
              size="small"
              onClick={() => handleCancel(record.appointmentId)}
            >
              Hủy
            </Button>
          )}
          {record.status === 2 && (
            <Button
              type="link"
              size="small"
              icon={<DownloadOutlined />}
              onClick={() =>
                navigate(`/auth/certificate/${record.appointmentId}`)
              }
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
              rowKey="appointmentId"
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
