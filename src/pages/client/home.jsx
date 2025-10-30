import { Button, Card, Statistic, Row, Col, List, Tag } from 'antd';
import { Link } from 'react-router-dom';
import {
  ShoppingOutlined,
  CalendarOutlined,
  SafetyCertificateOutlined,
  TeamOutlined,
  FileProtectOutlined,
  RocketOutlined,
  CheckCircleOutlined,
  QrcodeOutlined,
  SafetyOutlined,
  GlobalOutlined,
} from '@ant-design/icons';
import { useAccount } from 'wagmi';
import { ConnectButton, Connector } from '@ant-design/web3';

const HomePage = () => {
  const { address } = useAccount();

  const features = [
    {
      icon: <ShoppingOutlined className="text-4xl text-blue-500" />,
      title: 'Đặt mua Vaccine',
      description:
        'Dễ dàng tìm kiếm và đặt mua vaccine từ các nhà cung cấp uy tín.',
      link: '/market',
    },
    {
      icon: <CalendarOutlined className="text-4xl text-green-500" />,
      title: 'Đặt lịch tiêm',
      description: 'Lên lịch tiêm chủng thuận tiện với các cơ sở y tế gần bạn.',
      link: '/booking',
    },
    {
      icon: <FileProtectOutlined className="text-4xl text-purple-500" />,
      title: 'Hồ sơ tiêm chủng',
      description:
        'Theo dõi và quản lý hồ sơ tiêm chủng của bạn một cách an toàn.',
      link: '/documents',
    },
  ];

  const stats = [
    { title: 'Vaccine có sẵn', value: 28, suffix: '+' },
    { title: 'Đối tác y tế', value: 50, suffix: '+' },
    { title: 'Người dùng tin tưởng', value: 10000, suffix: '+' },
    { title: 'Mũi tiêm thành công', value: 25000, suffix: '+' },
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
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <h1 className="text-4xl font-bold mb-4">
                Nền tảng quản lý tiêm chủng thông minh
              </h1>
              <p className="text-xl text-blue-100 mb-8">
                Sử dụng công nghệ Blockchain để đảm bảo tính minh bạch và an
                toàn trong quá trình tiêm chủng
              </p>
              <div className="space-x-4">
                <Button
                  type="primary"
                  size="large"
                  className="bg-white text-blue-600"
                >
                  <Link to="/market">Xem các vaccine</Link>
                </Button>
                <Button size="large" ghost>
                  <Link to="/about">Tìm hiểu thêm</Link>
                </Button>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="relative max-w-md w-full ml-auto">
                <div className="bg-white p-6 rounded-xl shadow-xl border border-gray-100">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Chứng nhận tiêm chủng
                      </h3>
                      <p className="text-sm text-gray-500">
                        Mã số: VX-••••-••••-••••
                      </p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
                      <CheckCircleOutlined className="text-blue-500 text-xl" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500">Họ tên</p>
                      <p className="text-sm font-medium">Nguyễn V.</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Ngày sinh</p>
                      <p className="text-sm font-medium">••/••/1990</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Vaccine</p>
                      <p className="text-sm font-medium">COVID-19</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Số mũi</p>
                      <p className="text-sm font-medium">2 / 2</p>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg flex items-center justify-between">
                    <div className="bg-gray-200 rounded p-2">
                      <QrcodeOutlined className="text-gray-400 text-2xl" />
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Mã Blockchain</p>
                      <p className="text-xs font-mono text-gray-600 truncate">
                        0x1a2b...f8e9
                      </p>
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-xl shadow-lg border border-gray-100 w-32">
                  <div className="flex flex-col items-center">
                    <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center mb-1">
                      <SafetyOutlined className="text-blue-500 text-sm" />
                    </div>
                    <p className="text-xs font-medium text-center">
                      Xác thực Blockchain
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Row gutter={[16, 16]}>
            {stats.map((stat, index) => (
              <Col xs={12} md={6} key={index}>
                <Card className="text-center h-full">
                  <Statistic
                    title={stat.title}
                    value={stat.value}
                    suffix={stat.suffix}
                    className="text-blue-600"
                  />
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">
              Tính năng chính
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Khám phá các tính năng giúp quản lý tiêm chủng hiệu quả
            </p>
          </div>
          <Row gutter={[24, 24]}>
            {features.map((feature, index) => (
              <Col xs={24} md={8} key={index}>
                <Link to={feature.link}>
                  <Card
                    hoverable
                    className="h-full text-center"
                    cover={
                      <div className="pt-8 pb-4 flex justify-center">
                        {feature.icon}
                      </div>
                    }
                  >
                    <Card.Meta
                      title={<span className="text-xl">{feature.title}</span>}
                      description={feature.description}
                    />
                  </Card>
                </Link>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* Recent Updates Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Cập nhật mới nhất
            </h2>
            <List
              itemLayout="horizontal"
              dataSource={recentUpdates}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    title={
                      <div className="flex items-center gap-2">
                        <span>{item.title}</span>
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
                      <div>
                        <p className="text-gray-500">{item.description}</p>
                        <p className="text-sm text-gray-400 mt-1">
                          {item.date}
                        </p>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </div>
        </div>
      </section>

      {/* Blockchain Security Section */}
      <section className="bg-blue-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Bảo mật thông tin với Blockchain
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Hệ thống phi tập trung của chúng tôi đảm bảo dữ liệu tiêm chủng
              của bạn luôn riêng tư nhưng vẫn có thể xác minh bởi các bên được
              ủy quyền.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm transition-all duration-300 hover:shadow-md">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <SafetyCertificateOutlined className="text-xl text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Dữ liệu bất biến
              </h3>
              <p className="text-gray-600">
                Khi đã được ghi lại trên blockchain, dữ liệu tiêm chủng của bạn
                không thể bị thay đổi hoặc xóa, ngăn chặn gian lận.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm transition-all duration-300 hover:shadow-md">
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <CheckCircleOutlined className="text-xl text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Xác minh tức thì
              </h3>
              <p className="text-gray-600">
                Các bên được ủy quyền có thể xác minh trạng thái tiêm chủng của
                bạn trong vài giây mà không ảnh hưởng đến quyền riêng tư.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm transition-all duration-300 hover:shadow-md">
              <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                <GlobalOutlined className="text-xl text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Truy cập toàn cầu
              </h3>
              <p className="text-gray-600">
                Hộ chiếu vaccine số của bạn hoạt động ở mọi nơi, được công nhận
                xuyên biên giới và các hệ thống y tế.
              </p>
            </div>
          </div>
        </div>
      </section>
      <div>
        <Connector>
          <ConnectButton
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            Connect Wallet
          </ConnectButton>
        </Connector>
      </div>
    </div>
  );
};

export default HomePage;
