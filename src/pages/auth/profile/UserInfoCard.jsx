import React, { useEffect } from 'react';
import { Card, Avatar, Badge, Descriptions, Button } from 'antd';
import { UserOutlined, EditOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const UserInfoCard = ({ user, onEdit, getRole }) => {
  // Debug: log when user prop changes
  useEffect(() => {
    console.log('[UserInfoCard] User prop updated:', user);
  }, [user]);

  // Format birthday for display
  const formatBirthday = (birthday) => {
    if (!birthday) return 'Chưa cập nhật';
    try {
      return dayjs(birthday).format('DD/MM/YYYY');
    } catch {
      return birthday;
    }
  };

  return (
    <Card>
      <div className="flex flex-col items-center">
        <Badge dot={user?.isVerified}>
          <Avatar
            size={96}
            icon={<UserOutlined />}
            src={user?.avatar}
            className="bg-blue-500 mb-4"
          />
        </Badge>
        <h3 className="text-lg font-medium text-gray-900">
          {user?.fullName || 'Chưa cập nhật'}
        </h3>
        <p className="text-sm text-gray-500">{getRole(user?.role)}</p>
      </div>
      <Descriptions column={1} className="mt-6">
        <Descriptions.Item label="Email">{user?.email}</Descriptions.Item>
        <Descriptions.Item label="Số điện thoại">
          {user?.phoneNumber || 'Chưa cập nhật'}
        </Descriptions.Item>
        <Descriptions.Item label="Địa chỉ">
          {user?.address || 'Chưa cập nhật'}
        </Descriptions.Item>
        <Descriptions.Item label="Ngày sinh">
          {formatBirthday(user?.birthday)}
        </Descriptions.Item>
      </Descriptions>

      <Button
        className="w-full mt-4"
        type="primary"
        icon={<EditOutlined />}
        onClick={onEdit}
      >
        Cập nhật
      </Button>
    </Card>
  );
};

export default UserInfoCard;
