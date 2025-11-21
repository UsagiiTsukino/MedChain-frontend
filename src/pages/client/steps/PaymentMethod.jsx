import { Card, Form, Input, Row, Col, Alert, message, Divider } from 'antd';
import { useEffect } from 'react';
import {
  WalletOutlined,
  CopyOutlined,
  DollarOutlined,
  CreditCardOutlined,
  PayCircleOutlined,
  BankOutlined,
} from '@ant-design/icons';

const PaymentMethod = ({ selectedPayment, setSelectedPayment, form }) => {
  // Sync form field with selectedPayment when component mounts or selectedPayment changes
  useEffect(() => {
    if (selectedPayment) {
      form.setFieldsValue({ payment: selectedPayment });
    }
  }, [selectedPayment, form]);

  const paymentMethods = [
    {
      icon: <WalletOutlined className="text-blue-600" />,
      title: 'MetaMask',
      description: 'Thanh toán bằng ETH qua ví MetaMask',
      value: 'METAMASK',
      category: 'crypto',
    },
    {
      icon: <PayCircleOutlined className="text-blue-400" />,
      title: 'PayPal',
      description: 'Thanh toán qua tài khoản PayPal',
      value: 'PAYPAL',
      category: 'digital',
    },
    {
      icon: <BankOutlined className="text-green-600" />,
      title: 'Chuyển khoản',
      description: 'Chuyển khoản ngân hàng',
      value: 'BANK_TRANSFER',
      category: 'bank',
    },
    {
      icon: <DollarOutlined className="text-green-600" />,
      title: 'Tiền mặt',
      description: 'Thanh toán khi nhận hàng (COD)',
      value: 'CASH',
      category: 'cash',
    },
  ];

  // Phân loại payment methods theo category
  const categorizedMethods = {
    crypto: paymentMethods.filter((method) => method.category === 'crypto'),
    digital: paymentMethods.filter((method) => method.category === 'digital'),
    bank: paymentMethods.filter((method) => method.category === 'bank'),
    cash: paymentMethods.filter((method) => method.category === 'cash'),
  };

  const handlePaymentSelect = (value) => {
    setSelectedPayment(value);
    // Update the form field value to sync with form validation
    form.setFieldsValue({ payment: value });
    console.log(value);
  };

  const renderPaymentSection = (title, methods) => (
    <div className="mb-6">
      <h4 className="text-md font-medium mb-3">{title}</h4>
      <Row gutter={16}>
        {methods.map((method) => (
          <Col xs={24} sm={12} lg={8} key={method.value} className="mb-3">
            <div
              className={`border rounded-lg p-4 h-full cursor-pointer transition-all ${
                selectedPayment === method.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
              onClick={() => handlePaymentSelect(method.value)}
            >
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center mr-4">
                  {method.icon}
                </div>
                <div>
                  <h5 className="font-medium">{method.title}</h5>
                  <p className="text-xs text-gray-500">{method.description}</p>
                </div>
              </div>
            </div>
          </Col>
        ))}
      </Row>
    </div>
  );

  return (
    <Card title="Chọn phương thức thanh toán" className="mb-8">
      {/* Hidden input to store selected payment value */}
      <Form.Item
        name="payment"
        rules={[
          {
            required: true,
            message: 'Vui lòng chọn phương thức thanh toán',
          },
        ]}
      >
        <input type="hidden" />
      </Form.Item>

      <div className="space-y-6">
        {categorizedMethods.crypto.length > 0 &&
          renderPaymentSection(
            'Thanh toán tiền điện tử',
            categorizedMethods.crypto
          )}

        {categorizedMethods.crypto.length > 0 &&
          categorizedMethods.digital.length > 0 && <Divider className="my-2" />}

        {categorizedMethods.digital.length > 0 &&
          renderPaymentSection('Ví điện tử', categorizedMethods.digital)}

        {categorizedMethods.digital.length > 0 &&
          categorizedMethods.bank.length > 0 && <Divider className="my-2" />}

        {categorizedMethods.bank.length > 0 &&
          renderPaymentSection('Ngân hàng', categorizedMethods.bank)}

        {categorizedMethods.bank.length > 0 &&
          categorizedMethods.cash.length > 0 && <Divider className="my-2" />}

        {categorizedMethods.cash.length > 0 &&
          renderPaymentSection('Khác', categorizedMethods.cash)}

        {/* Các phần hiển thị thông tin chi tiết cho từng phương thức */}
        {selectedPayment === 'METAMASK' && (
          <div className="mt-6 bg-gray-50 p-6 rounded-lg">
            <Alert
              message="Thanh toán tiền điện tử"
              description="Gửi chính xác số tiền đến địa chỉ ví dưới đây. Giao dịch sẽ được xác thực trên blockchain."
              type="info"
              showIcon
              className="mb-4"
            />
            <Form.Item label="Địa chỉ ví">
              <Input.Search
                value="0x672DF7fDcf5dA93C30490C7d49bd6b5bF7B4D32C"
                readOnly
                enterButton={<CopyOutlined />}
                onSearch={() => {
                  navigator.clipboard.writeText(
                    '0x672DF7fDcf5dA93C30490C7d49bd6b5bF7B4D32C'
                  );
                  message.success('Đã sao chép địa chỉ ví');
                }}
              />
            </Form.Item>
          </div>
        )}

        {selectedPayment === 'ATM' && (
          <div className="mt-6 bg-gray-50 p-6 rounded-lg">
            <Alert
              message="Thanh toán bằng thẻ ATM"
              description="Chọn ngân hàng và nhập thông tin thẻ ATM của bạn để thanh toán."
              type="info"
              showIcon
              className="mb-4"
            />
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Ngân hàng"
                  name="bankName"
                  rules={[
                    {
                      required: selectedPayment === 'ATM',
                      message: 'Vui lòng chọn ngân hàng',
                    },
                  ]}
                >
                  <Input placeholder="Chọn ngân hàng" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Số thẻ"
                  name="cardNumber"
                  rules={[
                    {
                      required: selectedPayment === 'ATM',
                      message: 'Vui lòng nhập số thẻ',
                    },
                  ]}
                >
                  <Input placeholder="Nhập số thẻ" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Tên chủ thẻ"
                  name="cardHolder"
                  rules={[
                    {
                      required: selectedPayment === 'ATM',
                      message: 'Vui lòng nhập tên chủ thẻ',
                    },
                  ]}
                >
                  <Input placeholder="Nhập tên chủ thẻ" />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  label="Ngày hết hạn"
                  name="expiryDate"
                  rules={[
                    {
                      required: selectedPayment === 'ATM',
                      message: 'Vui lòng nhập ngày hết hạn',
                    },
                    {
                      pattern: /^(0[1-9]|1[0-2])\/([0-9]{2})$/,
                      message: 'Định dạng phải là MM/YY',
                    },
                  ]}
                >
                  <Input placeholder="MM/YY" />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  label="CVV"
                  name="cvv"
                  rules={[
                    {
                      required: selectedPayment === 'ATM',
                      message: 'Vui lòng nhập CVV',
                    },
                    {
                      pattern: /^[0-9]{3,4}$/,
                      message: 'CVV phải có 3-4 chữ số',
                    },
                  ]}
                >
                  <Input placeholder="123" type="password" />
                </Form.Item>
              </Col>
            </Row>
          </div>
        )}

        {selectedPayment === 'BANK_TRANSFER' && (
          <div className="mt-6 bg-gray-50 p-6 rounded-lg">
            <Alert
              message="Chuyển khoản ngân hàng"
              description="Sử dụng thông tin sau để chuyển khoản. Giao dịch sẽ được xử lý trong vòng 24 giờ."
              type="info"
              showIcon
              className="mb-4"
            />
            <Form.Item label="Số tài khoản">
              <Input.Search
                value="1234567890"
                readOnly
                enterButton={<CopyOutlined />}
                onSearch={() => {
                  navigator.clipboard.writeText('1234567890');
                  message.success('Đã sao chép số tài khoản');
                }}
              />
            </Form.Item>
            <Form.Item label="Chủ tài khoản">
              <Input value="CÔNG TY TNHH THƯƠNG MẠI ABC" readOnly />
            </Form.Item>
            <Form.Item label="Ngân hàng">
              <Input value="Vietcombank - Chi nhánh Hà Nội" readOnly />
            </Form.Item>
            <Form.Item label="Nội dung chuyển khoản">
              <Input.Search
                value="Thanh toan don hang #12345"
                readOnly
                enterButton={<CopyOutlined />}
                onSearch={() => {
                  navigator.clipboard.writeText('Thanh toan don hang #12345');
                  message.success('Đã sao chép nội dung chuyển khoản');
                }}
              />
            </Form.Item>
          </div>
        )}

        {selectedPayment === 'CASH' && (
          <div className="mt-6 bg-gray-50 p-6 rounded-lg">
            <Alert
              message="Thanh toán tiền mặt"
              description="Bạn sẽ thanh toán bằng tiền mặt khi đến tiêm. Vui lòng chuẩn bị đúng số tiền."
              type="info"
              showIcon
              className="mb-4"
            />
            <Form.Item label="Ghi chú" name="cashNote">
              <Input.TextArea
                placeholder="Ghi chú thêm cho nhân viên (nếu có)"
                rows={3}
              />
            </Form.Item>
          </div>
        )}
      </div>
    </Card>
  );
};

export default PaymentMethod;
