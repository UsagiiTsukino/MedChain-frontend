/* eslint-disable react-hooks/exhaustive-deps */
import {
  callLoginWithPassword,
  callLoginWithGoogle,
} from '../../config/api.auth';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Form, Input, message, Divider, Card } from 'antd';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { setUserLoginInfo } from '../../redux/slice/accountSlide';
import { useEffect, useState } from 'react';
import {
  LockOutlined,
  GoogleOutlined,
  MailOutlined,
  SafetyOutlined,
  MedicineBoxOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import './form.css';
import './auth.css';
import { triggerGoogleLogin, decodeGoogleToken } from '../../utils/googleAuth';

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useSelector((state) => state.account.isAuthenticated);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [form] = Form.useForm();

  // Get redirect path from location state or query params
  const from =
    location.state?.from?.pathname ||
    location.search?.split('redirect=')[1] ||
    null;

  const user = useSelector((state) => state.account.user);

  // Helper function to normalize role (handle both number ID and string name)
  const normalizeRole = (role) => {
    if (!role) return null;

    // If it's already a string, return as is
    if (typeof role === 'string') {
      return role;
    }

    // If it's a number, map to role name
    const roleMap = {
      1: 'ADMIN',
      2: 'PATIENT',
      3: 'DOCTOR',
      4: 'CASHIER',
    };

    return roleMap[role] || null;
  };

  // Helper function to determine redirect path based on role
  const getRedirectPath = (role, savedPath) => {
    if (savedPath) {
      return savedPath;
    }

    const normalizedRole = normalizeRole(role);

    switch (normalizedRole) {
      case 'ADMIN':
        return '/admin/dashboard';
      case 'DOCTOR':
      case 'CASHIER':
        return '/staff/dashboard';
      default:
        return '/';
    }
  };

  useEffect(() => {
    if (isAuthenticated && user?.role) {
      if (from) {
        // If came from a protected route, redirect back to it
        const redirectPath = getRedirectPath(user.role, from);
        navigate(redirectPath, { replace: true });
      } else {
        // If manually navigated to /login while authenticated, redirect to home
        navigate('/', { replace: true });
      }
    }
  }, [isAuthenticated, user?.role, from, navigate]);

  const handlePasswordLogin = async (values) => {
    setLoading(true);
    const { email, password } = values;
    const response = await callLoginWithPassword(email, password);
    if (response && response.accessToken) {
      localStorage.setItem('access_token', response.accessToken);
      dispatch(setUserLoginInfo(response.user));
      message.success('Đăng nhập thành công!');

      // Redirect based on role or saved path
      const redirectPath = getRedirectPath(response.user?.role, from);
      navigate(redirectPath);
    } else {
      message.error('Email hoặc mật khẩu không đúng!');
    }

    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    try {
      setGoogleLoading(true);

      // Get Google OAuth token
      const googleToken = await triggerGoogleLogin();

      if (googleToken) {
        // Decode token to get user info (for debugging)
        const userInfo = decodeGoogleToken(googleToken);
        console.log('Google user info:', userInfo);

        // Send token to backend for verification and login
        const res = await callLoginWithGoogle(googleToken);

        if (res && res.user) {
          localStorage.setItem('access_token', res.accessToken);
          dispatch(setUserLoginInfo(res.user));
          message.success('Đăng nhập Google thành công!');

          // Redirect based on role or saved path
          const redirectPath = getRedirectPath(res.user?.role, from);
          navigate(redirectPath);
        } else {
          message.error('Không thể đăng nhập với tài khoản Google này!');
        }
      }
    } catch (error) {
      console.error('Google login error:', error);
      if (error.message.includes('popup')) {
        message.error('Vui lòng cho phép popup để đăng nhập Google!');
      } else {
        message.error('Đăng nhập Google thất bại!');
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 overflow-hidden">
      {/* Left Side - Branding & Features */}
      <div
        className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-12 flex-col justify-between relative overflow-hidden transition-all duration-700 ease-in-out"
        style={{
          animation: 'slideInFromLeft 0.7s ease-out',
        }}
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full -mr-48 -mt-48" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-white opacity-5 rounded-full -ml-40 -mb-40" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-xl">
              <SafetyOutlined className="text-3xl text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">MedChainAI</h1>
              <p className="text-blue-100 text-sm">Nền tảng Y tế Blockchain</p>
            </div>
          </div>

          <div className="space-y-8 mt-16">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center flex-shrink-0">
                <SafetyOutlined className="text-2xl text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  An toàn & Minh bạch
                </h3>
                <p className="text-blue-100">
                  Công nghệ Blockchain đảm bảo hồ sơ tiêm chủng của bạn được bảo
                  mật, không thể thay đổi và có thể xác minh
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center flex-shrink-0">
                <MedicineBoxOutlined className="text-2xl text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Theo dõi Toàn diện
                </h3>
                <p className="text-blue-100">
                  Theo dõi tất cả lịch hẹn tiêm chủng, các mũi tiêm và chứng
                  nhận vaccine của bạn tại một nơi
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center flex-shrink-0">
                <CheckCircleOutlined className="text-2xl text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Mạng lưới Tin cậy
                </h3>
                <p className="text-blue-100">
                  Kết nối với các nhà cung cấp dịch vụ y tế và trung tâm tiêm
                  chủng trên toàn quốc
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-blue-100 text-sm">
            © 2025 MedChainAI. Được hỗ trợ bởi Công nghệ Blockchain
          </p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div
        className="flex-1 flex items-center justify-center p-8"
        style={{
          animation: 'slideInFromRight 0.7s ease-out',
        }}
      >
        <Card
          className="w-full max-w-md shadow-2xl"
          style={{
            borderRadius: '20px',
            border: 'none',
          }}
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-4 shadow-lg">
              <SafetyOutlined className="text-3xl text-white" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
              Chào mừng trở lại
            </h2>
            <p className="text-gray-500">
              Đăng nhập để truy cập hồ sơ tiêm chủng của bạn
            </p>
          </div>

          <Form
            form={form}
            name="password_login"
            onFinish={handlePasswordLogin}
            layout="vertical"
            size="large"
          >
            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Vui lòng nhập email!' },
                { type: 'email', message: 'Email không hợp lệ!' },
              ]}
            >
              <Input
                prefix={<MailOutlined className="text-gray-400 text-lg mr-2" />}
                placeholder="Email address"
                autoComplete="email"
                className="h-12 rounded-lg"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập mật khẩu!',
                },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400 text-lg mr-2" />}
                placeholder="Password"
                autoComplete="current-password"
                className="h-12 rounded-lg"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="w-full h-12 text-base font-semibold rounded-lg shadow-lg"
                style={{
                  background:
                    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none',
                }}
              >
                Sign In
              </Button>
            </Form.Item>
          </Form>

          <Divider className="my-6">
            <span className="text-gray-400 text-sm">Or continue with</span>
          </Divider>

          <Button
            size="large"
            loading={googleLoading}
            onClick={handleGoogleLogin}
            className="w-full h-12 rounded-lg font-medium"
            style={{
              borderColor: '#e5e7eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <GoogleOutlined
              style={{
                fontSize: '20px',
                color: '#4285f4',
                marginRight: '12px',
              }}
            />
            <span className="text-gray-700">Sign in with Google</span>
          </Button>

          <div className="text-center mt-6">
            <span className="text-gray-500">Don't have an account? </span>
            <Link
              to="/register"
              className="text-blue-600 font-semibold hover:text-blue-700"
            >
              Sign up
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
