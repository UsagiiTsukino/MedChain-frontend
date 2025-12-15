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
    <Layout style={{ minHeight: '100vh', background: '#f5f7fa' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        width={260}
        style={{
          background: 'linear-gradient(180deg, #1e3a8a 0%, #1e40af 100%)',
          boxShadow: '2px 0 8px rgba(0, 0, 0, 0.1)',
          zIndex: 10,
        }}
      >
        <div className="h-16 flex items-center justify-center border-b border-blue-800/30">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
              <SafetyCertificateOutlined className="text-2xl text-white" />
            </div>
            {!collapsed && (
              <span className="text-xl font-bold text-white">MedChainAI</span>
            )}
          </div>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[activeMenu]}
          items={menuItems}
          onClick={handleMenuClick}
          style={{
            height: 'calc(100% - 64px)',
            borderRight: 0,
            background: 'transparent',
            color: 'rgba(255, 255, 255, 0.85)',
          }}
          theme="dark"
          className="admin-menu"
        />
      </Sider>
      <Layout style={{ background: '#f5f7fa' }}>
        <Header
          className="px-6 flex items-center justify-between"
          style={{
            background: 'white',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
            height: 64,
            padding: '0 24px',
          }}
        >
          <div className="flex items-center gap-4">
            <MenuOutlined
              className="text-xl text-gray-600 cursor-pointer hover:text-blue-600 transition-colors lg:hidden"
              onClick={() => setCollapsed(!collapsed)}
            />
            <div>
              <h2 className="text-base font-semibold text-gray-900 m-0">
                Hệ thống quản lý tiêm chủng
              </h2>
              <p className="text-xs text-gray-500 m-0">
                Quản lý và theo dõi tiêm chủng trên blockchain
              </p>
            </div>
          </div>
          <Dropdown
            menu={{ items: userMenuItems }}
            placement="bottomRight"
            arrow
            trigger={['click']}
          >
            <div className="cursor-pointer flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-all">
              <div className="hidden sm:block text-right">
                <div className="text-sm font-semibold text-gray-900">
                  {user?.fullName}
                </div>
                <div className="text-xs text-gray-500">
                  {getRole(user?.role)}
                </div>
              </div>
              <Badge dot={user?.isVerified} color="#10b981">
                <Avatar
                  src={user?.avatar}
                  size={40}
                  className="bg-gradient-to-br from-blue-500 to-indigo-600 shadow-md"
                >
                  {user?.fullName?.charAt(0) || <UserOutlined />}
                </Avatar>
              </Badge>
            </div>
          </Dropdown>
        </Header>
        <Content style={{ margin: '24px', minHeight: 280 }}>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default LayoutAdmin;
