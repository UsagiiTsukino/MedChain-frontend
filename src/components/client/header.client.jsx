import { useState } from 'react';
import {
  Layout,
  Menu,
  Avatar,
  Dropdown,
  Button,
  Drawer,
  message,
  Badge,
  Space,
} from 'antd';
import {
  UserOutlined,
  HeartOutlined,
  MenuOutlined,
  WechatWorkOutlined,
  SafetyCertificateOutlined,
  RobotOutlined,
  ShoppingCartOutlined,
  HomeOutlined,
  ShoppingOutlined,
  CalendarOutlined,
  DashboardOutlined,
  LogoutOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { callLogout } from '../../config/api.auth';
import { setLogoutAction } from '../../redux/slice/accountSlide';

const { Header: AntHeader } = Layout;

const Navbar = () => {
  const dispatch = useDispatch();
  const { itemCount } = useSelector((state) => state.cart);

  const isAuthenticated = useSelector((state) => state.account.isAuthenticated);
  const user = useSelector((state) => state.account.user);
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const handleLogout = async () => {
    const res = await callLogout();
    if (res && res && +res.statusCode === 200) {
      localStorage.removeItem('access_token');
      dispatch(setLogoutAction({}));
      message.success('Đăng xuất thành công');
      navigate('/');
    }
  };

  const handleMenuClick = ({ key }) => {
    navigate(key);
  };

  const handleMobileUserMenuClick = async ({ key }) => {
    if (key === 'logout') {
      await handleLogout();
    } else {
      navigate(`/${key}`);
    }
    setMobileMenuVisible(false);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuVisible(false);
  };

  const handleMobileMenuItemClick = ({ key }) => {
    navigate(key);
    setMobileMenuVisible(false);
  };

  const handleSearch = () => {
    if (searchValue.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchValue)}`);
      setSearchVisible(false);
      setSearchValue('');
    }
  };

  const menuItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: 'Trang chủ',
    },
    {
      key: 'market-menu',
      icon: <ShoppingOutlined />,
      label: 'Vaccine',
      children: [
        {
          key: '/market',
          label: 'Danh sách vaccine',
        },
      ],
    },
    {
      key: 'booking-menu',
      icon: <CalendarOutlined />,
      label: 'Đặt lịch',
      children: [
        {
          key: '/booking',
          label: 'Đặt lịch mới',
        },
        {
          key: '/profile',
          label: 'Lịch sử đặt',
        },
      ],
    },
  ];

  const userMenuItems = [
    {
      key: 'profile',
      label: 'Thông tin cá nhân',
      icon: <UserOutlined />,
      onClick: () => navigate('/profile'),
    },
    ...(user?.role === 'ADMIN'
      ? [
          {
            key: 'system',
            label: 'Trang quản trị',
            icon: <DashboardOutlined />,
            onClick: () => navigate('/admin/dashboard'),
          },
        ]
      : []),
    ...(user?.role === 'DOCTOR' || user?.role === 'CASHIER'
      ? [
          {
            key: 'system',
            label: 'Trang nhân viên',
            icon: <DashboardOutlined />,
            onClick: () => navigate('/staff/dashboard'),
          },
        ]
      : []),
    {
      type: 'divider',
    },
    {
      key: 'logout',
      label: 'Đăng xuất',
      icon: <LogoutOutlined />,
      onClick: handleLogout,
      danger: true,
    },
  ];

  return (
    <>
      <AntHeader className="sticky top-0 z-50 bg-white px-4 shadow-sm md:px-6">
        <div className="mx-auto flex h-full max-w-6xl items-center justify-between">
          {/* Logo và menu chính cho desktop */}
          <div className="flex items-center">
            <div
              className="mr-4 cursor-pointer text-xl font-bold text-blue-600 md:text-2xl"
              onClick={() => navigate('/')}
            >
              <Link to="/" className="flex items-center gap-2">
                <SafetyCertificateOutlined className="text-xl md:text-2xl text-brand-primary" />
                <span className="hidden text-lg font-bold text-gray-900 sm:block md:text-xl">
                  VaxChain
                </span>
              </Link>
            </div>

            {/* Menu desktop */}
            <Menu
              mode="horizontal"
              selectedKeys={[location.pathname]}
              items={menuItems}
              onClick={handleMenuClick}
              style={{ border: 'none', background: 'transparent' }}
              className="hidden lg:flex"
            />
          </div>

          {/* Phần bên phải: Tìm kiếm, nút action và user */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Thanh tìm kiếm cho desktop */}
            <div className="hidden md:flex md:items-center">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-40 rounded-lg border border-gray-300 py-1.5 pl-3 pr-10 text-sm transition-all focus:w-52 focus:outline-none focus:ring-2 focus:ring-blue-500 lg:w-52"
                />
                <Button
                  icon={<SearchOutlined />}
                  type="text"
                  onClick={handleSearch}
                  className="absolute right-1 top-1/2 -translate-y-1/2 transform"
                />
              </div>
            </div>

            {/* Các nút action */}
            <Space.Compact className="hidden sm:flex">
              <Button
                icon={<HeartOutlined />}
                size="middle"
                onClick={() => navigate('/wishlist')}
                className="hidden border-none shadow-none hover:bg-slate-100 md:flex"
                title="Wishlist"
              />
              <Button
                icon={<WechatWorkOutlined />}
                size="middle"
                onClick={() => navigate('/chat')}
                className="hidden border-none shadow-none hover:bg-slate-100 md:flex"
                title="Chat"
              />
              <Button
                icon={<RobotOutlined />}
                size="middle"
                onClick={() => navigate('/chat/ai')}
                className="hidden border-none shadow-none hover:bg-slate-100 md:flex"
                title="AI Chat"
              />
            </Space.Compact>

            <Badge count={itemCount} size="small" className="mr-1 md:mr-0">
              <Button
                icon={<ShoppingCartOutlined />}
                size="middle"
                onClick={() => navigate('/cart')}
                className="border-none shadow-none hover:bg-slate-100"
                title="Giỏ hàng"
              />
            </Badge>

            {/* Nút tìm kiếm cho mobile */}
            <Button
              icon={<SearchOutlined />}
              size="middle"
              onClick={() => setSearchVisible(true)}
              className="flex border-none shadow-none hover:bg-slate-100 md:hidden"
              title="Tìm kiếm"
            />

            {isAuthenticated ? (
              <>
                <Dropdown
                  menu={{ items: userMenuItems }}
                  placement="bottomRight"
                  className="hidden md:block"
                >
                  <Avatar
                    src={
                      user?.avatar ||
                      'https://imgs.search.brave.com/kRzOEK2P26KHgRlY94E5DGE517Q4IJTULPg_lFWXLSU/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly90aHlw/aXguY29tL3dwLWNv/bnRlbnQvdXBsb2Fk/cy8yMDIxLzEwL2Fu/aW1lLWF2YXRhci1w/cm9maWxlLXBpY3R1/cmUtdGh5cGl4LTI0/LTcwMHg3MDAuanBn'
                    }
                    icon={<UserOutlined />}
                    className="cursor-pointer"
                    size="default"
                  />
                </Dropdown>
                <span className="ml-1 hidden text-sm font-medium text-gray-700 lg:block">
                  {user?.name}
                </span>
              </>
            ) : (
              <div className="hidden md:flex md:items-center md:gap-2">
                <Button
                  onClick={() => navigate('/login')}
                  className="text-sm"
                  size="middle"
                >
                  Đăng nhập
                </Button>
                <Button
                  type="primary"
                  onClick={() => navigate('/register')}
                  className="bg-blue-600 text-sm hover:bg-blue-700"
                  size="middle"
                >
                  Đăng ký
                </Button>
              </div>
            )}

            {/* Nút menu mobile */}
            <Button
              icon={<MenuOutlined />}
              size="middle"
              className="flex border-none shadow-none hover:bg-slate-100 lg:hidden"
              onClick={() => setMobileMenuVisible(true)}
              title="Menu"
            />
          </div>
        </div>

        {/* Thanh tìm kiếm cho mobile (hiển thị khi click) */}
        {searchVisible && (
          <div className="absolute left-0 top-full w-full border-t border-gray-200 bg-white p-3 shadow-md md:hidden">
            <div className="mx-auto flex max-w-6xl items-center">
              <input
                type="text"
                placeholder="Tìm kiếm..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="flex-1 rounded-lg border border-gray-300 py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
              <Button
                icon={<SearchOutlined />}
                type="text"
                onClick={handleSearch}
                className="ml-2"
              />
              <Button
                type="text"
                onClick={() => setSearchVisible(false)}
                className="ml-1"
              >
                Hủy
              </Button>
            </div>
          </div>
        )}
      </AntHeader>

      {/* Mobile Menu Drawer */}
      <Drawer
        title={
          <div className="flex items-center gap-2">
            <SafetyCertificateOutlined className="text-brand-primary" />
            <span className="font-bold">VaxChain</span>
          </div>
        }
        placement="right"
        onClose={handleMobileMenuClose}
        open={mobileMenuVisible}
        width={300}
        className="md:hidden"
      >
        <div className="flex h-full flex-col">
          {/* User Section */}
          <div className="border-b border-gray-200 pb-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Avatar
                  src={
                    user?.avatar ||
                    'https://imgs.search.brave.com/kRzOEK2P26KHgRlY94E5DGE517Q4IJTULPg_lFWXLSU/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly90aHlw/aXguY29tL3dwLWNv/bnRlbnQvdXBsb2Fk/cy8yMDIxLzEwL2Fu/aW1lLWF2YXRhci1w/cm9maWxlLXBpY3R1/cmUtdGh5cGl4LTI0/LTcwMHg3MDAuanBn'
                  }
                  icon={<UserOutlined />}
                  size="large"
                />
                <div className="overflow-hidden">
                  <div className="truncate font-medium">
                    {user?.name || 'User'}
                  </div>
                  <div className="truncate text-sm text-gray-500">
                    {user?.email}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <Button
                  type="primary"
                  block
                  onClick={() => {
                    navigate('/login');
                    setMobileMenuVisible(false);
                  }}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Đăng nhập
                </Button>
                <Button
                  block
                  onClick={() => {
                    navigate('/register');
                    setMobileMenuVisible(false);
                  }}
                >
                  Đăng ký
                </Button>
              </div>
            )}
          </div>

          {/* Navigation Menu */}
          <div className="flex-1 overflow-y-auto py-4">
            <Menu
              mode="vertical"
              selectedKeys={[location.pathname]}
              items={menuItems}
              onClick={handleMobileMenuItemClick}
              className="border-none"
            />

            {/* User Menu Items (if authenticated) */}
            {isAuthenticated && (
              <>
                <div className="my-4 border-t border-gray-200" />
                <Menu
                  mode="vertical"
                  items={userMenuItems}
                  onClick={handleMobileUserMenuClick}
                  className="border-none"
                />
              </>
            )}
          </div>

          {/* Additional Mobile Actions */}
          <div className="border-t border-gray-200 pt-4">
            <div className="grid grid-cols-2 gap-2">
              <Button
                icon={<HeartOutlined />}
                onClick={() => {
                  navigate('/wishlist');
                  setMobileMenuVisible(false);
                }}
                block
              >
                Wishlist
              </Button>
              <Button
                icon={<WechatWorkOutlined />}
                onClick={() => {
                  navigate('/chat');
                  setMobileMenuVisible(false);
                }}
                block
              >
                Chat
              </Button>
              <Button
                icon={<RobotOutlined />}
                onClick={() => {
                  navigate('/chat/ai');
                  setMobileMenuVisible(false);
                }}
                block
              >
                AI Chat
              </Button>
              <Button
                icon={<ShoppingCartOutlined />}
                onClick={() => {
                  navigate('/cart');
                  setMobileMenuVisible(false);
                }}
                block
              >
                <Badge count={itemCount} size="small">
                  Giỏ hàng
                </Badge>
              </Button>
            </div>
          </div>
        </div>
      </Drawer>
    </>
  );
};

export default Navbar;
