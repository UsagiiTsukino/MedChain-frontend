import React, { useEffect, useState } from 'react';
import { Skeleton, Table, Card, Empty } from 'antd';
import PropTypes from 'prop-types';

/**
 * Component bảng với trạng thái loading
 *
 * @param {Array} columns - Các cột của bảng
 * @param {number} rowCount - Số dòng hiển thị khi đang loading
 * @param {boolean} loading - Trạng thái loading
 * @param {Array} dataSource - Dữ liệu bảng
 * @param {number} timeout - Thời gian timeout tối thiểu (ms)
 * @param {Function} onLoadingComplete - Callback khi loading hoàn tất
 */
const LoadingTable = ({
  columns,
  rowCount = 5,
  loading,
  dataSource = [],
  timeout = 1000,
  onLoadingComplete = () => {},
  rowKey,
  ...tableProps
}) => {
  const [isLoading, setIsLoading] = useState(loading);

  useEffect(() => {
    setIsLoading(loading);

    // Nếu đang loading, thiết lập timeout để giả lập thời gian tải dữ liệu
    let timer;
    if (loading) {
      timer = setTimeout(() => {
        setIsLoading(false);
        onLoadingComplete();
      }, timeout);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [loading, timeout, onLoadingComplete]);

  // Tạo dữ liệu giả cho trạng thái loading
  const loadingData = Array(rowCount)
    .fill()
    .map((_, index) => ({
      key: `loading-${index}`,
      id: `loading-${index}`,
      hash: `loading-${index}`,
      __loading__: true,
    }));

  // Hàm xác định rowKey - ưu tiên prop rowKey, fallback về key hoặc id
  const getRowKey = (record) => {
    if (record.__loading__) {
      return record.key;
    }
    if (typeof rowKey === 'function') {
      return rowKey(record);
    }
    if (typeof rowKey === 'string') {
      return record[rowKey];
    }
    return record.key || record.id;
  };

  // Tùy chỉnh hiển thị cho mỗi ô trong trạng thái loading
  const loadingColumns = columns.map((column) => ({
    ...column,
    render: (text, record) => {
      if (record.__loading__) {
        // Xác định chiều rộng dựa trên độ dài tiêu đề cột hoặc sử dụng giá trị mặc định
        const width = column.title?.length * 8 || 100;
        return (
          <Skeleton.Input active size="small" style={{ width: `${width}px` }} />
        );
      }
      return column.render ? column.render(text, record) : text;
    },
  }));

  return (
    <Card bordered={false} bodyStyle={{ padding: '0px' }}>
      <Table
        columns={loadingColumns}
        dataSource={isLoading ? loadingData : dataSource}
        pagination={isLoading ? false : tableProps.pagination}
        rowKey={getRowKey}
        locale={{
          emptyText: <Empty description="Không có dữ liệu" />,
          filterConfirm: 'Đồng ý',
          filterReset: 'Đặt lại',
          filterTitle: 'Bộ lọc',
          filterEmptyText: 'Không có bộ lọc',
          selectAll: 'Chọn tất cả',
          selectInvert: 'Đảo ngược',
          sortTitle: 'Sắp xếp',
          triggerDesc: 'Nhấp để sắp xếp giảm dần',
          triggerAsc: 'Nhấp để sắp xếp tăng dần',
          cancelSort: 'Nhấp để hủy sắp xếp',
        }}
        {...tableProps}
      />
    </Card>
  );
};

LoadingTable.propTypes = {
  columns: PropTypes.array.isRequired,
  rowCount: PropTypes.number,
  loading: PropTypes.bool.isRequired,
  dataSource: PropTypes.array,
  timeout: PropTypes.number,
  onLoadingComplete: PropTypes.func,
};

export default LoadingTable;
