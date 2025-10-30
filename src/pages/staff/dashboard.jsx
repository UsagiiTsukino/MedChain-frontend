/* eslint-disable react/jsx-key */
import React from 'react';
import {
  Card,
  Col,
  Row,
  Statistic,
  Calendar,
  Alert,
  List,
  Typography,
  Tag,
} from 'antd';
import { useSelector } from 'react-redux';
import {
  UserOutlined,
  MedicineBoxOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;

const StaffDashboard = () => {
  const user = useSelector((state) => state.account.user);
  const isDoctorRole = user.role === 'DOCTOR';

  // Mock data - would be replaced with actual API calls
  const upcomingAppointments = [
    {
      id: 1,
      patientName: 'Nguyễn Văn A',
      time: '09:00',
      date: '2023-05-15',
      status: 'confirmed',
      vaccine: 'Covid-19',
    },
    {
      id: 2,
      patientName: 'Trần Thị B',
      time: '10:30',
      date: '2023-05-15',
      status: 'pending',
      vaccine: 'Cúm mùa',
    },
    {
      id: 3,
      patientName: 'Lê Văn C',
      time: '14:00',
      date: '2023-05-16',
      status: 'confirmed',
      vaccine: 'Viêm gan B',
    },
  ];

  const recentVaccinations = [
    {
      id: 1,
      patientName: 'Phạm Thị D',
      date: '2023-05-14',
      vaccine: 'Covid-19',
      dose: 2,
    },
    {
      id: 2,
      patientName: 'Hoàng Văn E',
      date: '2023-05-14',
      vaccine: 'HPV',
      dose: 1,
    },
    {
      id: 3,
      patientName: 'Ngô Thị F',
      date: '2023-05-13',
      vaccine: 'Viêm gan B',
      dose: 3,
    },
  ];

  return (
    <div className="p-6">
      <Title level={2}>Xin chào, {user.fullName.toUpperCase()}</Title>
      <Text type="secondary" className="mb-6 block">
        {user.role === 'DOCTOR' ? 'Bác sĩ' : 'Nhân viên thu ngân'} tại{' '}
        {user.centerName}
      </Text>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false}>
            <Statistic
              title="Lịch hẹn hôm nay"
              value={200}
              prefix={<CalendarOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false}>
            <Statistic
              title="Số đơn đã xác nhận"
              value={120}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false}>
            <Statistic
              title="Số đơn bị hủy"
              value={10}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false}>
            <Statistic
              title="Số đơn chờ xử lý"
              value={70}
              prefix={<MedicineBoxOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} lg={16}>
          <Card title="Lịch hẹn sắp tới" bordered={false} className="h-full">
            <List
              dataSource={upcomingAppointments}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <Tag
                      color={item.status === 'confirmed' ? 'green' : 'orange'}
                    >
                      {item.status === 'confirmed'
                        ? 'Đã xác nhận'
                        : 'Chờ xác nhận'}
                    </Tag>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={<CalendarOutlined style={{ fontSize: 24 }} />}
                    title={`${item.patientName} - ${item.vaccine}`}
                    description={`${item.date} lúc ${item.time}`}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title="Tiêm chủng gần đây" bordered={false} className="h-full">
            <List
              dataSource={recentVaccinations}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      isDoctorRole ? (
                        <MedicineBoxOutlined style={{ fontSize: 24 }} />
                      ) : (
                        <ClockCircleOutlined style={{ fontSize: 24 }} />
                      )
                    }
                    title={`${item.patientName} - ${item.vaccine}`}
                    description={`${item.date}${
                      isDoctorRole ? ` - Mũi ${item.dose}` : ''
                    }`}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default StaffDashboard;
