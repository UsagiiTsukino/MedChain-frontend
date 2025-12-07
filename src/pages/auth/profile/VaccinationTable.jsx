import React from 'react';
import { Table, Tag, Tooltip, Button } from 'antd';
import {
  CheckCircleOutlined,
  SafetyCertificateOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';

const VaccinationTable = ({ data }) => {
  const getBlockchainStatus = (record) => {
    if (record.blockchainStatus === 'CONFIRMED') {
      return (
        <Tooltip title={`TX: ${record.transactionHash?.slice(0, 10)}...`}>
          <Tag icon={<SafetyCertificateOutlined />} color="purple">
            Đã xác thực Blockchain
          </Tag>
        </Tooltip>
      );
    } else if (record.blockchainStatus === 'PENDING') {
      return (
        <Tag icon={<ClockCircleOutlined />} color="orange">
          Đang xử lý
        </Tag>
      );
    }
    return (
      <Tag icon={<CheckCircleOutlined />} color="success">
        Đã xác thực
      </Tag>
    );
  };

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
      render: (_, record) => getBlockchainStatus(record),
    },
    {
      title: '',
      key: 'action',
      width: 100,
      render: (_, record) =>
        record.transactionHash && (
          <Button
            type="link"
            size="small"
            icon={<SafetyCertificateOutlined />}
            onClick={() => window.open(`/verify/${record.bookingId}`, '_blank')}
          >
            Xem
          </Button>
        ),
    },
  ];

  return (
    <div className="border-t border-gray-200 pt-4">
      <h4 className="text-base font-medium mb-4">Chi tiết vaccine</h4>
      <Table columns={columns} dataSource={data} pagination={false} />
    </div>
  );
};

export default VaccinationTable;
