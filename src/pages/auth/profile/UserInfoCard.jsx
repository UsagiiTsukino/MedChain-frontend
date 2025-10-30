import React from 'react';
import { Card, Avatar, Badge, Descriptions, Button } from 'antd';
import { UserOutlined, EditOutlined } from '@ant-design/icons';

const UserInfoCard = ({ user, onEdit, getRole }) => {
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
        <h3 className="text-lg font-medium text-gray-900">{user?.fullname || "Chưa cập nhật"}</h3>
        <p className="text-sm text-gray-500">{getRole(user?.role)}</p>
      </div>
      <Descriptions column={1} className="mt-6">
        <Descriptions.Item label="Email">{user?.email}</Descriptions.Item>
        <Descriptions.Item label="Số điện thoại">{user?.phone || "Chưa cập nhật"}</Descriptions.Item>
        <Descriptions.Item label="Địa chỉ">{user?.address || "Chưa cập nhật"}</Descriptions.Item>
        <Descriptions.Item label="Ngày sinh">{user?.birthday || "Chưa cập nhật"}</Descriptions.Item>
      </Descriptions>

      <Button 
        className='w-full mt-4'
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