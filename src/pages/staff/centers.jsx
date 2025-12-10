import { useDispatch, useSelector } from 'react-redux';
import { useRef, useState } from 'react';
import queryString from 'query-string';
import { sfLike } from 'spring-filter-query-builder';
import {
  Button,
  Drawer,
  Typography,
  Descriptions,
  Tag,
  Row,
  Col,
  Card,
  Image,
  Statistic,
  Badge,
  Tooltip,
} from 'antd';
import {
  EyeOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  TeamOutlined,
  ClockCircleOutlined,
  SafetyCertificateOutlined,
  MedicineBoxOutlined,
  UserOutlined,
} from '@ant-design/icons';

import { fetchCenter } from '../../redux/slice/centerSlice';
import DataTable from '../../components/data-table';

const { Title, Paragraph } = Typography;

const StaffCenterPage = () => {
  const tableRef = useRef();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedCenter, setSelectedCenter] = useState(null);

  const isFetching = useSelector((state) => state.center.isFetching);
  const meta = useSelector((state) => state.center.meta);
  const centers = useSelector((state) => state.center.result);
  const dispatch = useDispatch();

  const showCenterDetails = (record) => {
    setSelectedCenter(record);
    setDrawerVisible(true);
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
  };

  const columns = [
    {
      title: 'STT',
      key: 'index',
      width: 60,
      align: 'center',
      fixed: 'left',
      render: (text, record, index) => {
        return (
          <span className="font-semibold text-gray-600">
            {index + 1 + (meta.page - 1) * meta.pageSize}
          </span>
        );
      },
      hideInSearch: true,
    },
    {
      title: 'Hình ảnh',
      dataIndex: 'image',
      width: 120,
      hideInSearch: true,
      render: (text) => (
        <Image
          src={'http://localhost:8080/storage/center/' + text}
          alt="center"
          width={80}
          height={60}
          className="rounded-lg object-cover shadow-md"
          preview
        />
      ),
    },
    {
      title: 'Tên cơ sở',
      dataIndex: 'name',
      sorter: true,
      width: 250,
      render: (text) => (
        <div>
          <div className="font-semibold text-gray-900">{text}</div>
          <Tag color="blue" className="text-xs mt-1">
            <SafetyCertificateOutlined /> Đã xác thực
          </Tag>
        </div>
      ),
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      sorter: true,
      width: 280,
      ellipsis: true,
      render: (text) => (
        <Tooltip title={text}>
          <div className="flex items-start gap-2">
            <EnvironmentOutlined className="text-red-500 mt-1" />
            <span className="text-gray-700">
              {text?.length > 40 ? text.slice(0, 40) + '...' : text}
            </span>
          </div>
        </Tooltip>
      ),
    },
    {
      title: 'Liên hệ',
      dataIndex: 'phoneNumber',
      width: 150,
      hideInSearch: true,
      render: (text) => (
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
            <PhoneOutlined className="text-green-600" />
          </div>
          <span className="font-medium text-gray-900">{text}</span>
        </div>
      ),
    },
    {
      title: 'Sức chứa',
      dataIndex: 'capacity',
      width: 120,
      align: 'center',
      hideInSearch: true,
      sorter: true,
      render: (value) => (
        <Badge
          count={value}
          showZero
          color="blue"
          overflowCount={999}
          className="font-semibold"
        >
          <Tag color="cyan" className="px-3 py-1">
            <TeamOutlined /> {value}
          </Tag>
        </Badge>
      ),
    },
    {
      title: 'Giờ làm việc',
      hideInSearch: true,
      dataIndex: 'workingHours',
      width: 180,
      render: (text) => (
        <div className="flex items-center gap-2">
          <ClockCircleOutlined className="text-orange-500" />
          <span className="text-gray-700">{text}</span>
        </div>
      ),
    },
    {
      title: 'Thao tác',
      hideInSearch: true,
      width: 100,
      fixed: 'right',
      align: 'center',
      render: (_, record) => (
        <Button
          type="primary"
          shape="circle"
          icon={<EyeOutlined />}
          size="large"
          className="bg-gradient-to-r from-red-600 to-rose-600 border-0 shadow-md hover:shadow-lg"
          onClick={() => showCenterDetails(record)}
        />
      ),
    },
  ];

  const buildQuery = (params, sort) => {
    const clone = { ...params };
    const q = {
      page: params.current,
      size: params.pageSize,
      filter: '',
    };

    if (clone.name) q.filter = `${sfLike('name', clone.name)}`;
    if (clone.address) {
      q.filter = clone.name
        ? q.filter + ' and ' + `${sfLike('address', clone.address)}`
        : `${sfLike('address', clone.address)}`;
    }

    if (!q.filter) delete q.filter;

    let temp = queryString.stringify(q);

    let sortBy = '';
    if (sort && sort.name) {
      sortBy = sort.name === 'ascend' ? 'sort=name,asc' : 'sort=name,desc';
    }
    if (sort && sort.address) {
      sortBy =
        sort.address === 'ascend' ? 'sort=address,asc' : 'sort=address,desc';
    }
    if (sort && sort.capacity) {
      sortBy =
        sort.capacity === 'ascend' ? 'sort=capacity,asc' : 'sort=capacity,desc';
    }
    temp = `${temp}&${sortBy}`;

    return temp;
  };

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
          Cơ sở tiêm chủng
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Danh sách các trung tâm tiêm chủng trong hệ thống
        </p>
      </div>

      <DataTable
        actionRef={tableRef}
        headerTitle={
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center">
              <EnvironmentOutlined className="text-white text-lg" />
            </div>
            <span className="text-lg font-semibold text-gray-900">
              Danh sách cơ sở
            </span>
          </div>
        }
        rowKey="centerId"
        loading={isFetching}
        columns={columns}
        dataSource={centers}
        request={async (params, sort, filter) => {
          const query = buildQuery(params, sort, filter);
          dispatch(fetchCenter({ query }));
        }}
        scroll={{ x: 1400 }}
        pagination={{
          current: meta.page,
          pageSize: meta.pageSize,
          showSizeChanger: true,
          total: meta.total,
          showTotal: (total, range) => {
            return (
              <div>
                {range[0]}-{range[1]} trên tổng số {total} cơ sở
              </div>
            );
          },
        }}
        rowSelection={false}
      />

      <Drawer
        title={
          <div className="flex items-center gap-3 pb-4 border-b">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg">
              <EnvironmentOutlined className="text-white text-xl" />
            </div>
            <div>
              <Title level={4} className="m-0">
                {selectedCenter?.name}
              </Title>
              <Tag color="blue" className="mt-1">
                <SafetyCertificateOutlined /> Đã xác thực
              </Tag>
            </div>
          </div>
        }
        width={700}
        onClose={closeDrawer}
        open={drawerVisible}
        extra={
          <Button
            onClick={closeDrawer}
            size="large"
            className="border-gray-300"
          >
            Đóng
          </Button>
        }
      >
        {selectedCenter && (
          <div className="space-y-6">
            {/* Image */}
            {selectedCenter.image && (
              <div className="flex justify-center">
                <Image
                  src={'http://localhost:8080/storage/center/' + selectedCenter.image}
                  alt={selectedCenter.name}
                  width="100%"
                  height={300}
                  className="rounded-xl shadow-lg object-cover"
                />
              </div>
            )}

            {/* Statistics */}
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-cyan-50">
                  <Statistic
                    title={<span className="text-gray-600">Sức chứa</span>}
                    value={selectedCenter.capacity}
                    prefix={<TeamOutlined className="text-blue-600" />}
                    suffix="người"
                    valueStyle={{ color: '#0ea5e9', fontWeight: 'bold' }}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card className="border-0 shadow-md bg-gradient-to-br from-green-50 to-emerald-50">
                  <Statistic
                    title={<span className="text-gray-600">Bác sĩ</span>}
                    value={12}
                    prefix={<UserOutlined className="text-green-600" />}
                    valueStyle={{ color: '#10b981', fontWeight: 'bold' }}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card className="border-0 shadow-md bg-gradient-to-br from-purple-50 to-indigo-50">
                  <Statistic
                    title={<span className="text-gray-600">Vaccine</span>}
                    value={45}
                    prefix={<MedicineBoxOutlined className="text-purple-600" />}
                    suffix="loại"
                    valueStyle={{ color: '#a855f7', fontWeight: 'bold' }}
                  />
                </Card>
              </Col>
            </Row>

            {/* Basic Info */}
            <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl p-6">
              <Descriptions
                title={
                  <span className="text-lg font-bold text-gray-900">
                    Thông tin cơ sở
                  </span>
                }
                bordered
                column={1}
                size="middle"
              >
                <Descriptions.Item
                  label={
                    <span className="font-semibold flex items-center gap-2">
                      <EnvironmentOutlined /> Địa chỉ
                    </span>
                  }
                >
                  <span className="text-gray-700">{selectedCenter.address}</span>
                </Descriptions.Item>
                <Descriptions.Item
                  label={
                    <span className="font-semibold flex items-center gap-2">
                      <PhoneOutlined /> Số điện thoại
                    </span>
                  }
                >
                  <a
                    href={`tel:${selectedCenter.phoneNumber}`}
                    className="text-blue-600 font-medium"
                  >
                    {selectedCenter.phoneNumber}
                  </a>
                </Descriptions.Item>
                <Descriptions.Item
                  label={
                    <span className="font-semibold flex items-center gap-2">
                      <TeamOutlined /> Sức chứa
                    </span>
                  }
                >
                  <Badge
                    count={selectedCenter.capacity}
                    showZero
                    color="blue"
                    className="font-semibold"
                  >
                    <span className="text-gray-700">
                      {selectedCenter.capacity} người
                    </span>
                  </Badge>
                </Descriptions.Item>
                <Descriptions.Item
                  label={
                    <span className="font-semibold flex items-center gap-2">
                      <ClockCircleOutlined /> Giờ làm việc
                    </span>
                  }
                >
                  <Tag color="orange" className="text-sm px-3 py-1">
                    {selectedCenter.workingHours}
                  </Tag>
                </Descriptions.Item>
              </Descriptions>
            </div>

            {/* Services */}
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Card
                  title={
                    <span className="text-lg font-bold text-gray-900">
                      Dịch vụ cung cấp
                    </span>
                  }
                  className="border-0 shadow-md bg-blue-50"
                >
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <SafetyCertificateOutlined className="text-blue-600 mt-1" />
                      Tư vấn tiêm chủng chuyên nghiệp
                    </li>
                    <li className="flex items-start gap-2">
                      <MedicineBoxOutlined className="text-green-600 mt-1" />
                      Tiêm chủng đầy đủ các loại vaccine
                    </li>
                    <li className="flex items-start gap-2">
                      <UserOutlined className="text-purple-600 mt-1" />
                      Theo dõi sức khỏe sau tiêm
                    </li>
                    <li className="flex items-start gap-2">
                      <SafetyCertificateOutlined className="text-orange-600 mt-1" />
                      Cấp giấy chứng nhận tiêm chủng
                    </li>
                  </ul>
                </Card>
              </Col>
              <Col span={24}>
                <Card
                  title={
                    <span className="text-lg font-bold text-gray-900">
                      Đội ngũ y tế
                    </span>
                  }
                  className="border-0 shadow-md bg-green-50"
                >
                  <Paragraph className="text-gray-700 leading-relaxed">
                    Đội ngũ y bác sĩ giàu kinh nghiệm, được đào tạo bài bản về
                    tiêm chủng và xử lý các phản ứng sau tiêm. Cam kết mang đến
                    dịch vụ y tế chất lượng cao, an toàn và hiệu quả.
                  </Paragraph>
                </Card>
              </Col>
            </Row>
          </div>
        )}
      </Drawer>
    </>
  );
};

export default StaffCenterPage;