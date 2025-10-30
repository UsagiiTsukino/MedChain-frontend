import { Modal, Button, Card, Space, Typography, Tag, Badge } from 'antd';
import { ClockCircleOutlined, MedicineBoxOutlined } from '@ant-design/icons';
import { getStatusBadge } from '../../utils/status';

const { Title, Text } = Typography;

const AppointmentDetailModal = ({ isOpen, onClose, appointment }) => {
  if (!appointment) return null;

  return (
    <Modal
      title={
        <Space>
          <MedicineBoxOutlined style={{ fontSize: '20px', color: '#1890ff' }} />
          <Title level={4} style={{ margin: 0 }}>
            Chi tiết lịch hẹn
          </Title>
        </Space>
      }
      open={isOpen}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          Đóng
        </Button>,
        <Button
          key="edit"
          type="primary"
          onClick={() => {
            // TODO: Implement edit functionality
            // eslint-disable-next-line no-console
            console.log('Edit appointment:', appointment);
          }}
        >
          Chỉnh sửa
        </Button>,
      ]}
      width={600}
    >
      <div className="appointment-detail">
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          {/* Thông tin bệnh nhân */}
          <Card size="small" title="👤 Thông tin bệnh nhân">
            <Space direction="vertical" style={{ width: '100%' }}>
              <div>
                <Text strong>Họ và tên: </Text>
                <Text>{appointment.patientName}</Text>
              </div>
              <div>
                <Text strong>Số điện thoại: </Text>
                <Text>{appointment.patientPhone}</Text>
              </div>
              <div>
                <Text strong>Email: </Text>
                <Text>{appointment.patientEmail}</Text>
              </div>
            </Space>
          </Card>

          {/* Thông tin lịch hẹn */}
          <Card size="small" title="📅 Thông tin lịch hẹn">
            <Space direction="vertical" style={{ width: '100%' }}>
              <div>
                <Text strong>Thời gian: </Text>
                <Tag color="blue" icon={<ClockCircleOutlined />}>
                  {appointment.time}
                </Tag>
              </div>
              <div>
                <Text strong>Trạng thái: </Text>
                <Badge 
                  status={getStatusBadge(appointment.status).color} 
                  text={getStatusBadge(appointment.status).text} 
                />
              </div>
            </Space>
          </Card>

          {/* Thông tin vaccine */}
          <Card size="small" title="💉 Thông tin vaccine">
            <Space direction="vertical" style={{ width: '100%' }}>
              <div>
                <Text strong>Loại vaccine: </Text>
                <Text>{appointment.vaccine}</Text>
              </div>
              <div>
                <Text strong>Liều: </Text>
                <Tag color="green">{appointment.vaccineDose}</Tag>
              </div>
              <div>
                <Text strong>Bác sĩ phụ trách: </Text>
                <Text>{appointment.doctorName}</Text>
              </div>
              <div>
                <Text strong>Trung tâm: </Text>
                <Text>{appointment.centerName}</Text>
              </div>
            </Space>
          </Card>

          {/* Ghi chú */}
          {appointment.notes && (
            <Card size="small" title="📝 Ghi chú">
              <Text>{appointment.notes}</Text>
            </Card>
          )}
        </Space>
      </div>
    </Modal>
  );
};

export default AppointmentDetailModal;
