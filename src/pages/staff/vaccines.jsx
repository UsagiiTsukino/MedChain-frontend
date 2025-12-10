import { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  Tooltip,
  Drawer,
  Space,
  Descriptions,
  Typography,
  Tag,
  Badge,
  Image,
  Progress,
} from 'antd';
import {
  EyeOutlined,
  InfoCircleOutlined,
  MedicineBoxOutlined,
  SafetyCertificateOutlined,
  DollarOutlined,
  ExperimentOutlined,
} from '@ant-design/icons';
import { sfLike } from 'spring-filter-query-builder';
import queryString from 'query-string';

import DataTable from '../../components/data-table';
import { fetchVaccine } from '../../redux/slice/vaccineSlice';

const { Title, Paragraph } = Typography;

const StaffVaccinePage = () => {
  const tableRef = useRef();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedVaccine, setSelectedVaccine] = useState(null);

  const isFetching = useSelector((state) => state.vaccine.isFetching);
  const meta = useSelector((state) => state.vaccine.meta);
  const vaccines = useSelector((state) => state.vaccine.result);
  const dispatch = useDispatch();

  const showVaccineDetails = (record) => {
    setSelectedVaccine(record);
    setDrawerVisible(true);
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
  };

  const getStockStatus = (quantity) => {
    if (quantity === 0) return { color: 'error', text: 'Hết hàng' };
    if (quantity < 10) return { color: 'warning', text: 'Sắp hết' };
    if (quantity < 50) return { color: 'processing', text: 'Còn ít' };
    return { color: 'success', text: 'Còn nhiều' };
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
      dataIndex: 'imageUrl',
      width: 100,
      hideInSearch: true,
      render: (imageUrl) => (
        <Image
          src={imageUrl || 'http://localhost:8080/storage/vaccine/default.png'}
          alt="vaccine"
          width={60}
          height={60}
          className="rounded-lg object-cover shadow-sm"
          preview
        />
      ),
    },
    {
      title: 'Tên Vaccine',
      dataIndex: 'name',
      sorter: true,
      width: 200,
      render: (text, record) => (
        <div>
          <Tooltip title={text}>
            <div className="font-semibold text-gray-900">
              {text.length > 30 ? text.slice(0, 30) + '...' : text}
            </div>
          </Tooltip>
          <Tag color="blue" className="text-xs mt-1">
            {record.disease}
          </Tag>
        </div>
      ),
    },
    {
      title: 'Nhà sản xuất',
      dataIndex: 'manufacturer',
      sorter: true,
      width: 150,
      render: (text, record) => (
        <div>
          <div className="font-medium text-gray-900">{text}</div>
          <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
            <SafetyCertificateOutlined />
            {record.country}
          </div>
        </div>
      ),
    },
    {
      title: 'Hiệu quả',
      dataIndex: 'efficacy',
      width: 120,
      hideInSearch: true,
      render: (value) => (
        <div className="space-y-1">
          <Progress
            percent={value}
            size="small"
            strokeColor={{
              '0%': '#10b981',
              '100%': '#059669',
            }}
          />
          <div className="text-xs text-gray-500 text-center">
            {value}% hiệu quả
          </div>
        </div>
      ),
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      width: 130,
      hideInSearch: true,
      sorter: true,
      render: (value) => (
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
            <DollarOutlined className="text-green-600" />
          </div>
          <span className="font-semibold text-gray-900">
            {new Intl.NumberFormat('vi-VN', {
              style: 'currency',
              currency: 'VND',
            }).format(value)}
          </span>
        </div>
      ),
    },
    {
      title: 'Tồn kho',
      dataIndex: 'stockQuantity',
      width: 120,
      hideInSearch: true,
      render: (value) => {
        const status = getStockStatus(value);
        return (
          <Badge
            count={value}
            showZero
            color={status.color}
            overflowCount={999}
          >
            <Tag color={status.color} className="px-3 py-1">
              {status.text}
            </Tag>
          </Badge>
        );
      },
    },
    {
      title: 'Liều tiêm',
      dataIndex: 'requiredDoses',
      width: 90,
      align: 'center',
      hideInSearch: true,
      render: (value) => (
        <Tag color="cyan" className="text-sm font-medium">
          {value || 1} liều
        </Tag>
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
          className="bg-gradient-to-r from-blue-600 to-cyan-600 border-0 shadow-md hover:shadow-lg"
          onClick={() => showVaccineDetails(record)}
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
    if (clone.manufacturer) {
      q.filter = clone.name
        ? q.filter + ' and ' + `${sfLike('manufacturer', clone.manufacturer)}`
        : `${sfLike('manufacturer', clone.manufacturer)}`;
    }
    if (clone.disease) {
      q.filter = q.filter
        ? `${q.filter} and ${sfLike('disease', clone.disease)}`
        : `${sfLike('disease', clone.disease)}`;
    }

    if (!q.filter) delete q.filter;

    let temp = queryString.stringify(q);

    let sortBy = '';
    if (sort && sort.name) {
      sortBy = sort.name === 'ascend' ? 'sort=name,asc' : 'sort=name,desc';
    }
    if (sort && sort.manufacturer) {
      sortBy =
        sort.manufacturer === 'ascend'
          ? 'sort=manufacturer,asc'
          : 'sort=manufacturer,desc';
    }
    if (sort && sort.price) {
      sortBy = sort.price === 'ascend' ? 'sort=price,asc' : 'sort=price,desc';
    }

    temp = `${temp}&${sortBy}`;

    return temp;
  };

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
          Danh mục Vaccine
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Thông tin chi tiết về các loại vaccine có sẵn
        </p>
      </div>

      <DataTable
        actionRef={tableRef}
        headerTitle={
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
              <MedicineBoxOutlined className="text-white text-lg" />
            </div>
            <span className="text-lg font-semibold text-gray-900">
              Danh sách Vaccine
            </span>
          </div>
        }
        rowKey="vaccineId"
        loading={isFetching}
        columns={columns}
        dataSource={vaccines}
        request={async (params, sort, filter) => {
          const query = buildQuery(params, sort, filter);
          dispatch(fetchVaccine({ query }));
        }}
        scroll={{ x: 1200 }}
        pagination={{
          current: meta.page,
          pageSize: meta.pageSize,
          showSizeChanger: true,
          total: meta.total,
          showTotal: (total, range) => {
            return (
              <div>
                {range[0]}-{range[1]} trên tổng số {total} vaccine
              </div>
            );
          },
        }}
      />

      <Drawer
        title={
          <div className="flex items-center gap-3 pb-4 border-b">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
              <MedicineBoxOutlined className="text-white text-xl" />
            </div>
            <div>
              <Title level={4} className="m-0">
                {selectedVaccine?.name}
              </Title>
              <div className="flex gap-2 mt-1">
                <Tag color="blue" icon={<ExperimentOutlined />}>
                  {selectedVaccine?.manufacturer}
                </Tag>
                <Tag color="green" icon={<SafetyCertificateOutlined />}>
                  {selectedVaccine?.country}
                </Tag>
              </div>
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
        {selectedVaccine && (
          <div className="space-y-6">
            {/* Image */}
            {selectedVaccine.imageUrl && (
              <div className="flex justify-center">
                <Image
                  src={selectedVaccine.imageUrl}
                  alt={selectedVaccine.name}
                  width={200}
                  height={200}
                  className="rounded-xl shadow-lg object-cover"
                />
              </div>
            )}

            {/* Basic Info */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6">
              <Descriptions
                title={
                  <span className="text-lg font-bold text-gray-900">
                    Thông tin cơ bản
                  </span>
                }
                bordered
                column={1}
                size="middle"
              >
                <Descriptions.Item
                  label={<span className="font-semibold">Tên vaccine</span>}
                >
                  <span className="font-medium">{selectedVaccine.name}</span>
                </Descriptions.Item>
                <Descriptions.Item
                  label={<span className="font-semibold">Nhà sản xuất</span>}
                >
                  {selectedVaccine.manufacturer}
                </Descriptions.Item>
                <Descriptions.Item
                  label={<span className="font-semibold">Quốc gia</span>}
                >
                  {selectedVaccine.country}
                </Descriptions.Item>
                <Descriptions.Item
                  label={<span className="font-semibold">Loại bệnh</span>}
                >
                  <Tag color="red">{selectedVaccine.disease}</Tag>
                </Descriptions.Item>
                <Descriptions.Item
                  label={<span className="font-semibold">Lịch tiêm</span>}
                >
                  {selectedVaccine.schedule}
                </Descriptions.Item>
                <Descriptions.Item
                  label={<span className="font-semibold">Hiệu quả</span>}
                >
                  <Progress
                    percent={selectedVaccine.efficacy}
                    strokeColor={{
                      '0%': '#10b981',
                      '100%': '#059669',
                    }}
                  />
                </Descriptions.Item>
                <Descriptions.Item
                  label={<span className="font-semibold">Đối tượng</span>}
                >
                  {selectedVaccine.target}
                </Descriptions.Item>
                <Descriptions.Item
                  label={<span className="font-semibold">Liều lượng</span>}
                >
                  {selectedVaccine.dosage}
                </Descriptions.Item>
                <Descriptions.Item
                  label={<span className="font-semibold">Giá</span>}
                >
                  <span className="text-lg font-bold text-green-600">
                    {new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND',
                    }).format(selectedVaccine.price)}
                  </span>
                </Descriptions.Item>
                <Descriptions.Item
                  label={<span className="font-semibold">Tồn kho</span>}
                >
                  <Badge
                    count={selectedVaccine.stockQuantity}
                    showZero
                    color={getStockStatus(selectedVaccine.stockQuantity).color}
                    overflowCount={999}
                  >
                    <Tag
                      color={
                        getStockStatus(selectedVaccine.stockQuantity).color
                      }
                      className="px-3 py-1"
                    >
                      {getStockStatus(selectedVaccine.stockQuantity).text}
                    </Tag>
                  </Badge>
                </Descriptions.Item>
                <Descriptions.Item
                  label={<span className="font-semibold">Số mũi cần tiêm</span>}
                >
                  <Tag color="cyan" className="text-sm">
                    {selectedVaccine.requiredDoses || 1} liều
                  </Tag>
                </Descriptions.Item>
              </Descriptions>
            </div>

            {/* Description */}
            <div className="bg-blue-50 rounded-xl p-6">
              <Title
                level={5}
                className="flex items-center gap-2 text-gray-900"
              >
                <InfoCircleOutlined className="text-blue-600" />
                Mô tả chi tiết
              </Title>
              <Paragraph className="text-gray-700 leading-relaxed">
                {selectedVaccine.description ||
                  'Không có mô tả chi tiết cho vaccine này.'}
              </Paragraph>
            </div>
          </div>
        )}
      </Drawer>
    </>
  );
};

export default StaffVaccinePage;
