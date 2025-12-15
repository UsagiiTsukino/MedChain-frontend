import { Card, Form, Input, Row, Col, Alert, message } from 'antd';
import { useEffect } from 'react';
import {
  WalletOutlined,
  CopyOutlined,
  DollarOutlined,
  PayCircleOutlined,
  BankOutlined,
  CheckCircleOutlined,
  SafetyOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';

const PaymentMethod = ({ selectedPayment, setSelectedPayment, form }) => {
  useEffect(() => {
    if (selectedPayment) {
      form.setFieldsValue({ payment: selectedPayment });
    }
  }, [selectedPayment, form]);

  const paymentMethods = [
    {
      icon: <WalletOutlined className="text-white text-3xl" />,
      title: 'MetaMask',
      description: 'Thanh toán bằng ETH qua ví MetaMask',
      value: 'METAMASK',
      gradient: 'from-orange-500 to-amber-600',
      badge: 'Blockchain',
    },
    {
      icon: <PayCircleOutlined className="text-white text-3xl" />,
      title: 'PayPal',
      description: 'Thanh toán qua tài khoản PayPal',
      value: 'PAYPAL',
      gradient: 'from-blue-500 to-blue-600',
      badge: 'Phổ biến',
    },
    {
      icon: <BankOutlined className="text-white text-3xl" />,
      title: 'Chuyển khoản',
      description: 'Chuyển khoản ngân hàng',
      value: 'BANK_TRANSFER',
      gradient: 'from-teal-500 to-emerald-600',
      badge: 'Miễn phí',
    },
    {
      icon: <DollarOutlined className="text-white text-3xl" />,
      title: 'Tiền mặt',
      description: 'Thanh toán tại cơ sở y tế',
      value: 'CASH',
      gradient: 'from-green-500 to-green-600',
      badge: 'Tiện lợi',
    },
  ];

  const handlePaymentSelect = (value) => {
    setSelectedPayment(value);
    form.setFieldsValue({ payment: value });
  };

  return (
    <div>
      <Form.Item
        name="payment"
        rules={[
          { required: true, message: 'Vui lòng chọn phương thức thanh toán' },
        ]}
      >
        <input type="hidden" />
      </Form.Item>

      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl mb-3">
          <SafetyOutlined className="text-3xl text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Chọn phương thức thanh toán
        </h3>
        <p className="text-gray-600">
          Tất cả giao dịch được mã hóa và bảo mật bởi MedChainAI
        </p>
      </div>

      <Row gutter={[24, 24]} className="mb-8">
        {paymentMethods.map((method) => (
          <Col xs={24} sm={12} key={method.value}>
            <div
              className={`relative cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                selectedPayment === method.value ? 'scale-105' : ''
              }`}
              onClick={() => handlePaymentSelect(method.value)}
            >
              <Card
                className={`rounded-2xl border-2 h-full overflow-hidden ${
                  selectedPayment === method.value
                    ? 'border-blue-500 shadow-2xl'
                    : 'border-gray-200 hover:border-blue-300 shadow-lg'
                }`}
                bodyStyle={{ padding: 0 }}
              >
                <div
                  className={`bg-gradient-to-br ${method.gradient} p-6 text-white relative`}
                >
                  <div className="absolute top-4 right-4">
                    <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full">
                      {method.badge}
                    </span>
                  </div>
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4">
                    {method.icon}
                  </div>
                  <h4 className="text-2xl font-bold mb-1">{method.title}</h4>
                  <p className="text-white/80 text-sm">{method.description}</p>
                </div>
                <div className="p-6">
                  {selectedPayment === method.value && (
                    <div className="flex items-center justify-center gap-2 text-blue-600 font-semibold">
                      <CheckCircleOutlined className="text-xl" />
                      <span>Đã chọn</span>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </Col>
        ))}
      </Row>

      {selectedPayment === 'METAMASK' && (
        <Card className="rounded-2xl border-0 shadow-lg bg-gradient-to-br from-orange-50 to-amber-50">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <ThunderboltOutlined className="text-2xl text-white" />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-1">
                Thanh toán với MetaMask
              </h4>
              <p className="text-gray-600 text-sm">
                Giao dịch được xác thực trên blockchain Ethereum
              </p>
            </div>
          </div>
          <Alert
            message="Lưu ý quan trọng"
            description="Vui lòng đảm bảo ví MetaMask của bạn có đủ ETH để thanh toán."
            type="info"
            showIcon
          />
        </Card>
      )}

      {selectedPayment === 'CASH' && (
        <Card className="rounded-2xl border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
          <Alert
            message="Thanh toán tại quầy"
            description="Bạn sẽ thanh toán bằng tiền mặt khi đến tiêm chủng."
            type="success"
            showIcon
          />
          <Form.Item label="Ghi chú (nếu có)" name="cashNote" className="mt-4">
            <Input.TextArea placeholder="Ví dụ: Cần hóa đơn đỏ..." rows={3} />
          </Form.Item>
        </Card>
      )}
    </div>
  );
};

export default PaymentMethod;
