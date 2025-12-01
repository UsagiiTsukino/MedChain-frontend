import React, { useEffect } from 'react';
import { Card, Avatar, Badge, Button } from 'antd';
import {
  UserOutlined,
  EditOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
} from '@ant-design/icons';
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
    <Card className="border-0 shadow-lg overflow-hidden">
      {/* Gradient Header */}
      <div className="h-20 bg-gradient-to-br from-blue-500 to-indigo-600 -mx-6 -mt-6 mb-6" />

      <div className="flex flex-col items-center -mt-16">
        <Badge
          dot={user?.isVerified}
          status={user?.isVerified ? 'success' : 'default'}
          offset={[-5, 90]}
        >
          <div className="relative">
            <Avatar
              size={96}
              icon={<UserOutlined />}
              src={user?.avatar}
              className="bg-white border-4 border-white shadow-lg"
            />
            {user?.isVerified && (
              <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-green-500 border-2 border-white flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
            )}
          </div>
        </Badge>
        <h3 className="text-xl font-bold text-gray-900 mt-4">
          {user?.fullName || 'Chưa cập nhật'}
        </h3>
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 mt-2">
          {getRole(user?.role)}
        </span>
      </div>

      <div className="mt-6 space-y-4">
        <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
          <MailOutlined className="text-blue-600 text-lg mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500 mb-1">Email</p>
            <p className="text-sm text-gray-900 truncate">{user?.email}</p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
          <PhoneOutlined className="text-green-600 text-lg mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500 mb-1">Số điện thoại</p>
            <p className="text-sm text-gray-900">
              {user?.phoneNumber || 'Chưa cập nhật'}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
          <EnvironmentOutlined className="text-red-600 text-lg mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500 mb-1">Địa chỉ</p>
            <p className="text-sm text-gray-900">
              {user?.address || 'Chưa cập nhật'}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
          <CalendarOutlined className="text-purple-600 text-lg mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500 mb-1">Ngày sinh</p>
            <p className="text-sm text-gray-900">
              {formatBirthday(user?.birthday)}
            </p>
          </div>
        </div>
      </div>

      <Button
        className="w-full mt-6 h-11 font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 border-0 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
        type="primary"
        icon={<EditOutlined />}
        onClick={onEdit}
      >
        Cập nhật thông tin
      </Button>
    </Card>
  );
};

export default UserInfoCard;
