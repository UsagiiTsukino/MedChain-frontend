import { useDispatch, useSelector } from 'react-redux';
import { useRef, useState } from 'react';
import queryString from 'query-string';
import { sfLike } from 'spring-filter-query-builder';
import { Button, Space, Drawer, Typography, Descriptions, Tag, Row, Col, Card } from 'antd';
import { EyeOutlined, EnvironmentOutlined, PhoneOutlined, TeamOutlined, ClockCircleOutlined } from '@ant-design/icons';

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
      width: 50,
      align: 'center',
      render: (text, record, index) => {
        return <>{index + 1 + (meta.page - 1) * meta.pageSize}</>;
      },
      hideInSearch: true,
    },
    {
      title: 'Hình ảnh',
      dataIndex: 'image',
      hideInSearch: true,
      render: (text) => (
        <img
          src={'http://localhost:8080/storage/center/' + text}
          alt='center'
          style={{
            width: '50px',
            height: 'auto',
            objectFit: 'cover',
            borderRadius: '8px',
          }}
        />
      ),
    },
    {
      title: 'Tên cơ sở',
      dataIndex: 'name',
      sorter: true,
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      sorter: true,
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phoneNumber',
      hideInSearch: true,
    },
    {
      title: 'Sức chứa',
      dataIndex: 'capacity',
      hideInSearch: true,
      sorter: true,
    },
    {
      title: 'Giờ làm việc',
      hideInSearch: true,
      dataIndex: 'workingHours',
    },
    {
      title: 'Xem chi tiết',
      hideInSearch: true,
      width: 80,
      align: 'center',
      render: (_, record) => (
        <Button 
          type="primary" 
          shape="circle" 
          icon={<EyeOutlined />} 
          size="small" 
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
      <DataTable
        actionRef={tableRef}
        headerTitle='Danh sách cơ sở tiêm chủng'
        rowKey='centerId'
        loading={isFetching}
        columns={columns}
        dataSource={centers}
        request={async (params, sort, filter) => {
          const query = buildQuery(params, sort, filter);
          dispatch(fetchCenter({ query }));
        }}
        scroll={{ x: true }}
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
        rowSelection={false}
      />

      <Drawer
        title={
          <div>
            <Title level={4}>{selectedCenter?.name}</Title>
            <Tag color="blue">{selectedCenter?.address}</Tag>
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
        {selectedCenter && (
          <>
            <div className="mb-4">
              {selectedCenter.image && (
                <img
                  src={'http://localhost:8080/storage/center/' + selectedCenter.image}
                  alt={selectedCenter.name}
                  style={{
                    width: '100%',
                    height: 'auto',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    marginBottom: '16px'
                  }}
                />
              )}
            </div>

            <Descriptions title="Thông tin cơ sở" bordered column={1}>
              <Descriptions.Item label={<Space><EnvironmentOutlined /> Địa chỉ</Space>}>
                {selectedCenter.address}
              </Descriptions.Item>
              <Descriptions.Item label={<Space><PhoneOutlined /> Số điện thoại</Space>}>
                {selectedCenter.phoneNumber}
              </Descriptions.Item>
              <Descriptions.Item label={<Space><TeamOutlined /> Sức chứa</Space>}>
                {selectedCenter.capacity} người
              </Descriptions.Item>
              <Descriptions.Item label={<Space><ClockCircleOutlined /> Giờ làm việc</Space>}>
                {selectedCenter.workingHours}
              </Descriptions.Item>
            </Descriptions>

            <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
              <Col span={24}>
                <Card title="Dịch vụ cung cấp" bordered={false}>
                  <ul className="pl-4">
                    <li>Tư vấn tiêm chủng</li>
                    <li>Tiêm chủng đầy đủ các loại vaccine</li>
                    <li>Theo dõi sức khỏe sau tiêm</li>
                    <li>Cấp giấy chứng nhận tiêm chủng</li>
                  </ul>
                </Card>
              </Col>
              <Col span={24}>
                <Card title="Đội ngũ y tế" bordered={false}>
                  <Paragraph>
                    Đội ngũ y bác sĩ giàu kinh nghiệm, được đào tạo bài bản về tiêm chủng và xử lý các phản ứng sau tiêm.
                  </Paragraph>
                </Card>
              </Col>
            </Row>
          </>
        )}
      </Drawer>
    </>
  );
};

export default StaffCenterPage; 