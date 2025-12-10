import React from 'react';
import {
  Card,
  Col,
  Row,
  Statistic,
  List,
  Typography,
  Tag,
  Avatar,
  Progress,
  Badge,
} from 'antd';
import { useSelector } from 'react-redux';
import {
  UserOutlined,
  MedicineBoxOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  TeamOutlined,
  TrophyOutlined,
  RiseOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';

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
      date: '2024-12-15',
      status: 'confirmed',
      vaccine: 'Covid-19',
    },
    {
      id: 2,
      patientName: 'Trần Thị B',
      time: '10:30',
      date: '2024-12-15',
      status: 'pending',
      vaccine: 'Cúm mùa',
    },
    {
      id: 3,
      patientName: 'Lê Văn C',
      time: '14:00',
      date: '2024-12-16',
      status: 'confirmed',
      vaccine: 'Viêm gan B',
    },
  ];

  const recentVaccinations = [
    {
      id: 1,
      patientName: 'Phạm Thị D',
      date: '2024-12-14',
      vaccine: 'Covid-19',
      dose: 2,
    },
    {
      id: 2,
      patientName: 'Hoàng Văn E',
      date: '2024-12-14',
      vaccine: 'HPV',
      dose: 1,
    },
    {
      id: 3,
      patientName: 'Ngô Thị F',
      date: '2024-12-13',
      vaccine: 'Viêm gan B',
      dose: 3,
    },
  ];

  const statsData = [
    {
      title: 'Lịch hẹn hôm nay',
      value: 200,
      icon: <CalendarOutlined />,
      gradient: 'from-blue-500 to-cyan-600',
      bgGradient: 'from-blue-50 to-cyan-50',
      iconColor: 'text-blue-600',
      progress: 85,
      trend: '+12%',
    },
    {
      title: 'Đã xác nhận',
      value: 120,
      icon: <CheckCircleOutlined />,
      gradient: 'from-green-500 to-emerald-600',
      bgGradient: 'from-green-50 to-emerald-50',
      iconColor: 'text-green-600',
      progress: 60,
      trend: '+8%',
    },
    {
      title: 'Chờ xử lý',
      value: 70,
      icon: <ClockCircleOutlined />,
      gradient: 'from-orange-500 to-amber-600',
      bgGradient: 'from-orange-50 to-amber-50',
      iconColor: 'text-orange-600',
      progress: 35,
      trend: '-5%',
    },
    {
      title: 'Đã hủy',
      value: 10,
      icon: <CloseCircleOutlined />,
      gradient: 'from-red-500 to-rose-600',
      bgGradient: 'from-red-50 to-rose-50',
      iconColor: 'text-red-600',
      progress: 5,
      trend: '-2%',
    },
  ];

  const getStatusConfig = (status) => {
    const configs = {
      confirmed: {
        color: 'success',
        text: 'Đã xác nhận',
        icon: <CheckCircleOutlined />,
      },
      pending: {
        color: 'warning',
        text: 'Chờ xác nhận',
        icon: <ClockCircleOutlined />,
      },
      cancelled: {
        color: 'error',
        text: 'Đã hủy',
        icon: <CloseCircleOutlined />,
      },
    };
    return configs[status] || configs.pending;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-3">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
            <TeamOutlined className="text-white text-2xl" />
          </div>
          <div>
            <Title level={2} className="m-0">
              Xin chào,{' '}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {user.fullName}
              </span>
            </Title>
            <Text className="text-gray-500">
              {user.role === 'DOCTOR' ? '👨‍⚕️ Bác sĩ' : '💼 Thu ngân'} tại{' '}
              {user.centerName} • {dayjs().format('DD/MM/YYYY')}
            </Text>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]}>
        {statsData.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card
              className={`border-0 shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 bg-gradient-to-br ${stat.bgGradient}`}
              bodyStyle={{ padding: '20px' }}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <Text className="text-gray-600 text-sm font-medium block mb-2">
                    {stat.title}
                  </Text>
                  <div className="flex items-baseline gap-2">
                    <span
                      className={`text-3xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}
                    >
                      {stat.value}
                    </span>
                    <Tag
                      color={stat.trend.startsWith('+') ? 'success' : 'error'}
                      className="text-xs"
                    >
                      {stat.trend}
                    </Tag>
                  </div>
                </div>
                <div
                  className={`h-12 w-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-md`}
                >
                  <span className="text-white text-xl">{stat.icon}</span>
                </div>
              </div>
              <Progress
                percent={stat.progress}
                strokeColor={{
                  '0%':
                    stat.gradient.split(' ')[1]?.replace('from-', '') ||
                    '#3b82f6',
                  '100%':
                    stat.gradient.split(' ')[3]?.replace('to-', '') ||
                    '#06b6d4',
                }}
                showInfo={false}
                size="small"
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* Main Content */}
      <Row gutter={[16, 16]}>
        {/* Upcoming Appointments */}
        <Col xs={24} lg={16}>
          <Card
            className="border-0 shadow-lg"
            title={
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-md">
                  <CalendarOutlined className="text-white text-lg" />
                </div>
                <div>
                  <div className="text-lg font-bold text-gray-900">
                    Lịch hẹn sắp tới
                  </div>
                  <div className="text-xs text-gray-500">
                    Các lịch hẹn trong ngày hôm nay
                  </div>
                </div>
              </div>
            }
            extra={
              <Badge
                count={upcomingAppointments.length}
                showZero
                className="shadow-sm"
              />
            }
          >
            <List
              dataSource={upcomingAppointments}
              renderItem={(item) => {
                const statusConfig = getStatusConfig(item.status);
                return (
                  <List.Item className="hover:bg-gray-50 rounded-lg transition-all px-4">
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          size={48}
                          className="bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md"
                        >
                          {item.patientName.charAt(0)}
                        </Avatar>
                      }
                      title={
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900">
                            {item.patientName}
                          </span>
                          <Tag color="blue" className="text-xs">
                            {item.vaccine}
                          </Tag>
                        </div>
                      }
                      description={
                        <div className="flex items-center gap-3 text-sm">
                          <span className="flex items-center gap-1">
                            <CalendarOutlined className="text-gray-400" />
                            {dayjs(item.date).format('DD/MM/YYYY')}
                          </span>
                          <span className="flex items-center gap-1">
                            <ClockCircleOutlined className="text-gray-400" />
                            {item.time}
                          </span>
                        </div>
                      }
                    />
                    <div>
                      <Tag
                        color={statusConfig.color}
                        icon={statusConfig.icon}
                        className="px-3 py-1"
                      >
                        {statusConfig.text}
                      </Tag>
                    </div>
                  </List.Item>
                );
              }}
            />
          </Card>
        </Col>

        {/* Recent Vaccinations */}
        <Col xs={24} lg={8}>
          <Card
            className="border-0 shadow-lg"
            title={
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-md">
                  <MedicineBoxOutlined className="text-white text-lg" />
                </div>
                <div>
                  <div className="text-lg font-bold text-gray-900">
                    Hoạt động gần đây
                  </div>
                  <div className="text-xs text-gray-500">
                    Lịch sử tiêm chủng
                  </div>
                </div>
              </div>
            }
          >
            <List
              dataSource={recentVaccinations}
              renderItem={(item) => (
                <List.Item className="hover:bg-gray-50 rounded-lg transition-all px-2">
                  <List.Item.Meta
                    avatar={
                      <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
                        <MedicineBoxOutlined className="text-green-600" />
                      </div>
                    }
                    title={
                      <span className="font-medium text-gray-900 text-sm">
                        {item.patientName}
                      </span>
                    }
                    description={
                      <div className="space-y-1">
                        <div className="text-xs text-gray-500">
                          {item.vaccine}
                        </div>
                        <div className="flex items-center gap-2">
                          <Tag color="success" className="text-xs m-0">
                            Mũi {item.dose}
                          </Tag>
                          <span className="text-xs text-gray-400">
                            {dayjs(item.date).format('DD/MM')}
                          </span>
                        </div>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      {/* Performance Summary */}
      {isDoctorRole && (
        <Card
          className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-indigo-50"
          title={
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-md">
                <TrophyOutlined className="text-white text-lg" />
              </div>
              <div>
                <div className="text-lg font-bold text-gray-900">
                  Hiệu suất làm việc
                </div>
                <div className="text-xs text-gray-500">
                  Thống kê trong tháng này
                </div>
              </div>
            </div>
          }
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={8}>
              <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                <RiseOutlined className="text-3xl text-purple-600 mb-2" />
                <div className="text-2xl font-bold text-gray-900 mb-1">95%</div>
                <div className="text-sm text-gray-500">Tỷ lệ hoàn thành</div>
              </div>
            </Col>
            <Col xs={24} sm={8}>
              <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                <UserOutlined className="text-3xl text-blue-600 mb-2" />
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  1,234
                </div>
                <div className="text-sm text-gray-500">Bệnh nhân đã khám</div>
              </div>
            </Col>
            <Col xs={24} sm={8}>
              <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                <MedicineBoxOutlined className="text-3xl text-green-600 mb-2" />
                <div className="text-2xl font-bold text-gray-900 mb-1">567</div>
                <div className="text-sm text-gray-500">Liều vaccine tiêm</div>
              </div>
            </Col>
          </Row>
        </Card>
      )}
    </div>
  );
};

export default StaffDashboard;
