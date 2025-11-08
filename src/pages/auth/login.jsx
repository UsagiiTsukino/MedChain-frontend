/* eslint-disable react-hooks/exhaustive-deps */
import {
  callLoginWithPassword,
  callLoginWithGoogle,
} from '../../config/api.auth';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Form, Input, message, Divider } from 'antd';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { setUserLoginInfo } from '../../redux/slice/accountSlide';
import { useEffect, useState } from 'react';
import { LockOutlined, GoogleOutlined, MailOutlined } from '@ant-design/icons';
import './form.css';
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
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-blue-600 py-6 px-8 text-white">
          <div className="flex items-center justify-center mb-2">
            <i className="fas fa-shield-virus text-3xl mr-3" />
            <h1 className="text-2xl font-bold">VaxChain</h1>
          </div>
          <p className="text-center text-blue-100">
            Secure Vaccine Tracking System
          </p>
        </div>

        <div className="p-8">
          <div>
            {/* Main Login Form */}
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
                  prefix={<MailOutlined />}
                  placeholder="Email"
                  autoComplete="email"
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
                  prefix={<LockOutlined />}
                  placeholder="Mật khẩu"
                  autoComplete="current-password"
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  className="w-full"
                  size="large"
                >
                  Đăng nhập
                </Button>
              </Form.Item>

              <p className="text-center">
                Chưa có tài khoản đăng ký{' '}
                <Link to="/register" className="text-blue-400">
                  tại đây
                </Link>
              </p>
            </Form>

            {/* Divider */}
            <Divider className="my-6">
              <span className="text-gray-400 text-sm">Hoặc đăng nhập bằng</span>
            </Divider>

            <div className="alternative-login-methods">
              <Button
                type="primary"
                size="large"
                loading={googleLoading}
                onClick={handleGoogleLogin}
                className="w-full google-login-btn"
                style={{
                  backgroundColor: '#4285f4',
                  borderColor: '#4285f4',
                  color: 'white',
                  height: '40px',
                  fontWeight: '500',
                  borderRadius: '6px',
                }}
              >
                <GoogleOutlined style={{ marginRight: '8px' }} />
                Đăng nhập với Google
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-8 py-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            © 2025 VaxChain. All rights reserved.
            <i className="fas fa-link text-blue-500 ml-1" />
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
