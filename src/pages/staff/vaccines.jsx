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
} from 'antd';
import { EyeOutlined, InfoCircleOutlined } from '@ant-design/icons';
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

  const columns = [
    {
      title: 'STT',
      key: 'index',
      width: 50,
      align: 'center',
      render: (text, record, index) => {
        return <>{index + 1 + (meta.page - 1) * meta.pageSize}</>;
      },
      hideInSearch: true,
    },
    {
      title: 'Tên',
      dataIndex: 'name',
      sorter: true,
      width: 150,
      render: (text) => (
        <Tooltip title={text}>
          {text.length > 20 ? text.slice(0, 20) + '...' : text}
        </Tooltip>
      ),
    },
    {
      title: 'Nhà sản xuất',
      dataIndex: 'manufacturer',
      sorter: true,
      width: 120,
    },
    {
      title: 'Quốc gia',
      dataIndex: 'country',
      width: 100,
      hideInSearch: true,
    },
    {
      title: 'Bệnh',
      dataIndex: 'disease',
      width: 120,
      render: (text) => (
        <Tooltip title={text}>
          {text.length > 20 ? text.slice(0, 20) + '...' : text}
        </Tooltip>
      ),
    },
    {
      title: 'Hiệu quả',
      dataIndex: 'efficacy',
      width: 100,
      hideInSearch: true,
      render: (text) => text + '%',
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      width: 100,
      hideInSearch: true,
      sorter: true,
      render: (value) => {
        return new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND',
        }).format(value);
      },
    },
    {
      title: 'Tồn kho',
      dataIndex: 'stockQuantity',
      width: 80,
      hideInSearch: true,
    },
    {
      title: 'Xem chi tiết',
      hideInSearch: true,
      width: 80,
      fixed: 'right',
      render: (_, record) => (
        <Button
          type="primary"
          shape="circle"
          icon={<EyeOutlined />}
          size="small"
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
      <DataTable
        actionRef={tableRef}
        headerTitle="Danh sách Vaccine"
        rowKey="vaccineId"
        loading={isFetching}
        columns={columns}
        dataSource={vaccines}
        request={async (params, sort, filter) => {
          const query = buildQuery(params, sort, filter);
          dispatch(fetchVaccine({ query }));
        }}
        pagination={{
          current: meta.page,
          pageSize: meta.pageSize,
          showSizeChanger: true,
          total: meta.total,
          showTotal: (total, range) => {
            return (
              <div>
                {range[0]}-{range[1]} trên tổng số {total} dòng
              </div>
            );
          },
        }}
      />

      <Drawer
        title={
          <div>
            <Title level={4}>{selectedVaccine?.name}</Title>
            <Tag color="blue">{selectedVaccine?.manufacturer}</Tag>
            <Tag color="green">{selectedVaccine?.country}</Tag>
          </div>
        }
        width={600}
        onClose={closeDrawer}
        open={drawerVisible}
        extra={
          <Space>
            <Button onClick={closeDrawer}>Đóng</Button>
          </Space>
        }
      >
        {selectedVaccine && (
          <>
            <Descriptions title="Thông tin cơ bản" bordered column={1}>
              <Descriptions.Item label="Tên vaccine">
                {selectedVaccine.name}
              </Descriptions.Item>
              <Descriptions.Item label="Nhà sản xuất">
                {selectedVaccine.manufacturer}
              </Descriptions.Item>
              <Descriptions.Item label="Quốc gia">
                {selectedVaccine.country}
              </Descriptions.Item>
              <Descriptions.Item label="Loại bệnh">
                {selectedVaccine.disease}
              </Descriptions.Item>
              <Descriptions.Item label="Lịch tiêm">
                {selectedVaccine.schedule}
              </Descriptions.Item>
              <Descriptions.Item label="Hiệu quả">
                {selectedVaccine.efficacy}%
              </Descriptions.Item>
              <Descriptions.Item label="Đối tượng">
                {selectedVaccine.target}
              </Descriptions.Item>
              <Descriptions.Item label="Liều lượng">
                {selectedVaccine.dosage}
              </Descriptions.Item>
              <Descriptions.Item label="Giá">
                {new Intl.NumberFormat('vi-VN', {
                  style: 'currency',
                  currency: 'VND',
                }).format(selectedVaccine.price)}
              </Descriptions.Item>
              <Descriptions.Item label="Tồn kho">
                <span
                  style={{
                    color:
                      selectedVaccine.stockQuantity < 10 ? 'red' : 'inherit',
                  }}
                >
                  {selectedVaccine.stockQuantity}{' '}
                  {selectedVaccine.stockQuantity < 10 && '(Sắp hết)'}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="Số mũi cần tiêm">
                {selectedVaccine.requiredDoses || 'Chưa có thông tin'}
              </Descriptions.Item>
            </Descriptions>

            <Title level={5} style={{ marginTop: 24 }}>
              <InfoCircleOutlined style={{ marginRight: 8 }} />
              Mô tả
            </Title>
            <Paragraph>
              {selectedVaccine.description ||
                'Không có mô tả chi tiết cho vaccine này.'}
            </Paragraph>
          </>
        )}
      </Drawer>
    </>
  );
};

export default StaffVaccinePage;
