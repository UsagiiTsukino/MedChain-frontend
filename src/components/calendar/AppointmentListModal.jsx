import { Modal, Button, List, Space, Typography, Tag, Badge } from 'antd';
import {
  ClockCircleOutlined,
  UserOutlined,
  MedicineBoxOutlined,
} from '@ant-design/icons';
import { getStatusBadge } from '../../utils/status';

const { Title, Text } = Typography;

const AppointmentListModal = ({
  isOpen,
  onClose,
  modalDate,
  onAppointmentClick,
  appointments,
  onViewDay,
}) => {
  return (
    <Modal
      title={
        <Space>
          <Title level={4} style={{ margin: 0 }}>
            Lịch hẹn - {modalDate?.format('DD/MM/YYYY')}
          </Title>
          <Tag color="blue">{modalDate?.format('dddd')}</Tag>
        </Space>
      }
      open={isOpen}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          Đóng
        </Button>,
        <Button key="viewDay" type="primary" onClick={onViewDay}>
          Xem chi tiết ngày
        </Button>,
      ]}
      width={700}
    >
      <List
        dataSource={modalDate ? appointments : []}
        locale={{ emptyText: 'Không có lịch hẹn nào trong ngày này' }}
        renderItem={(item) => (
          <List.Item
            key={item.id}
            className="appointment-item"
            onClick={() => onAppointmentClick(item)}
            style={{ cursor: 'pointer' }}
          >
            <List.Item.Meta
              avatar={
                <div className="appointment-time">
                  <ClockCircleOutlined />
                  <Text strong>{item.time}</Text>
                </div>
              }
              title={
                <Space>
                  <UserOutlined />
                  <Text strong>{item.patientName}</Text>
                </Space>
              }
              description={
                <Space direction="vertical" size="small">
                  <Space>
                    <MedicineBoxOutlined />
                    <Text>{item.vaccine}</Text>
                  </Space>
                  <Badge
                    status={getStatusBadge(item.status).color}
                    text={getStatusBadge(item.status).text}
                  />
                </Space>
              }
            />
          </List.Item>
        )}
      />
    </Modal>
  );
};

export default AppointmentListModal;
