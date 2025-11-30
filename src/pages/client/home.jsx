import {
  Button,
  Card,
  Statistic,
  Row,
  Col,
  List,
  Tag,
  Empty,
  Spin,
} from 'antd';
import { useNavigate } from 'react-router-dom';
import {
  ShoppingOutlined,
  CalendarOutlined,
  SafetyCertificateOutlined,
  MedicineBoxOutlined,
  RocketOutlined,
  CheckCircleOutlined,
  QrcodeOutlined,
  SafetyOutlined,
  GlobalOutlined,
  ArrowRightOutlined,
  UserOutlined,
  EnvironmentOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchVaccine } from '../../redux/slice/vaccineSlice';
import queryString from 'query-string';

const HomePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.account.isAuthenticated);

  // Fetch featured vaccines
  const [featuredVaccines, setFeaturedVaccines] = useState([]);
  const [loadingVaccines, setLoadingVaccines] = useState(true);

  useEffect(() => {
    const fetchFeaturedVaccines = async () => {
      try {
        setLoadingVaccines(true);
        const query = queryString.stringify({ page: 0, size: 3 });
        const response = await dispatch(fetchVaccine({ query })).unwrap();
        if (response && response.result) {
          setFeaturedVaccines(response.result.slice(0, 3));
        }
      } catch {
        // Silently handle error - vaccines section will show empty state
      } finally {
        setLoadingVaccines(false);
      }
    };

    fetchFeaturedVaccines();
  }, [dispatch]);

  const features = [
    {
      icon: <MedicineBoxOutlined className="text-4xl text-blue-500" />,
      title: 'Chợ Vaccine',
      description:
        'Khám phá và đặt mua vaccine từ các nhà cung cấp uy tín trên toàn quốc.',
      link: '/market',
      color: 'blue',
    },
    {
      icon: <CalendarOutlined className="text-4xl text-green-500" />,
      title: 'Đặt lịch tiêm',
      description:
        'Đặt lịch hẹn tiêm chủng dễ dàng với các trung tâm y tế gần bạn.',
      link: '/booking',
      color: 'green',
    },
    {
      icon: <SafetyCertificateOutlined className="text-4xl text-purple-500" />,
      title: 'Hồ sơ & Chứng nhận',
      description:
        'Quản lý hồ sơ tiêm chủng và xem chứng nhận điện tử có xác thực blockchain.',
      link: '/profile',
      color: 'purple',
    },
  ];

  const stats = [
    {
      title: 'Loại vaccine',
      value: 28,
      suffix: '+',
      icon: <MedicineBoxOutlined />,
      color: 'blue',
    },
    {
      title: 'Trung tâm y tế',
      value: 50,
      suffix: '+',
      icon: <EnvironmentOutlined />,
      color: 'green',
    },
    {
      title: 'Người dùng',
      value: 10000,
      suffix: '+',
      icon: <UserOutlined />,
      color: 'purple',
    },
    {
      title: 'Mũi tiêm thành công',
      value: 25000,
      suffix: '+',
      icon: <CheckCircleOutlined />,
      color: 'orange',
    },
  ];

  const recentUpdates = [
    {
      title: 'Vaccine COVID-19 phiên bản cập nhật',
      type: 'new',
      date: '2024-03-15',
      description:
        'Vaccine mới nhất đã được cập nhật để bảo vệ against các biến thể mới.',
    },
    {
      title: 'Chương trình tiêm chủng trẻ em',
      type: 'campaign',
      date: '2024-03-10',
      description: 'Chương trình tiêm chủng miễn phí cho trẻ em dưới 5 tuổi.',
    },
    {
      title: 'Hợp tác với bệnh viện mới',
      type: 'partner',
      date: '2024-03-05',
      description: 'Thêm 5 bệnh viện mới tham gia vào mạng lưới tiêm chủng.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute top-0 left-0 w-full h-full"
            style={{
              backgroundImage:
                'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
              backgroundSize: '40px 40px',
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-white space-y-6">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                <SafetyOutlined className="text-yellow-300" />
                <span className="text-sm font-medium">
                  Bảo mật bởi Blockchain
                </span>
              </div>

              <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
                Nền tảng quản lý
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-400">
                  Tiêm chủng thông minh
                </span>
              </h1>

              <p className="text-xl text-blue-100 leading-relaxed">
                Sử dụng công nghệ Blockchain để đảm bảo tính minh bạch, an toàn
                và xác thực trong quá trình quản lý tiêm chủng
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  type="primary"
                  size="large"
                  className="bg-white text-blue-600 hover:bg-gray-100 border-0 font-semibold h-12 px-8"
                  onClick={() => navigate('/market')}
                  icon={<ShoppingOutlined />}
                >
                  Khám phá Vaccine
                </Button>
                <Button
                  size="large"
                  className="bg-transparent text-white border-2 border-white hover:bg-white/10 font-semibold h-12 px-8"
                  onClick={() => navigate('/booking')}
                  icon={<CalendarOutlined />}
                >
                  Đặt lịch ngay
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center gap-6 pt-6">
                <div className="flex items-center gap-2">
                  <CheckCircleOutlined className="text-green-400 text-xl" />
                  <span className="text-sm">Xác thực Blockchain</span>
                </div>
                <div className="flex items-center gap-2">
                  <SafetyCertificateOutlined className="text-yellow-400 text-xl" />
                  <span className="text-sm">Dữ liệu bảo mật</span>
                </div>
                <div className="flex items-center gap-2">
                  <GlobalOutlined className="text-purple-400 text-xl" />
                  <span className="text-sm">Công nhận quốc tế</span>
                </div>
              </div>
            </div>

            {/* Right Content - Certificate Preview */}
            <div className="hidden lg:block">
              <div className="relative max-w-md w-full ml-auto">
                {/* Main Certificate Card */}
                <div className="bg-white p-8 rounded-2xl shadow-2xl border border-gray-100 transform hover:scale-105 transition-transform duration-300">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <SafetyCertificateOutlined className="text-green-500 text-2xl" />
                        <h3 className="text-xl font-bold text-gray-900">
                          Chứng nhận Tiêm chủng
                        </h3>
                      </div>
                      <p className="text-sm text-gray-500 font-mono">
                        VX-2024-XXXX-XXXX
                      </p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-green-50 flex items-center justify-center">
                      <CheckCircleOutlined className="text-green-500 text-2xl" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">Họ và tên</p>
                      <p className="text-sm font-semibold text-gray-900">
                        Nguyễn V. A.
                      </p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">Ngày sinh</p>
                      <p className="text-sm font-semibold text-gray-900">
                        ••/••/1990
                      </p>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-xs text-blue-600 mb-1">Vaccine</p>
                      <p className="text-sm font-semibold text-blue-900">
                        COVID-19 mRNA
                      </p>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-xs text-blue-600 mb-1">Tiến độ</p>
                      <p className="text-sm font-semibold text-blue-900">
                        2 / 2 mũi
                      </p>
                    </div>
                  </div>

                  {/* QR Code Section */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl flex items-center justify-between border border-blue-100">
                    <div className="bg-white rounded-lg p-3 shadow-sm">
                      <QrcodeOutlined className="text-gray-600 text-3xl" />
                    </div>
                    <div className="text-right flex-1 ml-4">
                      <p className="text-xs text-gray-500 mb-1">
                        Mã Blockchain
                      </p>
                      <p className="text-xs font-mono text-gray-700 truncate">
                        0x1a2b3c...d4e5f6
                      </p>
                      <div className="flex items-center justify-end gap-1 mt-1">
                        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-xs text-green-600 font-medium">
                          Đã xác thực
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Badge */}
                <div className="absolute -bottom-4 -right-4 bg-gradient-to-br from-green-400 to-green-600 p-4 rounded-2xl shadow-xl transform hover:scale-110 transition-transform duration-300">
                  <div className="flex flex-col items-center">
                    <SafetyOutlined className="text-white text-2xl mb-1" />
                    <p className="text-xs font-bold text-white text-center leading-tight">
                      Xác thực
                      <br />
                      Blockchain
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
              fill="rgb(249, 250, 251)"
            />
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Row gutter={[24, 24]}>
            {stats.map((stat, index) => {
              const colorClasses = {
                blue: { bg: 'bg-blue-50', text: 'text-blue-500' },
                green: { bg: 'bg-green-50', text: 'text-green-500' },
                purple: { bg: 'bg-purple-50', text: 'text-purple-500' },
                orange: { bg: 'bg-orange-50', text: 'text-orange-500' },
              };
              const colors = colorClasses[stat.color] || colorClasses.blue;

              return (
                <Col xs={12} md={6} key={index}>
                  <Card
                    className="text-center h-full border-0 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                    bodyStyle={{ padding: '32px 24px' }}
                  >
                    <div
                      className={`inline-flex items-center justify-center h-16 w-16 rounded-full ${colors.bg} mb-4`}
                    >
                      <span className={`${colors.text} text-3xl`}>
                        {stat.icon}
                      </span>
                    </div>
                    <Statistic
                      title={
                        <span className="text-gray-600 font-medium">
                          {stat.title}
                        </span>
                      }
                      value={stat.value}
                      suffix={stat.suffix}
                      valueStyle={{
                        color: '#1890ff',
                        fontSize: '32px',
                        fontWeight: 'bold',
                      }}
                    />
                  </Card>
                </Col>
              );
            })}
          </Row>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full mb-4">
              <RocketOutlined className="text-blue-600" />
              <span className="text-sm font-semibold text-blue-600">
                Tính năng nổi bật
              </span>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Quản lý tiêm chủng toàn diện
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Khám phá các tính năng giúp bạn quản lý lịch trình tiêm chủng một
              cách dễ dàng và hiệu quả
            </p>
          </div>
          <Row gutter={[32, 32]}>
            {features.map((feature, index) => {
              const colorClasses = {
                blue: 'bg-blue-50',
                green: 'bg-green-50',
                purple: 'bg-purple-50',
              };
              const bgColor = colorClasses[feature.color] || colorClasses.blue;

              return (
                <Col xs={24} md={8} key={index}>
                  <Card
                    hoverable
                    className="h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                    bodyStyle={{ padding: '32px' }}
                  >
                    <div
                      className={`inline-flex items-center justify-center h-20 w-20 rounded-2xl ${bgColor} mb-6`}
                    >
                      {feature.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed mb-6">
                      {feature.description}
                    </p>
                    <Button
                      type="link"
                      className="p-0 font-semibold"
                      onClick={() => navigate(feature.link)}
                      icon={<ArrowRightOutlined />}
                      iconPosition="end"
                    >
                      Khám phá ngay
                    </Button>
                  </Card>
                </Col>
              );
            })}
          </Row>
        </div>
      </section>

      {/* Featured Vaccines Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Vaccine nổi bật
            </h2>
            <p className="text-lg text-gray-600">
              Các loại vaccine được ưa chuộng nhất
            </p>
          </div>

          {loadingVaccines ? (
            <div className="text-center py-12">
              <Spin size="large" tip="Đang tải dữ liệu..." />
            </div>
          ) : featuredVaccines.length > 0 ? (
            <Row gutter={[24, 24]}>
              {featuredVaccines.map((vaccine) => (
                <Col xs={24} sm={12} lg={8} key={vaccine.vaccineId}>
                  <Card
                    hoverable
                    className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                    bodyStyle={{ padding: '24px' }}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                        <MedicineBoxOutlined className="text-white text-2xl" />
                      </div>
                      <Tag color="blue" className="m-0">
                        {vaccine.disease}
                      </Tag>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">
                      {vaccine.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {vaccine.description}
                    </p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Nhà sản xuất</span>
                        <span className="font-medium text-gray-900">
                          {vaccine.manufacturer}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Xuất xứ</span>
                        <span className="font-medium text-gray-900">
                          {vaccine.country}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Liều lượng</span>
                        <span className="font-medium text-gray-900">
                          {vaccine.schedule}
                        </span>
                      </div>
                    </div>

                    <div className="border-t pt-4 mt-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-gray-500">Giá tiền</span>
                        <span className="text-xl font-bold text-blue-600">
                          {new Intl.NumberFormat('vi-VN', {
                            style: 'currency',
                            currency: 'VND',
                          }).format(vaccine.price)}
                        </span>
                      </div>
                      <Button
                        type="primary"
                        block
                        size="large"
                        onClick={() => {
                          if (!isAuthenticated) {
                            navigate('/login');
                            return;
                          }
                          navigate(`/booking?sku=${vaccine.vaccineId}`);
                        }}
                        icon={<CalendarOutlined />}
                      >
                        Đặt lịch tiêm
                      </Button>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            <Empty description="Không có vaccine nào" />
          )}

          <div className="text-center mt-12">
            <Button
              type="default"
              size="large"
              onClick={() => navigate('/market')}
              className="font-semibold"
              icon={<ArrowRightOutlined />}
              iconPosition="end"
            >
              Xem tất cả vaccine
            </Button>
          </div>
        </div>
      </section>

      {/* Recent Updates Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="border-0 shadow-xl" bodyStyle={{ padding: '40px' }}>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Tin tức & Cập nhật
                </h2>
                <p className="text-gray-600">
                  Những thông tin mới nhất về vaccine và chương trình tiêm chủng
                </p>
              </div>
            </div>
            <List
              itemLayout="horizontal"
              dataSource={recentUpdates}
              renderItem={(item) => {
                const iconConfig = {
                  new: {
                    icon: <RocketOutlined className="text-blue-600 text-xl" />,
                    bg: 'bg-blue-50',
                  },
                  campaign: {
                    icon: (
                      <CalendarOutlined className="text-green-600 text-xl" />
                    ),
                    bg: 'bg-green-50',
                  },
                  partner: {
                    icon: <TeamOutlined className="text-purple-600 text-xl" />,
                    bg: 'bg-purple-50',
                  },
                };
                const config = iconConfig[item.type] || iconConfig.new;

                return (
                  <List.Item className="border-0 py-6">
                    <List.Item.Meta
                      avatar={
                        <div
                          className={`h-12 w-12 rounded-xl ${config.bg} flex items-center justify-center`}
                        >
                          {config.icon}
                        </div>
                      }
                      title={
                        <div className="flex items-center gap-3">
                          <span className="text-lg font-semibold text-gray-900">
                            {item.title}
                          </span>
                          <Tag
                            color={
                              item.type === 'new'
                                ? 'blue'
                                : item.type === 'campaign'
                                ? 'green'
                                : 'purple'
                            }
                          >
                            {item.type === 'new'
                              ? 'Mới'
                              : item.type === 'campaign'
                              ? 'Chiến dịch'
                              : 'Đối tác'}
                          </Tag>
                        </div>
                      }
                      description={
                        <div className="mt-2">
                          <p className="text-gray-600 text-base">
                            {item.description}
                          </p>
                          <p className="text-sm text-gray-400 mt-2">
                            {new Date(item.date).toLocaleDateString('vi-VN', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </p>
                        </div>
                      }
                    />
                  </List.Item>
                );
              }}
            />
          </Card>
        </div>
      </section>

      {/* Blockchain Security Section */}
      <section className="relative py-20 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute top-0 left-0 w-full h-full"
            style={{
              backgroundImage:
                'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
              backgroundSize: '40px 40px',
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 mb-6">
              <SafetyOutlined className="text-yellow-300" />
              <span className="text-sm font-semibold text-white">
                Công nghệ tiên tiến
              </span>
            </div>
            <h2 className="text-4xl font-bold text-white mb-6">
              Bảo mật thông tin với Blockchain
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Hệ thống phi tập trung đảm bảo dữ liệu tiêm chủng của bạn luôn
              riêng tư nhưng vẫn có thể xác minh bởi các bên được ủy quyền
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl border border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:-translate-y-2">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center mb-6 shadow-xl">
                <SafetyCertificateOutlined className="text-3xl text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Dữ liệu bất biến
              </h3>
              <p className="text-blue-100 leading-relaxed">
                Khi đã được ghi lại trên blockchain, dữ liệu tiêm chủng của bạn
                không thể bị thay đổi hoặc xóa, ngăn chặn mọi hình thức gian
                lận.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl border border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:-translate-y-2">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center mb-6 shadow-xl">
                <CheckCircleOutlined className="text-3xl text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Xác minh tức thì
              </h3>
              <p className="text-blue-100 leading-relaxed">
                Các bên được ủy quyền có thể xác minh trạng thái tiêm chủng của
                bạn trong vài giây mà không ảnh hưởng đến quyền riêng tư.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl border border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:-translate-y-2">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center mb-6 shadow-xl">
                <GlobalOutlined className="text-3xl text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Truy cập toàn cầu
              </h3>
              <p className="text-blue-100 leading-relaxed">
                Hộ chiếu vaccine số của bạn hoạt động ở mọi nơi, được công nhận
                xuyên biên giới và các hệ thống y tế quốc tế.
              </p>
            </div>
          </div>

          {/* CTA Button */}
          <div className="text-center mt-12">
            <Button
              size="large"
              className="bg-white text-blue-600 hover:bg-gray-100 border-0 font-semibold h-14 px-10 shadow-2xl"
              onClick={() => {
                if (!isAuthenticated) {
                  navigate('/login');
                } else {
                  navigate('/profile');
                }
              }}
              icon={<UserOutlined />}
            >
              {isAuthenticated ? 'Xem hồ sơ của tôi' : 'Đăng nhập ngay'}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
