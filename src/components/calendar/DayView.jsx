import { Card, Button, Space, Typography, List, Tag, Badge } from 'antd';
import {
  ClockCircleOutlined,
  UserOutlined,
  MedicineBoxOutlined,
  LeftOutlined,
  RightOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { getStatusBadge } from '../../utils/status';

const { Title, Text } = Typography;

const DayView = ({
  selectedDate,
  setSelectedDate,
  setViewMode,
  onAppointmentClick,
  appointments,
}) => {
 

  return (
    <Card
      title={
        <Space>
          <Title level={4} style={{ margin: 0 }}>
            Lịch hẹn - {selectedDate.format('DD/MM/YYYY')}
          </Title>
          <Tag color="blue">{selectedDate.format('dddd')}</Tag>
        </Space>
      }
      extra={
        <Space>
          <Button
            icon={<LeftOutlined />}
            onClick={() => setSelectedDate(selectedDate.subtract(1, 'day'))}
          >
            Ngày trước
          </Button>
          <Button onClick={() => setSelectedDate(dayjs())}>Hôm nay</Button>
          <Button
            icon={<RightOutlined />}
            iconPosition="end"
            onClick={() => setSelectedDate(selectedDate.add(1, 'day'))}
          >
            Ngày sau
          </Button>
          <Button onClick={() => setViewMode('month')}>Quay lại tháng</Button>
        </Space>
      }
    >
      <List
        dataSource={appointments}
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
    </Card>
  );
};

export default DayView;
