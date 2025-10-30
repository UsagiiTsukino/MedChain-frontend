import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  CalendarOutlined,
  UserOutlined,
  MedicineBoxOutlined,
  DashboardOutlined,
  TeamOutlined,
  SafetyOutlined,
  KeyOutlined,
  EditOutlined,
  BankOutlined,
  HistoryOutlined,
  LogoutOutlined,
  SafetyCertificateOutlined,
  MenuOutlined,
  BoxPlotOutlined,
} from '@ant-design/icons';

import { useDispatch, useSelector } from 'react-redux';

import { useDisconnect } from 'wagmi';
import { Avatar, Badge, Dropdown, message, Menu, Layout } from 'antd';
import { setLogoutAction } from '../../redux/slice/accountSlide';
import { callLogout } from '../../config/api.auth';

const { Header, Sider, Content } = Layout;

const LayoutAdmin = () => {
  const dispatch = useDispatch();
  const { disconnect } = useDisconnect();
  const navigate = useNavigate();
  const user = useSelector((state) => state.account.user);
  console.log(user);
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState('');
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    setActiveMenu(location.pathname);
  }, [location]);

  const handleLogout = async () => {
    const res = await callLogout();
    if (res && res && +res.statusCode === 200) {
      localStorage.removeItem('access_token');
      dispatch(setLogoutAction({}));
      message.success('Đăng xuất thành công');
      navigate('/');
    }
  };

  const userMenuItems = [
    {
      key: 'profile',
      label: 'Thông tin cá nhân',
      icon: <UserOutlined />,
      onClick: () => navigate('/profile'),
    },

    {
      key: 'logout',
      label: 'Đăng xuất',
      icon: <LogoutOutlined />,
      onClick: handleLogout,
      danger: true,
    },
  ];

  const menuItems = [
    {
      key: '/admin/dashboard',
      icon: <DashboardOutlined />,
      label: 'Bảng điều khiển',
    },
    {
      key: '/admin/users',
      icon: <TeamOutlined />,
      label: 'Người dùng',
    },
    {
      key: '/admin/vaccines',
      icon: <MedicineBoxOutlined />,
      label: 'Vaccine',
    },
    {
      key: '/admin/centers',
      icon: <BankOutlined />,
      label: 'Cơ sở tiêm chủng',
    },
    {
      key: '/admin/bookings',
      icon: <BoxPlotOutlined />,
      label: 'Booking',
    },
    {
      key: '/admin/appointments',
      icon: <CalendarOutlined />,
      label: 'Lịch hẹn tiêm chủng',
    },
    {
      key: '/admin/permissions',
      icon: <SafetyOutlined />,
      label: 'Quyền hạn',
    },
    {
      key: '/admin/roles',
      icon: <KeyOutlined />,
      label: 'Vai trò',
    },
  ];

  const getRole = (role) => {
    switch (role) {
      case 'ADMIN':
        return 'Quản trị viên';
      case 'PATIENT':
        return 'Người dùng';
      case 'DOCTOR':
        return 'Bác sĩ';
      case 'CASHIER':
        return 'Nhân viên thu ngân';
      default:
        return '';
    }
  };

  const handleMenuClick = (e) => {
    navigate(e.key);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        theme="light"
        style={{
          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
          zIndex: 10,
        }}
      >
        <div className="p-4 h-16 flex items-center">
          <div className="flex items-center gap-2">
            <SafetyCertificateOutlined className="text-xl text-blue-500" />
            {!collapsed && (
              <span className="text-lg font-bold text-gray-900">VaxChain</span>
            )}
          </div>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[activeMenu]}
          items={menuItems}
          onClick={handleMenuClick}
          style={{ height: 'calc(100% - 64px)', borderRight: 0 }}
        />
      </Sider>
      <Layout>
        <Header
          className="bg-white p-0 px-6 flex items-center justify-end"
          style={{
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
            height: 64,
          }}
        >
          <Dropdown
            menu={{ items: userMenuItems }}
            placement="bottomRight"
            arrow
            trigger={['click']}
          >
            <div className="cursor-pointer flex items-center gap-2">
              <Badge dot={user?.isVerified}>
                <Avatar src={user?.avatar} className="bg-blue-500">
                  {user?.fullName?.charAt(0) || <UserOutlined />}
                </Avatar>
              </Badge>
              <div className="hidden sm:block">
                <div className="text-sm font-medium">{user?.fullName}</div>
                <div className="text-xs text-gray-500">
                  {getRole(user?.role)}
                </div>
              </div>
            </div>
          </Dropdown>
        </Header>
        <Content className="m-5 p-5 bg-white rounded-lg">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default LayoutAdmin;
