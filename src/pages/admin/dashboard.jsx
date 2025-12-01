import { Card, Col, Row, Statistic, Progress, Table, Select } from 'antd';
import { CheckCircleOutlined, LinkOutlined } from '@ant-design/icons';
import CountUp from 'react-countup';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const DashboardPage = () => {
  const formatter = (value) => <CountUp end={Number(value)} separator="," />;

  // Data for vaccination rate chart
  const vaccinationRateData = {
    labels: Array.from({ length: 30 }, (_, i) => `Ngày ${i + 1}`),
    datasets: [
      {
        label: 'Tiêm chủng hàng ngày',
        data: Array.from(
          { length: 30 },
          () => Math.floor(Math.random() * 50000) + 20000
        ),
        backgroundColor: 'rgba(59, 130, 246, 0.05)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
        tension: 0.3,
        fill: true,
      },
    ],
  };

  // Data for vaccine distribution chart
  const vaccineDistributionData = {
    labels: ['Moderna', 'Pfizer', 'AstraZeneca', 'Johnson & Johnson', 'Khác'],
    datasets: [
      {
        data: [35, 40, 15, 7, 3],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(156, 163, 175, 0.8)',
        ],
        borderWidth: 0,
      },
    ],
  };

  // Table columns for regional data
  const columns = [
    {
      title: 'Khu vực',
      dataIndex: 'region',
      key: 'region',
      render: (text, record) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              backgroundColor: record.iconBg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 12,
            }}
          >
            {record.icon}
          </div>
          <div>
            <div style={{ fontWeight: 500 }}>{text}</div>
            <div style={{ fontSize: 12, color: '#666' }}>
              {record.districts} quận/huyện
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Dân số',
      dataIndex: 'population',
      key: 'population',
    },
    {
      title: 'Mũi 1',
      dataIndex: 'firstDose',
      key: 'firstDose',
    },
    {
      title: 'Mũi 2',
      dataIndex: 'secondDose',
      key: 'secondDose',
    },
    {
      title: '% Bao phủ',
      dataIndex: 'coverage',
      key: 'coverage',
      render: (coverage) => <Progress percent={coverage} size="small" />,
    },
  ];

  // Table data
  const data = [
    {
      key: '1',
      region: 'Khu vực Bắc',
      districts: 5,
      population: '1,245,678',
      firstDose: '872,145',
      secondDose: '756,321',
      coverage: 72,
      iconBg: '#EBF5FF',
      icon: <CheckCircleOutlined style={{ color: '#3B82F6' }} />,
    },
    {
      key: '2',
      region: 'Khu vực Nam',
      districts: 7,
      population: '2,345,678',
      firstDose: '1,876,543',
      secondDose: '1,543,210',
      coverage: 85,
      iconBg: '#E8FFF3',
      icon: <CheckCircleOutlined style={{ color: '#10B981' }} />,
    },
    // Add more regions as needed
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Bảng điều khiển tiêm chủng quốc gia
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Dữ liệu tiêm chủng thời gian thực trên tất cả các khu vực
        </p>
      </div>

      <Row gutter={[24, 24]} className="mb-8">
        <Col xs={24} sm={12} lg={6}>
          <Card
            className="hover:shadow-lg transition-shadow duration-300 rounded-xl border-0"
            style={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white',
            }}
          >
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <CheckCircleOutlined className="text-3xl text-white" />
              </div>
              <div className="flex-1">
                <div className="text-white/80 text-sm mb-1">
                  Tổng người tiêm
                </div>
                <div className="text-3xl font-bold">
                  <CountUp end={4832109} separator="," />
                </div>
                <div className="text-xs text-white/70 mt-1">
                  +12.3% so với tuần trước
                </div>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            className="hover:shadow-lg transition-shadow duration-300 rounded-xl border-0"
            style={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              color: 'white',
            }}
          >
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <CheckCircleOutlined className="text-3xl text-white" />
              </div>
              <div className="flex-1">
                <div className="text-white/80 text-sm mb-1">Tiêm đủ liều</div>
                <div className="text-3xl font-bold">
                  <CountUp end={3781456} separator="," />
                </div>
                <div className="text-xs text-white/70 mt-1">
                  +8.5% so với tuần trước
                </div>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            className="hover:shadow-lg transition-shadow duration-300 rounded-xl border-0"
            style={{
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              color: 'white',
            }}
          >
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <CheckCircleOutlined className="text-3xl text-white" />
              </div>
              <div className="flex-1">
                <div className="text-white/80 text-sm mb-1">Liều có sẵn</div>
                <div className="text-3xl font-bold">
                  <CountUp end={1245321} separator="," />
                </div>
                <div className="text-xs text-white/70 mt-1">
                  -2.1% so với tuần trước
                </div>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            className="hover:shadow-lg transition-shadow duration-300 rounded-xl border-0"
            style={{
              background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
              color: 'white',
            }}
          >
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <LinkOutlined className="text-3xl text-white" />
              </div>
              <div className="flex-1">
                <div className="text-white/80 text-sm mb-1">
                  Xác thực blockchain
                </div>
                <div className="text-3xl font-bold">
                  <CountUp end={4521987} separator="," />
                </div>
                <div className="text-xs text-white/70 mt-1">
                  +15.7% so với tuần trước
                </div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} className="mb-6">
        <Col xs={24} lg={12}>
          <Card
            title={
              <span className="text-lg font-semibold text-gray-900">
                Tỷ lệ tiêm chủng hàng ngày
              </span>
            }
            extra={
              <Select
                defaultValue="30"
                style={{ width: 140 }}
                size="large"
                className="rounded-lg"
              >
                <Select.Option value="7">7 ngày qua</Select.Option>
                <Select.Option value="14">14 ngày qua</Select.Option>
                <Select.Option value="30">30 ngày qua</Select.Option>
                <Select.Option value="90">90 ngày qua</Select.Option>
              </Select>
            }
            className="rounded-xl shadow-sm border-0 hover:shadow-md transition-shadow"
          >
            <div style={{ height: 300 }}>
              <Line
                data={vaccinationRateData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                    },
                  },
                }}
              />
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card
            title={
              <span className="text-lg font-semibold text-gray-900">
                Phân bố loại vaccine
              </span>
            }
            extra={
              <Select
                defaultValue="all"
                style={{ width: 140 }}
                size="large"
                className="rounded-lg"
              >
                <Select.Option value="all">Tất cả</Select.Option>
                <Select.Option value="month">Theo tháng</Select.Option>
                <Select.Option value="quarter">Theo quý</Select.Option>
              </Select>
            }
            className="rounded-xl shadow-sm border-0 hover:shadow-md transition-shadow"
          >
            <div
              style={{ height: 300, display: 'flex', justifyContent: 'center' }}
            >
              <div style={{ width: '70%' }}>
                <Doughnut
                  data={vaccineDistributionData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'right',
                      },
                    },
                    cutout: '65%',
                  }}
                />
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardPage;
