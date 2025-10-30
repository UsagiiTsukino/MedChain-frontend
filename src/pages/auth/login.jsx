/* eslint-disable react-hooks/exhaustive-deps */
import {
  callLoginWithPassword,
  callLoginWithGoogle,
} from '../../config/api.auth';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Form, Input, message, Divider } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { setUserLoginInfo } from '../../redux/slice/accountSlide';
import { useEffect, useState } from 'react';
import { LockOutlined, GoogleOutlined, MailOutlined } from '@ant-design/icons';
import './form.css';
import { triggerGoogleLogin, decodeGoogleToken } from '../../utils/googleAuth';

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.account.isAuthenticated);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated]);

  const handlePasswordLogin = async (values) => {
    setLoading(true);
    const { email, password } = values;
    const response = await callLoginWithPassword(email, password);
    if (response && response.data) {
      localStorage.setItem('access_token', response.data.accessToken);
      dispatch(setUserLoginInfo(response.data.user));
      message.success('Đăng nhập thành công!');
      navigate('/');
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

        if (res?.data) {
          dispatch(setUserLoginInfo(res.data?.user));
          message.success('Đăng nhập Google thành công!');
          navigate('/');
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
