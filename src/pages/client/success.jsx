'use strict';
import { PageContainer } from '@ant-design/pro-components';
import { Button, Result, Steps, Card, Row, Col } from 'antd';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  CopyOutlined,
  QrcodeOutlined,
  LockOutlined,
  SafetyCertificateOutlined,
  LinkOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import { updatePaymentPaypal } from '../../config/api.appointment';

const SuccessPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const appointmentHash = searchParams.get('appointment_hash');
  const paymentHash = searchParams.get('payment_hash');
  const booking_id = searchParams.get('booking');
  const payment_id = searchParams.get('payment');
  const payerID = searchParams.get('PayerID');
  const token = searchParams.get('token');

  useEffect(() => {
    const handleUpdate = async () => {
      if (token && payerID && booking_id && payment_id) {
        await updatePaymentPaypal(booking_id, payment_id);
      }
    };
    handleUpdate();
  }, [booking_id, payerID, payment_id, token]);

  const [error, setError] = useState(false);
  // useEffect(async () => {
  //   if (appointmentHash && paymentHash) {
  //     setError(false);
  //   } else {
  //     setError(true);
  //   }
  // }, [appointmentHash]);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
  };

  const renderCertificate = () => {
    if (error) return null;

    return (
      <Row justify="center" align="middle">
        <Col span={12}>
          <Card className="mt-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Xác thực Blockchain
            </h2>
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="sm:w-1/3">
                <div className="bg-gray-100 p-4 rounded-lg flex flex-col items-center">
                  <div className="h-40 w-40 bg-white p-2 rounded flex items-center justify-center mb-2">
                    <QrcodeOutlined
                      style={{ fontSize: '6em', color: '#d9d9d9' }}
                    />
                  </div>
                  <p className="text-xs text-center text-gray-600">
                    Quét để xác thực chứng nhận
                  </p>
                  <p className="text-xs text-center text-gray-500 mt-1">
                    vaxchain.io/verify/abc123
                  </p>
                </div>
              </div>

              <div className="sm:w-2/3">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">
                      Giao dịch Blockchain
                    </p>
                    <div className="flex items-center mt-1">
                      <p className="font-mono text-sm text-blue-600 truncate">
                        {paymentHash}
                      </p>
                      <Button
                        type="text"
                        icon={<CopyOutlined />}
                        onClick={() => handleCopy(paymentHash)}
                      />
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      Xác thực Blockchain cho lịch hẹn
                    </p>
                    <div className="flex items-center mt-1">
                      <p className="font-mono text-sm text-blue-600 truncate">
                        {appointmentHash}
                      </p>
                      <Button
                        type="text"
                        icon={<CopyOutlined />}
                        onClick={() => handleCopy(appointmentHash)}
                      />
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Thời gian</p>
                    <p className="font-medium">
                      {dayjs().locale('vi').format('HH:mm DD/MM/YYYY')}
                    </p>
                  </div>

                  <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                    <div className="flex">
                      <SafetyCertificateOutlined className="text-blue-400" />
                      <div className="ml-3">
                        <p className="text-sm text-blue-700">
                          Chứng nhận này được ký số và lưu trữ bất biến trên
                          blockchain Ethereum.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex flex-wrap justify-center gap-4">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-2">
                    <LockOutlined className="text-green-600" />
                  </div>
                  <span className="text-xs font-medium">
                    Xác thực Blockchain{' '}
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                    <SafetyCertificateOutlined className="text-blue-600" />
                  </div>
                  <span className="text-xs font-medium">Chữ ký số</span>
                </div>
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center mr-2">
                    <LinkOutlined className="text-purple-600" />
                  </div>
                  <span className="text-xs font-medium">Dữ liệu bất biến</span>
                </div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    );
  };

  return (
    <PageContainer>
      <Result
        status={error ? 'error' : 'success'}
        title={error ? 'Đặt lịch thất bại' : 'Đặt lịch tiêm chủng thành công!'}
        subTitle={
          error
            ? 'Bạn đã hủy đặt lịch, vui lòng kiểm tra lại!'
            : 'Vui lòng đến đúng giờ theo lịch hẹn, xin cảm ơn!'
        }
        extra={[
          <Button type="primary" key="home">
            <Link style={{ color: 'white' }} to="/">
              Về trang chủ
            </Link>
          </Button>,
          error ? (
            <Button key="retry" danger>
              Thử lại
            </Button>
          ) : (
            ''
          ),
        ]}
      />

      {renderCertificate()}
    </PageContainer>
  );
};

export default SuccessPage;
