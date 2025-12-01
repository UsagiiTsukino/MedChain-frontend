import React from 'react';
import { Card, Button, message } from 'antd';
import {
  WalletOutlined,
  CopyOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';

const WalletCard = ({ address, balance }) => {
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(address);
      message.success('Đã sao chép địa chỉ ví');
    } catch (err) {
      message.error('Không thể sao chép');
    }
  };

  const formatAddress = (addr) => {
    if (!addr) return 'Chưa kết nối';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <Card className="border-0 shadow-lg overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-md">
            <WalletOutlined className="text-white text-sm" />
          </div>
          Ví điện tử
        </h3>
        <div className="flex items-center gap-1.5 bg-green-50 px-3 py-1.5 rounded-full">
          <CheckCircleOutlined className="text-green-600 text-xs" />
          <span className="text-xs font-semibold text-green-700">
            Đã kết nối
          </span>
        </div>
      </div>

      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 mb-4 border border-gray-200">
        <p className="text-xs text-gray-500 mb-2">Số dư khả dụng</p>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-gray-900">
            {balance.toFixed(4)}
          </span>
          <span className="text-lg font-semibold text-gray-500">ETH</span>
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-4 mb-4">
        <p className="text-xs text-gray-500 mb-2">Địa chỉ ví</p>
        <div className="flex items-center gap-2">
          <code className="text-sm font-mono text-gray-900 flex-1 truncate">
            {address || 'Chưa kết nối'}
          </code>
          <div className="h-6 w-6 rounded bg-blue-100 flex items-center justify-center flex-shrink-0">
            <WalletOutlined className="text-blue-600 text-xs" />
          </div>
        </div>
      </div>

      <Button
        className="w-full h-10 font-semibold rounded-xl border-2 border-purple-200 hover:border-purple-400 hover:text-purple-600 transition-all duration-300"
        icon={<CopyOutlined />}
        onClick={copyToClipboard}
        disabled={!address}
      >
        Sao chép địa chỉ
      </Button>
    </Card>
  );
};

export default WalletCard;
