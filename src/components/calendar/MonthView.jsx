import { Calendar, Card, Select, Button, Space } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import CalendarCell from './CalendarCell';

const MonthView = ({ selectedDate, setSelectedDate, setViewMode, onCellClick, appointmentsByDate }) => {
  const cellRender = (current, info) => {
    if (info.type === 'date') {
      return <CalendarCell value={current} onClick={onCellClick} appointmentsByDate={appointmentsByDate} />;
    }
    return info.originNode;
  };

  const onDateSelect = (date) => {
    setSelectedDate(date);
    if (onCellClick) {
      onCellClick(date);
    }
  };

  return (
    <Card>
      <Calendar
        value={selectedDate}
        onSelect={onDateSelect}
        cellRender={cellRender}
        headerRender={({ value, onChange }) => {
          const month = value.month();
          const year = value.year();

          const monthOptions = [];
          const localeData = value.localeData();
          const monthsShort = localeData.monthsShort();

          for (let i = 0; i < 12; i++) {
            monthOptions.push({
              label: monthsShort[i],
              value: i,
            });
          }

          const yearOptions = [];
          const currentYear = dayjs().year();
          for (let i = currentYear - 10; i <= currentYear + 10; i++) {
            yearOptions.push({
              label: i,
              value: i,
            });
          }

          return (
            <div className="calendar-header">
              <Space size="large" style={{ width: '100%', justifyContent: 'space-between' }}>
                <Space>
                  <Button
                    icon={<LeftOutlined />}
                    onClick={() => {
                      const prevMonth = value.clone().subtract(1, 'month');
                      onChange(prevMonth);
                      setSelectedDate(prevMonth);
                    }}
                  >
                    Tháng trước
                  </Button>
                  <Select
                    value={month}
                    options={monthOptions}
                    onChange={(newMonth) => {
                      const newValue = value.clone().month(newMonth);
                      onChange(newValue);
                      setSelectedDate(newValue);
                    }}
                  />
                  <Select
                    value={year}
                    options={yearOptions}
                    onChange={(newYear) => {
                      const newValue = value.clone().year(newYear);
                      onChange(newValue);
                      setSelectedDate(newValue);
                    }}
                  />
                  <Button
                    icon={<RightOutlined />}
                    iconPosition="end"
                    onClick={() => {
                      const nextMonth = value.clone().add(1, 'month');
                      onChange(nextMonth);
                      setSelectedDate(nextMonth);
                    }}
                  >
                    Tháng sau
                  </Button>
                  <Button
                    onClick={() => {
                      const today = dayjs();
                      onChange(today);
                      setSelectedDate(today);
                    }}
                  >
                    Hôm nay
                  </Button>
                </Space>
                
                {setViewMode && (
                  <Space>
                    <Button onClick={() => setViewMode('week')}>
                      Xem theo tuần
                    </Button>
                    <Button onClick={() => setViewMode('day')}>
                      Xem theo ngày
                    </Button>
                  </Space>
                )}
              </Space>
            </div>
          );
        }}
      />
    </Card>
  );
};

export default MonthView;
