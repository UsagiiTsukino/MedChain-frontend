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
        data: Array.from({ length: 30 }, () => Math.floor(Math.random() * 50000) + 20000),
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
            <div style={{ fontSize: 12, color: '#666' }}>{record.districts} quận/huyện</div>
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
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Bảng điều khiển tiêm chủng quốc gia</h1>
        <p className="mt-1 text-sm text-gray-500">Dữ liệu tiêm chủng thời gian thực trên tất cả các khu vực</p>
      </div>

      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng người tiêm"
              value={4832109}
              formatter={formatter}
              prefix={<CheckCircleOutlined style={{ color: '#10B981' }} />}
              suffix={
                <div className="text-sm text-green-600">
                  +12.3% <span className="text-gray-500">so với tuần trước</span>
                </div>
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tiêm đủ liều"
              value={3781456}
              formatter={formatter}
              prefix={<CheckCircleOutlined style={{ color: '#3B82F6' }} />}
              suffix={
                <div className="text-sm text-green-600">
                  +8.5% <span className="text-gray-500">so với tuần trước</span>
                </div>
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Liều có sẵn"
              value={1245321}
              formatter={formatter}
              prefix={<CheckCircleOutlined style={{ color: '#F59E0B' }} />}
              suffix={
                <div className="text-sm text-red-600">
                  -2.1% <span className="text-gray-500">so với tuần trước</span>
                </div>
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Xác thực blockchain"
              value={4521987}
              formatter={formatter}
              prefix={<LinkOutlined style={{ color: '#8B5CF6' }} />}
              suffix={
                <div className="text-sm text-green-600">
                  +15.7% <span className="text-gray-500">so với tuần trước</span>
                </div>
              }
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} lg={12}>
          <Card
            title="Tỷ lệ tiêm chủng hàng ngày"
            extra={
              <Select defaultValue="30" style={{ width: 120 }}>
                <Select.Option value="7">7 ngày qua</Select.Option>
                <Select.Option value="14">14 ngày qua</Select.Option>
                <Select.Option value="30">30 ngày qua</Select.Option>
                <Select.Option value="90">90 ngày qua</Select.Option>
              </Select>
            }
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
            title="Phân bố loại vaccine"
            extra={
              <Select defaultValue="all" style={{ width: 120 }}>
                <Select.Option value="all">Tất cả</Select.Option>
                <Select.Option value="month">Theo tháng</Select.Option>
                <Select.Option value="quarter">Theo quý</Select.Option>
              </Select>
            }
          >
            <div style={{ height: 300, display: 'flex', justifyContent: 'center' }}>
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
