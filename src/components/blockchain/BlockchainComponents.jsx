import { useState } from 'react';
import {
  Button,
  Card,
  Tag,
  Spin,
  message,
  Modal,
  Typography,
  Descriptions,
  Space,
} from 'antd';
import {
  WalletOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  LinkOutlined,
  LoadingOutlined,
  SafetyCertificateOutlined,
  BlockOutlined,
} from '@ant-design/icons';
import {
  useAccount,
  useBalance,
  useSendTransaction,
  useWaitForTransactionReceipt,
} from 'wagmi';
import { parseEther, formatEther } from 'viem';

const { Text, Paragraph } = Typography;

// Treasury wallet address (should match backend config)
const TREASURY_WALLET = '0x672DF7fDcf5dA93C30490C7d49bd6b5bF7B4D32C';

/**
 * MetaMask Payment Component
 * Handles ETH payment from user's wallet
 */
export const MetaMaskPayment = ({
  amount, // Amount in ETH
  bookingId,
  onSuccess,
  onError,
}) => {
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({ address });
  const [isPaying, setIsPaying] = useState(false);

  const {
    data: txHash,
    sendTransaction,
    isPending: isSending,
    error: sendError,
  } = useSendTransaction();

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    error: confirmError,
  } = useWaitForTransactionReceipt({ hash: txHash });

  const handlePayment = async () => {
    if (!isConnected) {
      message.error('Vui lòng kết nối ví MetaMask');
      return;
    }

    if (!balance || parseFloat(formatEther(balance.value)) < amount) {
      message.error('Số dư không đủ để thanh toán');
      return;
    }

    setIsPaying(true);
    try {
      await sendTransaction({
        to: TREASURY_WALLET,
        value: parseEther(amount.toString()),
      });
    } catch (error) {
      console.error('Payment error:', error);
      message.error('Thanh toán thất bại');
      onError?.(error);
      setIsPaying(false);
    }
  };

  // Handle transaction confirmation
  if (isConfirmed && txHash) {
    message.success('Thanh toán thành công!');
    onSuccess?.({ txHash, bookingId });
  }

  if (sendError || confirmError) {
    const error = sendError || confirmError;
    message.error(`Lỗi: ${error.message}`);
    onError?.(error);
  }

  return (
    <Card className="border-2 border-purple-200 rounded-xl">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
          <WalletOutlined className="text-white text-2xl" />
        </div>

        <h3 className="text-lg font-semibold mb-2">Thanh toán bằng MetaMask</h3>

        {isConnected ? (
          <>
            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <Text type="secondary" className="text-xs block">
                Địa chỉ ví của bạn
              </Text>
              <Text className="font-mono text-sm">
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </Text>
              <div className="mt-2">
                <Text type="secondary" className="text-xs block">
                  Số dư
                </Text>
                <Text strong>
                  {balance
                    ? parseFloat(formatEther(balance.value)).toFixed(4)
                    : '0'}{' '}
                  ETH
                </Text>
              </div>
            </div>

            <div className="bg-purple-50 rounded-lg p-3 mb-4">
              <Text type="secondary" className="text-xs block">
                Số tiền cần thanh toán
              </Text>
              <Text strong className="text-xl text-purple-600">
                {amount} ETH
              </Text>
            </div>

            <Button
              type="primary"
              size="large"
              block
              icon={
                isSending || isConfirming ? (
                  <LoadingOutlined />
                ) : (
                  <WalletOutlined />
                )
              }
              onClick={handlePayment}
              disabled={isSending || isConfirming || !isConnected}
              className="bg-gradient-to-r from-orange-500 to-orange-600 border-0 h-12 rounded-xl font-semibold"
            >
              {isSending
                ? 'Đang gửi giao dịch...'
                : isConfirming
                ? 'Đang xác nhận...'
                : 'Thanh toán với MetaMask'}
            </Button>

            {txHash && (
              <div className="mt-4 p-3 bg-green-50 rounded-lg">
                <CheckCircleOutlined className="text-green-500 mr-2" />
                <Text className="text-sm">
                  Giao dịch: {txHash.slice(0, 10)}...{txHash.slice(-8)}
                </Text>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-4">
            <Text type="secondary">
              Vui lòng kết nối ví MetaMask để thanh toán
            </Text>
          </div>
        )}
      </div>
    </Card>
  );
};

/**
 * Blockchain Info Display Component
 * Shows blockchain transaction details and verification status
 */
export const BlockchainInfo = ({ txHash, appointmentId, status, onVerify }) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);

  const getStatusTag = () => {
    switch (status) {
      case 'CONFIRMED':
        return (
          <Tag color="green" icon={<CheckCircleOutlined />}>
            Đã xác nhận trên Blockchain
          </Tag>
        );
      case 'PENDING':
        return (
          <Tag color="orange" icon={<LoadingOutlined />}>
            Đang xử lý
          </Tag>
        );
      case 'FAILED':
        return (
          <Tag color="red" icon={<CloseCircleOutlined />}>
            Ghi blockchain thất bại
          </Tag>
        );
      case 'SKIPPED':
        return <Tag color="gray">Blockchain không khả dụng</Tag>;
      default:
        return <Tag color="default">Chưa có thông tin</Tag>;
    }
  };

  const handleVerify = async () => {
    setIsVerifying(true);
    try {
      const result = await onVerify?.();
      setVerificationResult(result);
    } catch (error) {
      message.error('Xác thực thất bại');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <Card
      className="border-2 border-blue-100 rounded-xl"
      title={
        <div className="flex items-center gap-2">
          <BlockOutlined className="text-blue-500" />
          <span>Thông tin Blockchain</span>
        </div>
      }
    >
      <Descriptions column={1} size="small">
        <Descriptions.Item label="Trạng thái">
          {getStatusTag()}
        </Descriptions.Item>

        {txHash && (
          <Descriptions.Item label="Transaction Hash">
            <div className="flex items-center gap-2">
              <Text copyable className="font-mono text-xs">
                {txHash.slice(0, 20)}...{txHash.slice(-10)}
              </Text>
              <a
                href={`https://etherscan.io/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500"
              >
                <LinkOutlined />
              </a>
            </div>
          </Descriptions.Item>
        )}

        {appointmentId && (
          <Descriptions.Item label="On-chain ID">
            <Text className="font-mono">#{appointmentId}</Text>
          </Descriptions.Item>
        )}
      </Descriptions>

      {txHash && (
        <div className="mt-4">
          <Button
            type="dashed"
            block
            icon={
              isVerifying ? <LoadingOutlined /> : <SafetyCertificateOutlined />
            }
            onClick={handleVerify}
            disabled={isVerifying}
          >
            Xác thực trên Blockchain
          </Button>
        </div>
      )}

      {verificationResult && (
        <Modal
          title="Kết quả xác thực Blockchain"
          open={!!verificationResult}
          onCancel={() => setVerificationResult(null)}
          footer={null}
        >
          {verificationResult.verified ? (
            <div className="text-center">
              <CheckCircleOutlined className="text-green-500 text-5xl mb-4" />
              <h3 className="text-lg font-semibold text-green-600 mb-4">
                Đã xác thực thành công!
              </h3>
              <Descriptions column={1} bordered size="small">
                <Descriptions.Item label="Vaccine">
                  {verificationResult.onChainData?.vaccineName}
                </Descriptions.Item>
                <Descriptions.Item label="Trung tâm">
                  {verificationResult.onChainData?.centerName}
                </Descriptions.Item>
                <Descriptions.Item label="Ngày">
                  {verificationResult.onChainData?.date}
                </Descriptions.Item>
                <Descriptions.Item label="Trạng thái">
                  <Tag color="blue">
                    {verificationResult.onChainData?.status}
                  </Tag>
                </Descriptions.Item>
              </Descriptions>
            </div>
          ) : (
            <div className="text-center">
              <CloseCircleOutlined className="text-red-500 text-5xl mb-4" />
              <h3 className="text-lg font-semibold text-red-600">
                Xác thực thất bại
              </h3>
              <p className="text-gray-500">{verificationResult.reason}</p>
            </div>
          )}
        </Modal>
      )}
    </Card>
  );
};

/**
 * NFT Certificate Display Component
 */
export const NFTCertificateCard = ({ certificate }) => {
  if (!certificate) return null;

  return (
    <Card
      className="border-2 border-green-200 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50"
      title={
        <div className="flex items-center gap-2">
          <SafetyCertificateOutlined className="text-green-500" />
          <span>Chứng nhận NFT</span>
        </div>
      }
    >
      <div className="text-center">
        <div className="w-24 h-24 mx-auto mb-4 rounded-xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-lg">
          <SafetyCertificateOutlined className="text-white text-4xl" />
        </div>

        <h3 className="font-semibold text-lg mb-2">VaxChain Certificate</h3>
        <Text type="secondary">Token ID: #{certificate.tokenId}</Text>

        <div className="mt-4 space-y-2">
          <div className="bg-white rounded-lg p-3">
            <Text type="secondary" className="text-xs block">
              Vaccine
            </Text>
            <Text strong>{certificate.vaccineName}</Text>
          </div>
          <div className="bg-white rounded-lg p-3">
            <Text type="secondary" className="text-xs block">
              Ngày tiêm
            </Text>
            <Text strong>{certificate.vaccinationDate}</Text>
          </div>
          <div className="bg-white rounded-lg p-3">
            <Text type="secondary" className="text-xs block">
              Trung tâm
            </Text>
            <Text strong>{certificate.centerName}</Text>
          </div>
        </div>

        <Tag
          color={certificate.isValid ? 'green' : 'red'}
          className="mt-4"
          icon={
            certificate.isValid ? (
              <CheckCircleOutlined />
            ) : (
              <CloseCircleOutlined />
            )
          }
        >
          {certificate.isValid ? 'Chứng nhận hợp lệ' : 'Đã thu hồi'}
        </Tag>
      </div>
    </Card>
  );
};

/**
 * Blockchain Verify Badge Component
 * Shows blockchain verification status as a badge/tag
 */
export const BlockchainVerifyBadge = ({
  bookingId,
  transactionHash,
  blockchainStatus,
}) => {
  if (!transactionHash && blockchainStatus !== 'CONFIRMED') {
    return <Tag color="default">Chưa ghi blockchain</Tag>;
  }

  const getStatusDisplay = () => {
    switch (blockchainStatus) {
      case 'CONFIRMED':
        return (
          <Tag
            color="purple"
            icon={<SafetyCertificateOutlined />}
            className="cursor-pointer"
            onClick={() => window.open(`/verify/${bookingId}`, '_blank')}
          >
            Đã xác thực
          </Tag>
        );
      case 'PENDING':
        return (
          <Tag color="orange" icon={<LoadingOutlined />}>
            Đang xử lý
          </Tag>
        );
      case 'FAILED':
        return (
          <Tag color="red" icon={<CloseCircleOutlined />}>
            Thất bại
          </Tag>
        );
      default:
        if (transactionHash) {
          return (
            <Tag
              color="blue"
              icon={<LinkOutlined />}
              className="cursor-pointer"
              onClick={() => window.open(`/verify/${bookingId}`, '_blank')}
            >
              Có TX
            </Tag>
          );
        }
        return <Tag color="default">N/A</Tag>;
    }
  };

  return getStatusDisplay();
};

export default {
  MetaMaskPayment,
  BlockchainInfo,
  NFTCertificateCard,
  BlockchainVerifyBadge,
};
