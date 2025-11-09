import React, { useState, useEffect, useCallback } from 'react';
import { Card, List, Typography, Space, Input, Empty, Spin, Alert } from 'antd';
import {
  SearchOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import queryString from 'query-string';
import { fetchCenter } from '../../../redux/slice/centerSlice';

const { Text, Title } = Typography;

const CenterSelection = ({ setBookingSummary, bookingSummary }) => {
  const dispatch = useDispatch();
  const { result: centers = [] } = useSelector((state) => state.center);
  const { total, pageSize = 10 } = useSelector(
    (state) => state.center.meta || {}
  );
  const loading = useSelector((state) => state.center.isFetching);
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const loadCenters = useCallback(
    (page, search) => {
      const query = queryString.stringify({
        page: Math.max(0, page - 1),
        size: 10,
        q: search || '',
      });
      dispatch(fetchCenter({ query }));
    },
    [dispatch]
  );

  useEffect(() => {
    loadCenters(currentPage, searchText);
  }, [currentPage, searchText, loadCenters]);

  const handleCenterSelect = (center) => {
    setBookingSummary({
      ...bookingSummary,
      center: center,
    });
  };

  return (
    <div className="center-selection">
      <Space direction="vertical" size="large" className="w-full">
        <div className="search-box">
          <Input.Search
            prefix={<SearchOutlined className="text-gray-400" />}
            placeholder="Tìm kiếm theo tên hoặc địa chỉ..."
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
              if (!e.target.value) {
                loadCenters(1, '');
              }
            }}
            onSearch={(value) => {
              setCurrentPage(1);
              loadCenters(1, value);
            }}
            className="mb-4"
            allowClear
          />
        </div>

        <div className="center-list">
          <Spin spinning={loading}>
            {centers && centers.length > 0 ? (
              <List
                grid={{
                  gutter: 16,
                  xs: 1,
                  sm: 2,
                  md: 2,
                  lg: 3,
                  xl: 3,
                  xxl: 3,
                }}
                dataSource={centers}
                pagination={{
                  onChange: (page) => {
                    setCurrentPage(page);
                    loadCenters(page, searchText);
                  },
                  total: total || 0,
                  current: currentPage,
                  pageSize: 10,
                  showSizeChanger: false,
                }}
                renderItem={(center) => (
                  <List.Item>
                    <Card
                      hoverable
                      className={`center-card ${
                        bookingSummary?.center?.id === center.id
                          ? 'border-blue-500'
                          : ''
                      }`}
                      onClick={() => handleCenterSelect(center)}
                    >
                      <Space direction="vertical" size="small">
                        <Title level={5}>{center.name}</Title>
                        <Space>
                          <EnvironmentOutlined className="text-gray-400" />
                          <Text className="text-gray-600">
                            {center.address}
                          </Text>
                        </Space>
                        <Space>
                          <PhoneOutlined className="text-gray-400" />
                          <Text className="text-gray-600">
                            {center.phoneNumber}
                          </Text>
                        </Space>
                        <Space>
                          <TeamOutlined className="text-gray-400" />
                          <Text className="text-gray-600">
                            Sức chứa: {center.capacity} người/ngày
                          </Text>
                        </Space>
                        <Text type="secondary">
                          Giờ làm việc: {center.workingHours}
                        </Text>
                      </Space>
                    </Card>
                  </List.Item>
                )}
              />
            ) : (
              <Empty
                description={
                  loading
                    ? 'Đang tải...'
                    : 'Không tìm thấy cơ sở tiêm chủng nào'
                }
              />
            )}
          </Spin>
        </div>
      </Space>

      <div className="mt-4">
        {bookingSummary?.center && (
          <Alert
            message="Cơ sở tiêm chủng đã chọn"
            description={bookingSummary.center.name}
            type="success"
            showIcon
          />
        )}
      </div>

      <style>{`
        .center-card {
          transition: all 0.3s;
        }
        .center-card.border-blue-500 {
          border-color: #1890ff;
          box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
        }
      `}</style>
    </div>
  );
};

export default CenterSelection;
