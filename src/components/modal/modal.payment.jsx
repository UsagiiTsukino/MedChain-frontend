import { Button, Modal, Spin, Result } from 'antd';
import {
  LoadingOutlined,
  CheckCircleFilled,
  WalletOutlined,
} from '@ant-design/icons';

const ModalPayment = ({ visible, status, onClose, ethAmount }) => {
  const getModalContent = () => {
    switch (status) {
      case 'preparing':
        return (
          <div className="text-center py-6">
            <Spin
              indicator={<LoadingOutlined style={{ fontSize: 36 }} spin />}
            />
            <h3 className="mt-4 text-lg font-medium">
              Đang chuẩn bị giao dịch
            </h3>
            <p className="mt-2 text-gray-500">Vui lòng đợi trong giây lát...</p>
          </div>
        );
      case 'processing':
        return (
          <div className="text-center py-6">
            <WalletOutlined style={{ fontSize: 48, color: '#1890ff' }} />
            <h3 className="mt-4 text-lg font-medium">Xác nhận giao dịch</h3>
            <p className="mt-2 text-gray-500">
              Vui lòng xác nhận giao dịch trong ví MetaMask của bạn.
            </p>
            {ethAmount && (
              <p className="mt-2 text-blue-600 font-semibold">
                Số tiền: {ethAmount} ETH
              </p>
            )}
            <Spin className="mt-4" />
          </div>
        );
      case 'success-payment':
        return (
          <div className="text-center py-6">
            <CheckCircleFilled style={{ fontSize: 48, color: '#52c41a' }} />
            <h3 className="mt-4 text-lg font-medium">Thanh toán thành công!</h3>
            {ethAmount && (
              <p className="mt-2 text-blue-600">
                Đã thanh toán: {ethAmount} ETH
              </p>
            )}
            <p className="mt-2 text-gray-500">Đang xử lý đặt lịch...</p>
            <Spin className="mt-4" />
          </div>
        );
      case 'processing-booking':
        return (
          <div className="text-center py-6">
            <Spin
              indicator={<LoadingOutlined style={{ fontSize: 36 }} spin />}
            />
            <h3 className="mt-4 text-lg font-medium">Đang xử lý đặt lịch</h3>
            <p className="mt-2 text-gray-500">
              Chúng tôi đang xác nhận lịch tiêm chủng của bạn...
            </p>
          </div>
        );
      case 'success':
        return (
          <Result
            status="success"
            title="Đặt lịch thành công!"
            subTitle="Bạn sẽ được chuyển hướng đến trang xác nhận..."
          />
        );
      case 'failed':
        return (
          <Result
            status="error"
            title="Thanh toán thất bại"
            subTitle="Giao dịch đã bị hủy hoặc gặp lỗi. Vui lòng thử lại sau."
            extra={[
              <Button type="primary" key="console" onClick={onClose}>
                Đóng
              </Button>,
            ]}
          />
        );
      case 'booking-failed':
        return (
          <Result
            status="warning"
            title="Thanh toán thành công, nhưng đặt lịch thất bại"
            subTitle="Vui lòng liên hệ với chúng tôi để được hỗ trợ."
            extra={[
              <Button type="primary" key="console" onClick={onClose}>
                Đóng
              </Button>,
            ]}
          />
        );
      case 'error':
        return (
          <Result
            status="error"
            title="Có lỗi xảy ra"
            subTitle="Hệ thống gặp sự cố. Vui lòng thử lại sau."
            extra={[
              <Button type="primary" key="console" onClick={onClose}>
                Đóng
              </Button>,
            ]}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Modal
      open={visible}
      footer={null}
      closable={['failed', 'booking-failed', 'error'].includes(status)}
      maskClosable={false}
      onCancel={onClose}
      width={400}
    >
      {getModalContent()}
    </Modal>
  );
};

export default ModalPayment;
