import { useNavigate, Link } from 'react-router-dom';
import { message, Button, Form, Input, Card, Progress } from 'antd';
import { callRegister } from '../../config/api.auth';
import {
  LockOutlined,
  MailOutlined,
  UserOutlined,
  SafetyOutlined,
  CheckCircleOutlined,
  MedicineBoxOutlined,
  GlobalOutlined,
} from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import './auth.css';

const RegisterPage = () => {
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.account.isAuthenticated);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [passwordStrength, setPasswordStrength] = useState(0);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (password.length >= 12) strength += 25;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25;
    if (/\d/.test(password)) strength += 15;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 10;
    return Math.min(strength, 100);
  };

  const getPasswordStrengthColor = (strength) => {
    if (strength < 40) return '#ff4d4f';
    if (strength < 70) return '#faad14';
    return '#52c41a';
  };

  const getPasswordStrengthText = (strength) => {
    if (strength < 40) return 'Weak';
    if (strength < 70) return 'Medium';
    return 'Strong';
  };

  const handlePasswordChange = (e) => {
    const password = e.target.value;
    const strength = calculatePasswordStrength(password);
    setPasswordStrength(strength);
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    const { fullName, email, password } = values;
    const response = await callRegister(fullName, email, password);

    if (response && response.walletAddress) {
      message.success('Đăng ký thành công! Vui lòng đăng nhập.');
      navigate('/login');
    } else {
      message.error(
        'Đăng ký thất bại: ' +
          (response?.error || response?.message || 'Lỗi không xác định')
      );
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 overflow-hidden">
      {/* Left Side - Register Form */}
      <div
        className="flex-1 flex items-center justify-center p-8 order-2 lg:order-1"
        style={{
          animation: 'slideInFromLeft 0.7s ease-out',
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
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl mb-4 shadow-lg">
              <MedicineBoxOutlined className="text-3xl text-white" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              Tạo tài khoản
            </h2>
            <p className="text-gray-500">
              Bắt đầu hành trình tiêm chủng an toàn ngay hôm nay
            </p>
          </div>

          <Form
            form={form}
            name="register_form"
            onFinish={handleSubmit}
            layout="vertical"
            size="large"
          >
            <Form.Item
              name="fullName"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập họ tên!',
                },
                {
                  min: 2,
                  message: 'Tên phải có ít nhất 2 ký tự',
                },
              ]}
            >
              <Input
                prefix={<UserOutlined className="text-gray-400 text-lg mr-2" />}
                placeholder="Họ và tên"
                className="h-12 rounded-lg"
              />
            </Form.Item>

            <Form.Item
              name="email"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập email!',
                },
                {
                  type: 'email',
                  message: 'Vui lòng nhập email hợp lệ!',
                },
              ]}
            >
              <Input
                prefix={<MailOutlined className="text-gray-400 text-lg mr-2" />}
                placeholder="Địa chỉ Email"
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
                {
                  min: 8,
                  message: 'Mật khẩu phải có ít nhất 8 ký tự',
                },
              ]}
            >
              <div>
                <Input.Password
                  prefix={
                    <LockOutlined className="text-gray-400 text-lg mr-2" />
                  }
                  placeholder="Mật khẩu (tối thiểu 8 ký tự)"
                  className="h-12 rounded-lg"
                  onChange={handlePasswordChange}
                />
                {passwordStrength > 0 && (
                  <div className="mt-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-gray-500">
                        Độ mạnh mật khẩu:
                      </span>
                      <span
                        className="text-xs font-semibold"
                        style={{
                          color: getPasswordStrengthColor(passwordStrength),
                        }}
                      >
                        {getPasswordStrengthText(passwordStrength) === 'Weak' &&
                          'Yếu'}
                        {getPasswordStrengthText(passwordStrength) ===
                          'Medium' && 'Trung bình'}
                        {getPasswordStrengthText(passwordStrength) ===
                          'Strong' && 'Mạnh'}
                      </span>
                    </div>
                    <Progress
                      percent={passwordStrength}
                      strokeColor={getPasswordStrengthColor(passwordStrength)}
                      showInfo={false}
                      size="small"
                    />
                  </div>
                )}
              </div>
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              dependencies={['password']}
              rules={[
                {
                  required: true,
                  message: 'Vui lòng xác nhận mật khẩu!',
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Mật khẩu không khớp!'));
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400 text-lg mr-2" />}
                placeholder="Xác nhận mật khẩu"
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
                    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                  border: 'none',
                }}
              >
                Tạo tài khoản
              </Button>
            </Form.Item>
          </Form>

          <div className="text-center mt-6">
            <span className="text-gray-500">Đã có tài khoản? </span>
            <Link
              to="/login"
              className="text-purple-600 font-semibold hover:text-purple-700"
            >
              Đăng nhập
            </Link>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-400 text-center">
              Bằng việc tạo tài khoản, bạn đồng ý với Điều khoản Dịch vụ và
              Chính sách Bảo mật của chúng tôi
            </p>
          </div>
        </Card>
      </div>

      {/* Right Side - Branding & Features */}
      <div
        className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-600 via-pink-600 to-indigo-600 p-12 flex-col justify-between relative overflow-hidden order-1 lg:order-2 transition-all duration-700 ease-in-out"
        style={{
          animation: 'slideInFromRight 0.7s ease-out',
        }}
      >
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-white opacity-5 rounded-full -ml-48 -mt-48" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-white opacity-5 rounded-full -mr-40 -mb-40" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-xl">
              <SafetyOutlined className="text-3xl text-purple-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">MedChainAI</h1>
              <p className="text-purple-100 text-sm">
                Tham gia Cuộc cách mạng Y tế
              </p>
            </div>
          </div>

          <div className="space-y-8 mt-16">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center flex-shrink-0">
                <GlobalOutlined className="text-2xl text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Truy cập Toàn cầu
                </h3>
                <p className="text-purple-100">
                  Truy cập hồ sơ tiêm chủng của bạn ở bất kỳ đâu trên thế giới
                  với xác minh blockchain
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center flex-shrink-0">
                <SafetyOutlined className="text-2xl text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Bảo mật Tuyệt đối
                </h3>
                <p className="text-purple-100">
                  Dữ liệu y tế của bạn được mã hóa và bảo mật bằng công nghệ
                  blockchain cấp quân sự
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center flex-shrink-0">
                <CheckCircleOutlined className="text-2xl text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Xác minh Tức thì
                </h3>
                <p className="text-purple-100">
                  Nhận chứng nhận kỹ thuật số được xác minh ngay lập tức sau mỗi
                  mũi tiêm vaccine
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-8 text-white">
            <div>
              <div className="text-3xl font-bold">10K+</div>
              <div className="text-purple-100 text-sm">Người dùng</div>
            </div>
            <div>
              <div className="text-3xl font-bold">50+</div>
              <div className="text-purple-100 text-sm">Phòng khám</div>
            </div>
            <div>
              <div className="text-3xl font-bold">99.9%</div>
              <div className="text-purple-100 text-sm">Thời gian hoạt động</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
