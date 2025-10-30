import React from 'react';
import { Card, Button, Space } from 'antd';
import { WalletOutlined } from '@ant-design/icons';

const WalletCard = ({ address, balance }) => {
  return (
    <Card title="Ví điện tử" extra={<Space><WalletOutlined />{balance.toFixed(0)} ETH</Space>}>
      <div className="text-center">
        <p className="text-sm text-gray-500 break-all mb-4">{address}</p>
        <Button size="small" icon={<WalletOutlined />}>
          Sao chép địa chỉ
        </Button>
      </div>
    </Card>
  );
};

export default WalletCard; 