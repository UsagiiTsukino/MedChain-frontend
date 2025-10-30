/* eslint-disable react-hooks/rules-of-hooks */
import { useState } from 'react';
import {
  Row,
  Col,
  Card,
  Typography,
  Button,
  Form,
  Input,
  Avatar,
  Tabs,
  Table,
  Tag,
  Progress,
  Badge,
  Modal,
  Select,
  Switch,
  Statistic,
  message,
} from 'antd';
import {
  UserOutlined,
  EditOutlined,
  CameraOutlined,
  ShoppingOutlined,
  HeartOutlined,
  SettingOutlined,
  TrophyOutlined,
  GiftOutlined,
  BellOutlined,
  MailOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  TruckOutlined,
  DeleteOutlined,
  LockOutlined,
  SafetyOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setLogoutAction } from '../../redux/slice/accountSlide';
import { callLogout } from '../../config/api.auth';
import { callGetOrder } from '../../config/api.appointment';
import { render } from 'sass';

const { Title, Text, Paragraph } = Typography;

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.account);
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState('1');
  const [avatarModalVisible, setAvatarModalVisible] = useState(false);
  const [securityModalVisible, setSecurityModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [securityForm] = Form.useForm();

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }



  const handleLogout = async () => {
    const res = await callLogout();
    if (res && res && +res.statusCode === 200) {
      localStorage.removeItem('access_token');
      dispatch(setLogoutAction({}));
      message.success('Đăng xuất thành công');
      navigate('/');
    }
  };

  const handleSaveProfile = (values) => {
    console.log('Saving profile:', values);
    setEditMode(false);
    // Here you would dispatch an action to update user profile
  };

  const [ orders, setOrders ] = useState([]);

  const handleGetOrder = async () => {
    const response = await callGetOrder();
    setOrders(response.data);
  };
  handleGetOrder();


  const orderColumns = [
    {
      title: 'Order ID',
      dataIndex: 'orderId',
      key: 'orderId',
      render: (text) => <p>#ORD-{text}</p>,
    },
    {
      title: 'Order Date',
      dataIndex: 'orderDate',
      key: 'orderDate',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = 'blue';
        if (status === 'Delivered') color = 'green';
        if (status === 'Shipped') color = 'orange';
        if (status === 'Processing') color = 'blue';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: 'ItemCount',
      dataIndex: 'itemCount',
      key: 'itemCount',
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button type="link" size="small">
          View Details
        </Button>
      ),
    },
  ];

  // Mock wishlist data
  const wishlistItems = [
    {
      id: 1,
      name: 'Wireless Headphones',
      price: '$199.99',
      image:
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop',
    },
    {
      id: 2,
      name: 'Smart Watch',
      price: '$299.99',
      image:
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* Enhanced Profile Header */}
        <div className="mb-8">
          <Card>
            <div className="relative h-32 bg-gradient-to-r from-blue-600 to-purple-600">
              <div className="absolute inset-0 bg-black/20" />
            </div>
            <div className="relative -mt-16 px-6 pb-6">
              <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-end">
                <div className="relative">
                  <Avatar
                    size={120}
                    src={user?.avatar}
                    icon={<UserOutlined />}
                    style={{
                      border: '4px solid white',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                      background:
                        'linear-gradient(to bottom right, #60a5fa, #a78bfa)',
                    }}
                  />
                  <Button
                    icon={<CameraOutlined />}
                    shape="circle"
                    size="small"
                    onClick={() => setAvatarModalVisible(true)}
                    style={{
                      position: 'absolute',
                      bottom: 8,
                      right: 8,
                      background: '#fff',
                      color: '#4b5563',
                      border: '2px solid #fff',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    }}
                  />
                  <Badge
                    status="success"
                    style={{ position: 'absolute', top: 8, right: 8 }}
                    title="Online"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="mb-2 flex items-center gap-3">
                        <Title level={2} className="mb-0 text-gray-800">
                          {user?.name || 'John Doe'}
                        </Title>
                        <Badge
                          count="VIP"
                          style={{ backgroundColor: '#f59e0b' }}
                        />
                      </div>
                      <div className="mb-2 flex items-center gap-2">
                        <MailOutlined className="text-gray-400" />
                        <Text className="text-gray-600">
                          {user?.email || 'john.doe@example.com'}
                        </Text>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <CalendarOutlined />
                          Member since Jan 2024
                        </span>
                        <span className="flex items-center gap-1">
                          <TrophyOutlined />
                          Gold Member
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        icon={<EditOutlined />}
                        onClick={() => setEditMode(!editMode)}
                        type={editMode ? 'primary' : 'default'}
                        size="large"
                        style={{ borderRadius: '0.5rem' }}
                      >
                        {editMode ? 'Cancel' : 'Edit Profile'}
                      </Button>
                      <Button
                        icon={<SettingOutlined />}
                        size="large"
                        style={{ borderRadius: '0.5rem' }}
                        onClick={() => setActiveTab('4')}
                      >
                        Settings
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              {/* Profile Stats */}
              <div className="mt-6 grid grid-cols-2 gap-4 border-t border-gray-100 pt-6 sm:grid-cols-4">
                <div className="text-center">
                  <Statistic
                    title="Total Orders"
                    value={12}
                    prefix={<ShoppingOutlined className="text-blue-500" />}
                    valueStyle={{ color: '#1890ff', fontSize: '20px' }}
                  />
                </div>
                <div className="text-center">
                  <Statistic
                    title="Wishlist Items"
                    value={8}
                    prefix={<HeartOutlined className="text-red-500" />}
                    valueStyle={{ color: '#f5222d', fontSize: '20px' }}
                  />
                </div>
                <div className="text-center">
                  <Statistic
                    title="Reward Points"
                    value={2450}
                    prefix={<GiftOutlined className="text-orange-500" />}
                    valueStyle={{ color: '#fa8c16', fontSize: '20px' }}
                  />
                </div>
                <div className="text-center">
                  <Statistic
                    title="Total Saved"
                    value={189}
                    prefix="$"
                    suffix="USD"
                    valueStyle={{ color: '#52c41a', fontSize: '20px' }}
                  />
                </div>
              </div>
            </div>
          </Card>
        </div>
        {/* Enhanced Sidebar */}
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={8}>
            {/* Account Level Progress */}
            <div className="mb-6">
              <Card>
                <div className="mb-4 text-center">
                  <div className="mx-auto mb-3 flex size-16 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-orange-500">
                    <TrophyOutlined className="text-2xl text-white" />
                  </div>
                  <Title level={4} className="mb-1">
                    Gold Member
                  </Title>
                  <Text type="secondary">2,450 / 5,000 points to Platinum</Text>
                </div>
                <Progress
                  percent={49}
                  strokeColor={{
                    '0%': '#fbbf24',
                    '100%': '#f59e0b',
                  }}
                  className="mb-4"
                />
                <div className="rounded-lg bg-gradient-to-r from-yellow-50 to-orange-50 p-3">
                  <Text className="text-sm text-orange-800">
                    🎉 Earn 2,550 more points to unlock Platinum benefits!
                  </Text>
                </div>
              </Card>
            </div>
            {/* Recent Activity */}
            <Card>
              <Title level={4} className="mb-4">
                Recent Activity
              </Title>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-green-100">
                    <CheckCircleOutlined className="text-sm text-green-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <Text className="block text-sm font-medium">
                      Order #ORD-001 delivered
                    </Text>
                    <Text type="secondary" className="text-xs">
                      2 hours ago
                    </Text>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-blue-100">
                    <GiftOutlined className="text-sm text-blue-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <Text className="block text-sm font-medium">
                      Earned 150 reward points
                    </Text>
                    <Text type="secondary" className="text-xs">
                      1 day ago
                    </Text>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-orange-100">
                    <TruckOutlined className="text-sm text-orange-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <Text className="block text-sm font-medium">
                      Order #ORD-002 shipped
                    </Text>
                    <Text type="secondary" className="text-xs">
                      3 days ago
                    </Text>
                  </div>
                </div>
              </div>
            </Card>
          </Col>
          <Col xs={24} lg={16}>
            <Card>
              <Tabs
                activeKey={activeTab}
                onChange={setActiveTab}
                size="large"
                className="profile-tabs"
                items={[
                  {
                    key: '1',
                    label: (
                      <span className="flex items-center gap-2">
                        <UserOutlined />
                        Personal Info
                      </span>
                    ),
                    children: (
                      <div className="py-4">
                        {editMode ? (
                          <Form
                            form={form}
                            layout="vertical"
                            onFinish={handleSaveProfile}
                            initialValues={{
                              name: user?.name || 'John Doe',
                              email: user?.email || 'john.doe@example.com',
                              phone: '+1 (555) 123-4567',
                              address: '123 Main St, City, State 12345',
                              bio: 'I love shopping for quality products and discovering new brands.',
                            }}
                          >
                            <Row gutter={16}>
                              <Col xs={24} sm={12}>
                                <Form.Item
                                  label="Full Name"
                                  name="name"
                                  rules={[{ required: true }]}
                                >
                                  <Input size="large" />
                                </Form.Item>
                              </Col>
                              <Col xs={24} sm={12}>
                                <Form.Item
                                  label="Email"
                                  name="email"
                                  rules={[{ required: true, type: 'email' }]}
                                >
                                  <Input size="large" />
                                </Form.Item>
                              </Col>
                            </Row>

                            <Row gutter={16}>
                              <Col xs={24} sm={12}>
                                <Form.Item label="Phone" name="phone">
                                  <Input size="large" />
                                </Form.Item>
                              </Col>
                              <Col xs={24} sm={12}>
                                <Form.Item
                                  label="Date of Birth"
                                  name="birthday"
                                >
                                  <Input
                                    size="large"
                                    placeholder="MM/DD/YYYY"
                                  />
                                </Form.Item>
                              </Col>
                            </Row>

                            <Form.Item label="Address" name="address">
                              <Input.TextArea rows={3} />
                            </Form.Item>

                            <Form.Item label="Bio" name="bio">
                              <Input.TextArea
                                rows={4}
                                placeholder="Tell us about yourself..."
                              />
                            </Form.Item>

                            <div className="flex gap-2">
                              <Button
                                type="primary"
                                htmlType="submit"
                                size="large"
                              >
                                Save Changes
                              </Button>
                              <Button
                                size="large"
                                onClick={() => setEditMode(false)}
                              >
                                Cancel
                              </Button>
                            </div>
                          </Form>
                        ) : (
                          <div className="space-y-6">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                              <div>
                                <Text type="secondary">Full Name</Text>
                                <div className="text-base font-medium">
                                  {user?.name || 'John Doe'}
                                </div>
                              </div>
                              <div>
                                <Text type="secondary">Email</Text>
                                <div className="text-base font-medium">
                                  {user?.email || 'john.doe@example.com'}
                                </div>
                              </div>
                              <div>
                                <Text type="secondary">Phone</Text>
                                <div className="text-base font-medium">
                                  +1 (555) 123-4567
                                </div>
                              </div>
                              <div>
                                <Text type="secondary">Date of Birth</Text>
                                <div className="text-base font-medium">
                                  January 15, 1990
                                </div>
                              </div>
                            </div>

                            <div>
                              <Text type="secondary">Address</Text>
                              <div className="text-base font-medium">
                                123 Main St, City, State 12345
                              </div>
                            </div>

                            <div>
                              <Text type="secondary">Bio</Text>
                              <Paragraph className="text-base">
                                I love shopping for quality products and
                                discovering new brands. Always looking for the
                                best deals and latest trends.
                              </Paragraph>
                            </div>
                          </div>
                        )}
                      </div>
                    ),
                  },
                  {
                    key: '2',
                    label: (
                      <span className="flex items-center gap-2">
                        <ShoppingOutlined />
                        Order History
                      </span>
                    ),
                    children: (
                      <div className="py-4">
                        <div className="mb-6 flex items-center justify-between">
                          <Title level={4}>Recent Orders</Title>
                          <Button type="primary">View All Orders</Button>
                        </div>
                        <Table
                          columns={orderColumns}
                          dataSource={orders}
                          pagination={false}
                        />
                      </div>
                    ),
                  },
                  {
                    key: '3',
                    label: (
                      <span className="flex items-center gap-2">
                        <HeartOutlined />
                        Wishlist
                      </span>
                    ),
                    children: (
                      <div className="py-4">
                        <div className="mb-6 flex items-center justify-between">
                          <Title level={4}>My Wishlist</Title>
                          <Button type="primary">Browse Products</Button>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                          {wishlistItems.map((item) => (
                            <div
                              key={item.id}
                              className="rounded-lg border border-gray-200 shadow"
                            >
                              <Card bordered={false}>
                                <div className="text-center">
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="mb-3 h-32 w-full rounded-lg object-cover"
                                  />
                                  <Title level={5} className="mb-2">
                                    {item.name}
                                  </Title>
                                  <Text
                                    strong
                                    className="text-lg text-blue-600"
                                  >
                                    {item.price}
                                  </Text>
                                  <div className="mt-3 space-y-2">
                                    <Button type="primary" block>
                                      Add to Cart
                                    </Button>
                                    <Button block>Remove</Button>
                                  </div>
                                </div>
                              </Card>
                            </div>
                          ))}
                        </div>
                      </div>
                    ),
                  },
                  {
                    key: '4',
                    label: (
                      <span className="flex items-center gap-2">
                        <SettingOutlined />
                        Settings
                      </span>
                    ),
                    children: (
                      <div className="py-6">
                        <Title level={4} className="mb-6">
                          Account Settings
                        </Title>

                        <div className="space-y-6">
                          {/* Notification Settings */}
                          <Card>
                            <div className="mb-4 flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <BellOutlined className="text-lg text-blue-500" />
                                <div>
                                  <Text strong>Email Notifications</Text>
                                  <Text
                                    type="secondary"
                                    className="block text-sm"
                                  >
                                    Receive updates about your orders and
                                    account
                                  </Text>
                                </div>
                              </div>
                              <Switch defaultChecked />
                            </div>
                          </Card>

                          {/* Security Settings */}
                          <Card>
                            <div className="mb-4 flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <LockOutlined className="text-lg text-green-500" />
                                <div>
                                  <Text strong>Two-Factor Authentication</Text>
                                  <Text
                                    type="secondary"
                                    className="block text-sm"
                                  >
                                    Add an extra layer of security to your
                                    account
                                  </Text>
                                </div>
                              </div>
                              <Button
                                type="primary"
                                onClick={() => setSecurityModalVisible(true)}
                              >
                                Configure
                              </Button>
                            </div>
                          </Card>

                          {/* Privacy Settings */}
                          <Card>
                            <div className="mb-4 flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <SafetyOutlined className="text-lg text-purple-500" />
                                <div>
                                  <Text strong>Profile Visibility</Text>
                                  <Text
                                    type="secondary"
                                    className="block text-sm"
                                  >
                                    Control who can see your profile information
                                  </Text>
                                </div>
                              </div>
                              <Select
                                defaultValue="friends"
                                style={{ width: 120 }}
                              >
                                <Select.Option value="public">
                                  Public
                                </Select.Option>
                                <Select.Option value="friends">
                                  Friends
                                </Select.Option>
                                <Select.Option value="private">
                                  Private
                                </Select.Option>
                              </Select>
                            </div>
                          </Card>

                          {/* Danger Zone */}
                          <div className="rounded-lg border border-red-200 bg-red-50">
                            <Card bordered={false}>
                              <Title level={5} className="mb-4 text-red-600">
                                Danger Zone
                              </Title>
                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <Text strong>Delete Account</Text>
                                    <Text
                                      type="secondary"
                                      className="block text-sm"
                                    >
                                      Permanently delete your account and all
                                      data
                                    </Text>
                                  </div>
                                  <Button danger>Delete Account</Button>
                                </div>
                                <div className="flex items-center justify-between">
                                  <div>
                                    <Text strong>Sign Out All Devices</Text>
                                    <Text
                                      type="secondary"
                                      className="block text-sm"
                                    >
                                      Sign out from all devices except this one
                                    </Text>
                                  </div>
                                  <Button danger onClick={handleLogout}>
                                    Sign Out All
                                  </Button>
                                </div>
                              </div>
                            </Card>
                          </div>
                        </div>
                      </div>
                    ),
                  },
                ]}
              />
            </Card>
          </Col>
        </Row>

        {/* Avatar Upload Modal */}
        <Modal
          title="Update Profile Picture"
          open={avatarModalVisible}
          onCancel={() => setAvatarModalVisible(false)}
          footer={null}
        >
          <div className="py-6 text-center">
            <Avatar
              size={120}
              src={user?.avatar || ''}
              icon={<UserOutlined />}
              style={{ marginBottom: '1.5rem' }}
            />
            <div className="space-y-4">
              <Button
                type="primary"
                icon={<CameraOutlined />}
                size="large"
                block
              >
                Upload New Photo
              </Button>
              <Button icon={<DeleteOutlined />} size="large" block>
                Remove Current Photo
              </Button>
            </div>
          </div>
        </Modal>

        {/* Security Settings Modal */}
        <Modal
          title="Security Settings"
          open={securityModalVisible}
          onCancel={() => setSecurityModalVisible(false)}
          footer={null}
          width={600}
        >
          <div className="py-4">
            <div className="space-y-6">
              <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                <div className="flex items-center gap-3">
                  <CheckCircleOutlined className="text-lg text-green-600" />
                  <div>
                    <Text strong className="text-green-800">
                      Account Secure
                    </Text>
                    <Text className="block text-sm text-green-600">
                      Your account has strong security settings enabled
                    </Text>
                  </div>
                </div>
              </div>

              <Form form={securityForm} layout="vertical">
                <Form.Item label="Current Password" name="currentPassword">
                  <Input.Password
                    size="large"
                    placeholder="Enter current password"
                  />
                </Form.Item>

                <Form.Item label="New Password" name="newPassword">
                  <Input.Password
                    size="large"
                    placeholder="Enter new password"
                  />
                </Form.Item>

                <Form.Item label="Confirm New Password" name="confirmPassword">
                  <Input.Password
                    size="large"
                    placeholder="Confirm new password"
                  />
                </Form.Item>

                <div className="flex gap-3">
                  <Button type="primary" size="large">
                    Update Password
                  </Button>
                  <Button
                    size="large"
                    onClick={() => setSecurityModalVisible(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </Form>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default Profile;
