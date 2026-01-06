import React, { useState, useEffect } from 'react';
import {
  Card,
  Input,
  Button,
  Alert,
  Spin,
  Result,
  Descriptions,
  Tag,
  Space,
  Typography,
} from 'antd';
import {
  SafetyCertificateOutlined,
  SearchOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import { verifyCertificate } from '../../config/api.blockchain';
import { useLocation } from 'react-router-dom';
import dayjs from 'dayjs';
import { parseTokenId, formatWithYear } from '../../utils/certificateFormatter';

const { Title, Text, Paragraph } = Typography;

const VerifyCertificate = () => {
  const [tokenId, setTokenId] = useState('');
  const [loading, setLoading] = useState(false);
  const [certificate, setCertificate] = useState(null);
  const [metadata, setMetadata] = useState(null);
  const [error, setError] = useState(null);
  const location = useLocation();

  // Check if tokenId is in URL query params on mount
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const urlTokenId = params.get('tokenId');
    if (urlTokenId) {
      setTokenId(urlTokenId);
      // Auto-verify after a short delay
      setTimeout(() => {
        handleVerifyById(urlTokenId);
      }, 500);
    }
  }, [location.search]);

  // Helper to convert IPFS URL to HTTP
  const getIpfsHttpUrl = (ipfsUrl) => {
    if (!ipfsUrl || !ipfsUrl.startsWith('ipfs://')) {
      return ipfsUrl;
    }
    const hash = ipfsUrl.replace('ipfs://', '');
    return `https://gateway.pinata.cloud/ipfs/${hash}`;
  };

  // Fetch IPFS metadata
  const fetchIpfsMetadata = async (tokenURI) => {
    try {
      const httpUrl = getIpfsHttpUrl(tokenURI);
      const response = await fetch(httpUrl);
      const data = await response.json();
      setMetadata(data);
    } catch (err) {
      console.error('Failed to fetch IPFS metadata:', err);
    }
  };

  const handleVerifyById = async (id) => {
    // Parse formatted certificate ID if provided (e.g., VXC-000001, VXC-2026-000001)
    let numericId = id;

    // Try to parse if it's a formatted ID
    if (typeof id === 'string' && id.startsWith('VXC-')) {
      numericId = parseTokenId(id);
      if (!numericId) {
        setError('Certificate ID không hợp lệ. Vui lòng kiểm tra lại.');
        return;
      }
    } else {
      numericId = parseInt(id, 10);
    }

    if (isNaN(numericId) || numericId <= 0) {
      setError('Vui lòng nhập Token ID hoặc Certificate ID hợp lệ');
      return;
    }

    setLoading(true);
    setError(null);
    setCertificate(null);

    try {
      const response = await verifyCertificate(numericId);

      if (response && response.data) {
        setCertificate(response.data);

        // Fetch IPFS metadata if tokenURI exists
        if (response.data.tokenURI) {
          await fetchIpfsMetadata(response.data.tokenURI);
        }
      } else {
        setError('Không tìm thấy chứng chỉ với ID này');
      }
    } catch (err) {
      console.error('Verification error:', err);
      setError(
        err.response?.data?.message ||
          'Không thể xác thực chứng chỉ. Vui lòng thử lại.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    handleVerifyById(tokenId);
  };

  const handleReset = () => {
    setTokenId('');
    setCertificate(null);
    setMetadata(null);
    setError(null);
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4"
      style={{ paddingTop: '80px' }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <SafetyCertificateOutlined className="text-6xl text-blue-600 mb-4" />
          <Title level={2} className="text-gray-800 mb-2">
            Xác Minh Chứng Chỉ Blockchain
          </Title>
          <Paragraph className="text-gray-600">
            Nhập Certificate ID hoặc Token ID để xác minh tính xác thực của
            chứng chỉ tiêm chủng trên blockchain
          </Paragraph>
          <Paragraph className="text-gray-500 text-sm">
            Hỗ trợ định dạng: <span className="font-mono">VXC-2026-000001</span>
            , <span className="font-mono">VXC-000001</span>, hoặc số{' '}
            <span className="font-mono">1</span>
          </Paragraph>
        </div>

        {/* Search Card */}
        <Card className="shadow-lg mb-6">
          <Space.Compact style={{ width: '100%' }} size="large">
            <Input
              placeholder="Nhập Certificate ID (VXC-2026-000001) hoặc Token ID (1)"
              value={tokenId}
              onChange={(e) => setTokenId(e.target.value)}
              onPressEnter={handleVerify}
              prefix={<SafetyCertificateOutlined />}
              size="large"
              disabled={loading}
            />
            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={handleVerify}
              loading={loading}
              size="large"
            >
              Xác Minh
            </Button>
            {certificate && (
              <Button onClick={handleReset} size="large">
                Làm Mới
              </Button>
            )}
          </Space.Compact>

          {error && (
            <Alert
              message="Lỗi"
              description={error}
              type="error"
              showIcon
              closable
              onClose={() => setError(null)}
              className="mt-4"
            />
          )}
        </Card>

        {/* Loading State */}
        {loading && (
          <Card className="shadow-lg text-center">
            <Spin size="large" />
            <Paragraph className="mt-4 text-gray-600">
              Đang xác minh chứng chỉ trên blockchain...
            </Paragraph>
          </Card>
        )}

        {/* Certificate Result */}
        {!loading && certificate && (
          <Card className="shadow-lg">
            <Result
              status={certificate.isValid ? 'success' : 'error'}
              icon={
                certificate.isValid ? (
                  <CheckCircleOutlined style={{ color: '#52c41a' }} />
                ) : (
                  <CloseCircleOutlined style={{ color: '#ff4d4f' }} />
                )
              }
              title={
                certificate.isValid
                  ? 'Chứng Chỉ Hợp Lệ ✓'
                  : 'Chứng Chỉ Không Hợp Lệ ✗'
              }
              subTitle={
                certificate.isValid
                  ? 'Chứng chỉ này đã được xác thực trên blockchain và đảm bảo tính chính xác.'
                  : 'Không tìm thấy chứng chỉ hoặc chứng chỉ đã bị thu hồi.'
              }
            />

            {certificate.isValid && (
              <div className="mt-6">
                <Title level={4} className="mb-4">
                  Thông Tin Chứng Chỉ
                </Title>

                <Descriptions bordered column={1}>
                  <Descriptions.Item label="Certificate ID">
                    <div className="flex flex-col gap-2">
                      <Tag color="green" className="text-base font-mono w-fit">
                        {certificate.certificateId ||
                          formatWithYear(certificate.tokenId)}
                      </Tag>
                      <Text className="text-xs text-gray-500">
                        Short:{' '}
                        <span className="font-mono">
                          {certificate.certificateIdShort ||
                            `VXC-${certificate.tokenId
                              .toString()
                              .padStart(6, '0')}`}
                        </span>
                      </Text>
                    </div>
                  </Descriptions.Item>

                  <Descriptions.Item label="Token ID (Raw)">
                    <Tag color="blue" className="text-base font-mono">
                      #{certificate.tokenId}
                    </Tag>
                  </Descriptions.Item>

                  <Descriptions.Item label="Địa Chỉ Bệnh Nhân">
                    <Text code copyable>
                      {certificate.patient}
                    </Text>
                  </Descriptions.Item>

                  <Descriptions.Item label="Tên Vaccine">
                    <Tag color="green">{certificate.vaccineName}</Tag>
                  </Descriptions.Item>

                  <Descriptions.Item label="Trung Tâm Tiêm Chủng">
                    {certificate.centerName}
                  </Descriptions.Item>

                  <Descriptions.Item label="Ngày Tiêm Chủng">
                    {dayjs(certificate.vaccinationDate).format('DD/MM/YYYY')}
                  </Descriptions.Item>

                  <Descriptions.Item label="Ngày Phát Hành NFT">
                    {dayjs(parseInt(certificate.issuedAt) * 1000).format(
                      'DD/MM/YYYY HH:mm:ss'
                    )}
                  </Descriptions.Item>

                  {certificate.tokenURI && (
                    <Descriptions.Item label="IPFS Metadata">
                      <a
                        href={getIpfsHttpUrl(certificate.tokenURI)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Xem Metadata →
                      </a>
                    </Descriptions.Item>
                  )}
                </Descriptions>

                {/* IPFS Metadata Display */}
                {metadata && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
                    <Title level={5} className="mb-3">
                      Metadata IPFS
                    </Title>
                    {metadata.image && (
                      <div className="mb-4">
                        <img
                          src={getIpfsHttpUrl(metadata.image)}
                          alt={metadata.name}
                          className="max-w-xs rounded-lg shadow"
                        />
                      </div>
                    )}
                    <div className="space-y-2">
                      <p>
                        <strong>Tên:</strong> {metadata.name}
                      </p>
                      <p>
                        <strong>Mô tả:</strong> {metadata.description}
                      </p>
                      {metadata.attributes && (
                        <div>
                          <strong>Thuộc tính:</strong>
                          <div className="grid grid-cols-2 gap-2 mt-2">
                            {metadata.attributes.map((attr, idx) => (
                              <div
                                key={idx}
                                className="bg-white p-2 rounded border"
                              >
                                <p className="text-xs text-gray-500">
                                  {attr.trait_type}
                                </p>
                                <p className="font-medium">{attr.value}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <Alert
                  message="Xác Minh Blockchain"
                  description="Chứng chỉ này đã được xác minh trên blockchain Ethereum và không thể bị giả mạo. Mọi thông tin đều được lưu trữ bất biến trên mạng phi tập trung."
                  type="success"
                  showIcon
                  className="mt-6"
                />
              </div>
            )}
          </Card>
        )}
      </div>
    </div>
  );
};

export default VerifyCertificate;
