import { useState } from 'react';
import { Layout, Avatar, Dropdown, Button, Drawer, message, Badge } from 'antd';
import {
  UserOutlined,
  MenuOutlined,
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
import { useNavigate, useLocation } from 'react-router-dom';
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
    try {
      await callLogout();
    } catch {
      // Ignore API errors, continue with local logout
    }
    // Always logout locally regardless of API response
    localStorage.removeItem('access_token');
    dispatch(setLogoutAction({}));
    message.success('Đăng xuất thành công');
    navigate('/');
  };

  const handleMobileMenuClose = () => {
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
      <AntHeader className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 px-4 shadow-sm md:px-6">
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between">
          {/* Logo và menu chính cho desktop */}
          <div className="flex items-center gap-8">
            <div
              className="cursor-pointer flex items-center gap-3 group"
              onClick={() => navigate('/')}
            >
              <div className="relative">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <SafetyCertificateOutlined className="text-white text-xl" />
                </div>
                <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-green-500 border-2 border-white" />
              </div>
              <div className="hidden md:block">
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  VaxChain
                </span>
              </div>
            </div>

            {/* Menu desktop */}
            <nav className="hidden lg:flex items-center gap-1">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.key;
                const hasChildren = item.children && item.children.length > 0;

                if (hasChildren) {
                  return (
                    <Dropdown
                      key={item.key}
                      menu={{
                        items: item.children.map((child) => ({
                          key: child.key,
                          label: child.label,
                          onClick: () => navigate(child.key),
                        })),
                      }}
                      placement="bottomLeft"
                      trigger={['hover']}
                    >
                      <button className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 flex items-center gap-2">
                        {item.icon}
                        <span>{item.label}</span>
                      </button>
                    </Dropdown>
                  );
                }

                return (
                  <button
                    key={item.key}
                    onClick={() => navigate(item.key)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                      isActive
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Phần bên phải: Tìm kiếm, nút action và user */}
          <div className="flex items-center gap-3">
            {/* Thanh tìm kiếm cho desktop */}
            <div className="hidden md:block">
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Tìm kiếm vaccine..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-48 lg:w-64 rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-11 pr-4 text-sm transition-all focus:w-56 lg:focus:w-72 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-blue-500"
                />
                <SearchOutlined className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
            </div>

            {/* Các nút action */}
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={() => navigate('/ai-booking')}
                className="relative flex items-center gap-2 px-3 py-2.5 rounded-xl bg-purple-50 text-purple-600 hover:bg-purple-100 hover:text-purple-700 transition-all duration-200"
                title="Tư vấn AI"
              >
                <RobotOutlined className="text-lg" />
                <span className="text-sm font-medium">AI tư vấn</span>
                <span className="absolute -top-0.5 -right-0.5 px-1.5 py-0.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs rounded-full font-bold shadow-md animate-pulse text-[10px] leading-none">
                  NEW
                </span>
              </button>
            </div>

            <Badge count={itemCount} size="small" offset={[-5, 5]}>
              <button
                onClick={() => navigate('/cart')}
                className="p-2.5 rounded-xl text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
                title="Giỏ hàng"
              >
                <ShoppingCartOutlined className="text-lg" />
              </button>
            </Badge>

            {/* Nút tìm kiếm cho mobile */}
            <button
              onClick={() => setSearchVisible(true)}
              className="flex md:hidden p-2.5 rounded-xl text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
              title="Tìm kiếm"
            >
              <SearchOutlined className="text-lg" />
            </button>

            {isAuthenticated ? (
              <div className="hidden md:flex items-center gap-3 pl-3 border-l border-gray-200">
                <Dropdown
                  menu={{
                    items: userMenuItems.map((item) => {
                      if (item.type === 'divider') return item;
                      return {
                        ...item,
                        onClick: undefined, // Remove onClick from item
                      };
                    }),
                    onClick: (e) => {
                      const item = userMenuItems.find((i) => i.key === e.key);
                      if (item && item.onClick) {
                        item.onClick();
                      }
                    },
                  }}
                  placement="bottomRight"
                  trigger={['click']}
                >
                  <button className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-gray-50 transition-all duration-200 group">
                    <Avatar
                      src={user?.avatar}
                      icon={<UserOutlined />}
                      className="border-2 border-gray-200 group-hover:border-blue-500 transition-all"
                      size={36}
                    />
                    <div className="text-left hidden lg:block">
                      <div className="text-sm font-medium text-gray-900 line-clamp-1 max-w-24">
                        {user?.fullname || 'User'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {user?.role === 'ADMIN'
                          ? 'Quản trị viên'
                          : user?.role === 'DOCTOR'
                          ? 'Bác sĩ'
                          : user?.role === 'CASHIER'
                          ? 'Thu ngân'
                          : 'Người dùng'}
                      </div>
                    </div>
                  </button>
                </Dropdown>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2 pl-3 border-l border-gray-200">
                <Button
                  onClick={() => navigate('/login')}
                  className="rounded-lg font-medium"
                  size="middle"
                >
                  Đăng nhập
                </Button>
                <Button
                  type="primary"
                  onClick={() => navigate('/register')}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 border-0 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-300"
                  size="middle"
                >
                  Đăng ký
                </Button>
              </div>
            )}

            {/* Nút menu mobile */}
            <button
              onClick={() => setMobileMenuVisible(true)}
              className="flex lg:hidden p-2.5 rounded-xl text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
              title="Menu"
            >
              <MenuOutlined className="text-lg" />
            </button>
          </div>
        </div>

        {/* Thanh tìm kiếm cho mobile (hiển thị khi click) */}
        {searchVisible && (
          <div className="absolute left-0 top-full w-full bg-white/95 backdrop-blur-md border-b border-gray-100 p-4 shadow-lg md:hidden">
            <div className="mx-auto flex max-w-7xl items-center gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm vaccine..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-blue-500"
                  autoFocus
                />
                <SearchOutlined className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
              <Button
                type="primary"
                onClick={handleSearch}
                className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 border-0"
              >
                Tìm
              </Button>
              <Button
                onClick={() => setSearchVisible(false)}
                className="rounded-xl"
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
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
              <SafetyCertificateOutlined className="text-white text-xl" />
            </div>
            <div>
              <div className="font-bold text-gray-900">VaxChain</div>
              <div className="text-xs text-gray-500">Blockchain Healthcare</div>
            </div>
          </div>
        }
        placement="right"
        onClose={handleMobileMenuClose}
        open={mobileMenuVisible}
        width={320}
        className="md:hidden"
        styles={{
          header: { borderBottom: '1px solid #f0f0f0', padding: '20px' },
          body: { padding: 0 },
        }}
      >
        <div className="flex h-full flex-col">
          {/* User Section */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Avatar
                  src={user?.avatar}
                  icon={<UserOutlined />}
                  size={56}
                  className="border-4 border-white shadow-lg"
                />
                <div className="overflow-hidden flex-1">
                  <div className="truncate font-semibold text-gray-900">
                    {user?.fullname || 'User'}
                  </div>
                  <div className="truncate text-sm text-gray-600">
                    {user?.email}
                  </div>
                  <div className="mt-1 inline-flex items-center gap-1 bg-white px-2 py-0.5 rounded-full text-xs font-medium text-blue-600">
                    {user?.role === 'ADMIN'
                      ? '👑 Quản trị viên'
                      : user?.role === 'DOCTOR'
                      ? '👨‍⚕️ Bác sĩ'
                      : user?.role === 'CASHIER'
                      ? '💼 Thu ngân'
                      : '👤 Người dùng'}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <Button
                  type="primary"
                  block
                  size="large"
                  onClick={() => {
                    navigate('/login');
                    setMobileMenuVisible(false);
                  }}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 border-0 rounded-xl font-semibold shadow-md h-12"
                >
                  Đăng nhập
                </Button>
                <Button
                  block
                  size="large"
                  onClick={() => {
                    navigate('/register');
                    setMobileMenuVisible(false);
                  }}
                  className="rounded-xl font-semibold h-12"
                >
                  Đăng ký ngay
                </Button>
              </div>
            )}
          </div>

          {/* Navigation Menu */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="mb-4">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-3 mb-2">
                Điều hướng
              </div>
              <div className="space-y-1">
                {menuItems.map((item) => {
                  const isActive = location.pathname === item.key;
                  const hasChildren = item.children && item.children.length > 0;

                  if (hasChildren) {
                    return (
                      <div key={item.key} className="space-y-1">
                        <div className="px-3 py-2 text-sm font-medium text-gray-700 flex items-center gap-2">
                          {item.icon}
                          <span>{item.label}</span>
                        </div>
                        {item.children.map((child) => {
                          const isChildActive = location.pathname === child.key;
                          return (
                            <button
                              key={child.key}
                              onClick={() => {
                                navigate(child.key);
                                setMobileMenuVisible(false);
                              }}
                              className={`w-full text-left px-3 py-2.5 pl-10 rounded-xl text-sm font-medium transition-all duration-200 ${
                                isChildActive
                                  ? 'bg-blue-50 text-blue-600'
                                  : 'text-gray-600 hover:bg-gray-50'
                              }`}
                            >
                              {child.label}
                            </button>
                          );
                        })}
                      </div>
                    );
                  }

                  return (
                    <button
                      key={item.key}
                      onClick={() => {
                        navigate(item.key);
                        setMobileMenuVisible(false);
                      }}
                      className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                        isActive
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* User Menu Items (if authenticated) */}
            {isAuthenticated && (
              <div className="mt-6">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-3 mb-2">
                  Tài khoản
                </div>
                <div className="space-y-1">
                  {userMenuItems.map((item) => {
                    if (item.type === 'divider')
                      return (
                        <div
                          key="divider"
                          className="my-2 border-t border-gray-200"
                        />
                      );

                    return (
                      <button
                        key={item.key}
                        onClick={() => {
                          item.onClick && item.onClick();
                          if (item.key !== 'logout') {
                            setMobileMenuVisible(false);
                          }
                        }}
                        className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                          item.danger
                            ? 'text-red-600 hover:bg-red-50'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {item.icon}
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Additional Mobile Actions */}
          <div className="border-t border-gray-200 p-4 bg-gray-50">
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => {
                  navigate('/ai-booking');
                  setMobileMenuVisible(false);
                }}
                title="Tư vấn AI"
                className="relative flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-50 text-purple-600 hover:bg-purple-100 hover:text-purple-700 transition-all duration-200"
              >
                <RobotOutlined className="text-xl" />
                <span className="text-sm font-medium">AI tư vấn</span>
                <span className="absolute -top-0.5 -right-0.5 px-1.5 py-0.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[10px] font-bold rounded-md shadow-md animate-pulse">
                  NEW
                </span>
              </button>
              <button
                onClick={() => {
                  navigate('/cart');
                  setMobileMenuVisible(false);
                }}
                title="Giỏ hàng"
                className="relative p-3 rounded-xl text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
              >
                <ShoppingCartOutlined className="text-2xl" />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold">
                    {itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </Drawer>
    </>
  );
};

export default Navbar;
