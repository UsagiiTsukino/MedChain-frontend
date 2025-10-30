import React from 'react';
import { Table, Tag } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';

const VaccinationTable = ({ data }) => {
  const columns = [
    {
      title: 'Loại Vaccine',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Số lô',
      dataIndex: 'batchNumber',
      key: 'batchNumber',
    },
    {
      title: 'Ngày tiêm',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Xác thực',
      dataIndex: 'verification',
      key: 'verification',
      render: () => (
        <Tag icon={<CheckCircleOutlined />} color="success">
          Đã xác thực
        </Tag>
      ),
    },
  ];

  return (
    <div className="border-t border-gray-200 pt-4">
      <h4 className="text-base font-medium mb-4">Chi tiết vaccine</h4>
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
      />
    </div>
  );
};

export default VaccinationTable; 