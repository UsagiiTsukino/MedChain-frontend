import { Card, Button, Space, Typography, List, Badge } from 'antd';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const WeekView = ({ selectedDate, setSelectedDate, setViewMode, onAppointmentClick, appointments = {} }) => {
  const weekStart = selectedDate.startOf('isoWeek');
  const weekDays = Array.from({ length: 7 }, (_, i) => weekStart.add(i, 'day'));

  return (
    <Card
      title={
        <Space>
          <Title level={4} style={{ margin: 0 }}>
            Tuần {selectedDate.isoWeek()} - {selectedDate.year()}
          </Title>
          <Text type="secondary">
            ({weekStart.format('DD/MM')} - {weekStart.add(6, 'day').format('DD/MM/YYYY')})
          </Text>
        </Space>
      }
      extra={
        <Space>
          <Button onClick={() => setSelectedDate(selectedDate.subtract(1, 'week'))}>
            Tuần trước
          </Button>
          <Button onClick={() => setSelectedDate(dayjs())}>Hôm nay</Button>
          <Button onClick={() => setSelectedDate(selectedDate.add(1, 'week'))}>
            Tuần sau
          </Button>
          <Button onClick={() => setViewMode('month')}>Quay lại tháng</Button>
        </Space>
      }
    >
      <div className="week-view">
        {weekDays.map((day) => {
          const isToday = day.isSame(dayjs(), 'day');

          return (
            <div
              key={day.format('YYYY-MM-DD')}
              className={`week-day ${isToday ? 'today' : ''}`}
            >
              <div className="week-day-header">
                <Text strong>{day.format('ddd')}</Text>
                <Text className="week-day-date">{day.format('DD')}</Text>
              </div>
              <div className="week-day-content">
                {appointments.length > 0 ? (
                  <List
                    size="small"
                    dataSource={appointments}
                    renderItem={(item) => (
                      <List.Item
                        className="week-appointment"
                        onClick={() => onAppointmentClick(item)}
                        style={{ cursor: 'pointer' }}
                      >
                        <Space direction="vertical" size="small" style={{ width: '100%' }}>
                          <Text strong className="week-time">
                            {item.time}
                          </Text>
                          <Text ellipsis className="week-patient">
                            {item.patientName}
                          </Text>
                          <Text type="secondary" className="week-vaccine">
                            {item.vaccine}
                          </Text>
                          <Badge
                            status={item.status === 'confirmed' ? 'success' : 'warning'}
                            text={item.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                          />
                        </Space>
                      </List.Item>
                    )}
                  />
                ) : (
                  <Text type="secondary" className="no-appointments">
                    Không có lịch hẹn
                  </Text>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default WeekView;
