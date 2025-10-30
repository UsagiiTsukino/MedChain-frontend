import { useNavigate } from 'react-router-dom';
import { message, theme } from 'antd';

import { callRegister } from '../../config/api.auth';
import {
  LoginForm,
  ProConfigProvider,
  ProFormText,
} from '@ant-design/pro-components';
import { LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { token } = theme.useToken();
  const isAuthenticated = useSelector((state) => state.account.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);
  
  const handleSubmit = async (values) => {
    const { fullName, email, password } = values;
    const response = await callRegister(fullName, email, password);
    if (response && response.data) {
      message.success('Đăng ký thành công');
      navigate('/login');
    } else {
      message.error('Đăng ký thất bại ' + response.error);
    }
  };
  return (
    <ProConfigProvider hashed={false}>
      <div style={{ backgroundColor: token.colorBgContainer }}>
        <LoginForm
          logo="https://github.githubassets.com/favicons/favicon.png"
          title="Vaccation"
          subTitle="First time access requires registration information"
          onFinish={handleSubmit}
          submitter={{
            searchConfig: {
              submitText: 'Sign up',
            },
          }}
        >
          <ProFormText
            name="fullName"
            fieldProps={{
              size: 'large',
              prefix: (
                <UserOutlined
                  className="prefixIcon"
                  style={{ marginRight: 10 }}
                />
              ),
            }}
            placeholder="Full name"
            rules={[
              {
                required: true,
                message: 'Please enter your full name!',
              },
            ]}
          />
          <ProFormText
            name="email"
            fieldProps={{
              size: 'large',
              prefix: (
                <MailOutlined
                  className="prefixIcon"
                  style={{ marginRight: 10 }}
                />
              ),
            }}
            placeholder="Email"
            rules={[
              {
                required: true,
                message: 'Please enter your email!',
              },
            ]}
          />
          <ProFormText.Password
            name="password"
            fieldProps={{
              size: 'large',
              prefix: (
                <LockOutlined
                  className="prefixIcon"
                  style={{ marginRight: 10 }}
                />
              ),
              strengthText:
                'Password should contain numbers, letters and special characters, at least 8 characters long.',
              statusRender: (value) => {
                const getStatus = () => {
                  if (value && value.length > 12) {
                    return 'ok';
                  }
                  if (value && value.length > 6) {
                    return 'pass';
                  }
                  return 'poor';
                };
                const status = getStatus();
                if (status === 'pass') {
                  return (
                    <div style={{ color: token.colorWarning }}>Trung bình</div>
                  );
                }
                if (status === 'ok') {
                  return <div style={{ color: token.colorSuccess }}>Tốt</div>;
                }
                return <div style={{ color: token.colorError }}>Yếu</div>;
              },
            }}
            placeholder="Please enter password"
            rules={[
              {
                required: true,
                message: 'Vui long nhập password',
              },
            ]}
          />
        </LoginForm>
      </div>
    </ProConfigProvider>
  );
};

export default RegisterPage;
