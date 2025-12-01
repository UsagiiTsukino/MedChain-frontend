import { Button, Modal, Spin, Result } from 'antd';
import {
  LoadingOutlined,
  CheckCircleFilled,
  WalletOutlined,
  CloseCircleFilled,
  WarningFilled,
} from '@ant-design/icons';

const ModalPayment = ({ visible, status, onClose, ethAmount }) => {
  const getModalContent = () => {
    switch (status) {
      case 'preparing':
        return (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-blue-50 mb-6">
              <Spin
                indicator={
                  <LoadingOutlined
                    className="text-blue-600"
                    style={{ fontSize: 36 }}
                    spin
                  />
                }
              />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Đang chuẩn bị giao dịch
            </h3>
            <p className="text-gray-500">Vui lòng đợi trong giây lát...</p>
          </div>
        );
      case 'processing':
        return (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 mb-6">
              <WalletOutlined
                className="text-purple-600"
                style={{ fontSize: 40 }}
              />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Xác nhận giao dịch
            </h3>
            <p className="text-gray-500 mb-4">
              Vui lòng xác nhận giao dịch trong ví MetaMask của bạn
            </p>
            {ethAmount && (
              <div className="inline-flex items-center gap-2 bg-blue-50 px-6 py-3 rounded-xl mb-4">
                <span className="text-sm text-gray-600">Số tiền:</span>
                <span className="text-lg font-bold text-blue-600">
                  {ethAmount} ETH
                </span>
              </div>
            )}
            <div className="flex justify-center mt-6">
              <Spin />
            </div>
          </div>
        );
      case 'success-payment':
        return (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6">
              <CheckCircleFilled
                className="text-green-600"
                style={{ fontSize: 48 }}
              />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Thanh toán thành công!
            </h3>
            {ethAmount && (
              <div className="inline-flex items-center gap-2 bg-green-50 px-6 py-3 rounded-xl mb-4">
                <span className="text-sm text-gray-600">Đã thanh toán:</span>
                <span className="text-lg font-bold text-green-600">
                  {ethAmount} ETH
                </span>
              </div>
            )}
            <p className="text-gray-500 mb-4">Đang xử lý đặt lịch...</p>
            <Spin />
          </div>
        );
      case 'processing-booking':
        return (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-blue-50 mb-6">
              <Spin
                indicator={
                  <LoadingOutlined
                    className="text-blue-600"
                    style={{ fontSize: 36 }}
                    spin
                  />
                }
              />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Đang xử lý đặt lịch
            </h3>
            <p className="text-gray-500">
              Chúng tôi đang xác nhận lịch tiêm chủng của bạn...
            </p>
          </div>
        );
      case 'success':
        return (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6">
              <CheckCircleFilled
                className="text-green-600"
                style={{ fontSize: 48 }}
              />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Đặt lịch thành công!
            </h3>
            <p className="text-gray-500">
              Bạn sẽ được chuyển hướng đến trang xác nhận...
            </p>
            <div className="flex justify-center mt-6">
              <Spin />
            </div>
          </div>
        );
      case 'failed':
        return (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-red-100 mb-6">
              <CloseCircleFilled
                className="text-red-600"
                style={{ fontSize: 48 }}
              />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Thanh toán thất bại
            </h3>
            <p className="text-gray-500 mb-6">
              Giao dịch đã bị hủy hoặc gặp lỗi. Vui lòng thử lại sau.
            </p>
            <Button
              type="primary"
              size="large"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 border-0 h-11 px-8 font-semibold shadow-md hover:shadow-lg"
              onClick={onClose}
            >
              Đóng
            </Button>
          </div>
        );
      case 'booking-failed':
        return (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-yellow-100 mb-6">
              <WarningFilled
                className="text-yellow-600"
                style={{ fontSize: 48 }}
              />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Thanh toán thành công, nhưng đặt lịch thất bại
            </h3>
            <p className="text-gray-500 mb-6">
              Vui lòng liên hệ với chúng tôi để được hỗ trợ.
            </p>
            <Button
              type="primary"
              size="large"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 border-0 h-11 px-8 font-semibold shadow-md hover:shadow-lg"
              onClick={onClose}
            >
              Đóng
            </Button>
          </div>
        );
      case 'error':
        return (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-red-100 mb-6">
              <CloseCircleFilled
                className="text-red-600"
                style={{ fontSize: 48 }}
              />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Có lỗi xảy ra
            </h3>
            <p className="text-gray-500 mb-6">
              Hệ thống gặp sự cố. Vui lòng thử lại sau.
            </p>
            <Button
              type="primary"
              size="large"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 border-0 h-11 px-8 font-semibold shadow-md hover:shadow-lg"
              onClick={onClose}
            >
              Đóng
            </Button>
          </div>
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
      width={480}
      centered
      styles={{
        body: { padding: '32px' },
      }}
    >
      {getModalContent()}
    </Modal>
  );
};

export default ModalPayment;
