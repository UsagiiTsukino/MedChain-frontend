import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { QRCodeSVG } from 'qrcode.react';
import { useSelector } from 'react-redux';
import { Button, Tag, Spin } from 'antd';
import {
  DownloadOutlined,
  PrinterOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons';
import { getCertificateByBooking } from '../../config/api.blockchain';
import {
  formatWithYear,
  formatCertificateId,
} from '../../utils/certificateFormatter';

const VaccineCertificate = ({ bookingData }) => {
  const user = useSelector((state) => state.account.user);
  const [nftData, setNftData] = useState(null);
  const [loadingNft, setLoadingNft] = useState(true);

  useEffect(() => {
    // Fetch NFT certificate data from blockchain
    const fetchNftData = async () => {
      try {
        setLoadingNft(true);
        const response = await getCertificateByBooking(bookingData.bookingId);
        console.log('[VaccineCertificate] API response:', response);
        // API returns { success, certificateId, certificateIdShort, data: { tokenId, ... } }
        if (response && response.data && response.data.data) {
          setNftData(response.data.data);
        } else if (response && response.data) {
          // Fallback for direct data structure
          setNftData(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch NFT data:', error);
      } finally {
        setLoadingNft(false);
      }
    };

    if (bookingData && bookingData.bookingId) {
      fetchNftData();
    }
  }, [bookingData]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Generate PDF or download certificate
    window.print();
  };

  // Generate verify URL with token ID
  const getVerifyUrl = () => {
    if (nftData && nftData.tokenId) {
      return `${window.location.origin}/verify-certificate?tokenId=${nftData.tokenId}`;
    }
    return `${window.location.origin}/verify-certificate`;
  };

  return (
    <div className="bg-gray-50 certificate-page-wrapper">
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Print/Download Buttons */}
          <div className="mb-4 flex justify-end gap-2 no-print">
            <Button icon={<PrinterOutlined />} onClick={handlePrint}>
              In chứng nhận
            </Button>
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              onClick={handleDownload}
            >
              Tải xuống
            </Button>
          </div>

          {/* Certificate Container */}
          <div className="bg-white shadow-xl rounded-lg overflow-hidden border-4 border-blue-500 certificate-content">
            {/* Certificate Header */}
            <div className="bg-gradient-to-r from-blue-600 to-green-500 p-4 text-white certificate-header">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold">
                    Chứng Nhận Tiêm Chủng Số
                  </h1>
                  <p className="mt-1">Được cấp qua Hệ Thống MedChainAI</p>
                  <p className="text-sm mt-1 opacity-90">
                    Certificate ID:{' '}
                    <span className="font-mono font-bold">
                      {nftData?.certificateId ||
                        (nftData?.tokenId
                          ? formatWithYear(nftData.tokenId)
                          : `#${bookingData.bookingId}`)}
                    </span>
                  </p>
                  {nftData?.tokenId && (
                    <p className="text-xs mt-1 opacity-80">
                      Token ID: #{nftData.tokenId}
                    </p>
                  )}
                </div>
                <div className="h-16 w-16 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
                  <i className="fas fa-shield-virus text-white text-2xl" />
                </div>
              </div>
            </div>

            {/* Certificate Body */}
            <div className="p-4 sm:p-6 certificate-body">
              {/* Recipient Info */}
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
                  Thông Tin Người Nhận
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Họ và Tên</p>
                    <p className="font-medium text-lg">
                      {bookingData.patient?.fullName || user?.fullName || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Ngày Sinh</p>
                    <p className="font-medium">
                      {bookingData.patient?.birthday
                        ? dayjs(bookingData.patient.birthday).format(
                            'DD/MM/YYYY'
                          )
                        : user?.birthday
                        ? dayjs(user.birthday).format('DD/MM/YYYY')
                        : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Địa chỉ</p>
                    <p className="font-medium">
                      {bookingData.patient?.address || user?.address || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Số điện thoại</p>
                    <p className="font-medium">
                      {bookingData.patient?.phone || user?.phone || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Vaccine Details */}
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">
                  Chi Tiết Tiêm Chủng
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Loại Vaccine</p>
                    <p className="font-medium text-lg text-blue-600">
                      {bookingData.vaccine?.name || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Ngày Tiêm Mũi Đầu</p>
                    <p className="font-medium">
                      {dayjs(bookingData.firstDoseDate).format('DD/MM/YYYY')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Giờ Tiêm</p>
                    <p className="font-medium">{bookingData.firstDoseTime}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                  <div>
                    <p className="text-sm text-gray-500">Số Liều</p>
                    <p className="font-medium">{bookingData.totalDoses} liều</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Trạng Thái</p>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      <i className="fas fa-check-circle mr-2" /> Hoàn Thành
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Cơ Sở Tiêm</p>
                    <p className="font-medium">
                      {bookingData.center?.name || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Verification Section */}
              <div className="border-t border-gray-200 pt-4">
                <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <SafetyCertificateOutlined className="text-blue-600" />
                  Xác Thực Blockchain
                </h2>
                <div className="flex flex-col sm:flex-row gap-6">
                  {/* QR Code */}
                  <div className="sm:w-1/3">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg flex flex-col items-center border-2 border-blue-200">
                      <div className="h-36 w-36 bg-white p-2 rounded-lg shadow-md flex items-center justify-center mb-3">
                        {loadingNft ? (
                          <Spin />
                        ) : (
                          <QRCodeSVG
                            value={getVerifyUrl()}
                            size={128}
                            level="H"
                            includeMargin={false}
                          />
                        )}
                      </div>
                      <p className="text-xs text-center text-gray-700 font-semibold mb-1">
                        📱 Quét QR để xác thực trên Blockchain
                      </p>
                      {nftData && nftData.tokenId && (
                        <>
                          <Tag
                            color="blue"
                            className="text-base font-mono px-3 py-1 mb-2"
                          >
                            {nftData.certificateId ||
                              formatWithYear(nftData.tokenId)}
                          </Tag>
                          <p className="text-xs text-center text-gray-600 italic">
                            Hoặc nhập Certificate ID tại trang xác minh
                          </p>
                        </>
                      )}
                    </div>
                  </div>

                  {/* System Info */}
                  <div className="sm:w-2/3">
                    <div className="space-y-4">
                      {/* NFT Certificate ID Section */}
                      {nftData && nftData.tokenId && (
                        <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded">
                          <div className="flex items-start">
                            <SafetyCertificateOutlined className="text-green-600 text-2xl mt-1 mr-3" />
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-green-800 mb-1">
                                NFT Certificate ID (Blockchain)
                              </p>
                              <div className="flex flex-col gap-2">
                                {/* Main Certificate ID with year */}
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-xl font-bold text-green-700">
                                    {nftData.certificateId ||
                                      formatWithYear(nftData.tokenId)}
                                  </span>
                                  <button
                                    className="text-green-600 hover:text-green-800 transition-colors text-lg"
                                    onClick={(event) => {
                                      const certId =
                                        nftData.certificateId ||
                                        formatWithYear(nftData.tokenId);
                                      navigator.clipboard.writeText(certId);
                                      // Show success notification
                                      const btn = event.currentTarget;
                                      const originalHTML = btn.innerHTML;
                                      btn.innerHTML =
                                        '<i class="fas fa-check"></i>';
                                      setTimeout(() => {
                                        btn.innerHTML = originalHTML;
                                      }, 1500);
                                    }}
                                    title="Sao chép Certificate ID"
                                  >
                                    <i className="far fa-copy" />
                                  </button>
                                </div>
                                {/* Show short format too */}
                                <p className="text-xs text-gray-600 mt-2">
                                  Short ID:{' '}
                                  <span className="font-mono font-semibold">
                                    {nftData.certificateIdShort ||
                                      formatCertificateId(nftData.tokenId)}
                                  </span>
                                </p>
                                <p className="text-xs text-green-600 mt-1">
                                  ✓ Chứng chỉ NFT đã được mint trên blockchain
                                </p>
                                <p className="text-xs text-gray-600 mt-1 italic">
                                  💡 Sao chép Certificate ID để xác minh trên
                                  trang công khai
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      <div>
                        <p className="text-sm text-gray-500">Mã Đăng Ký</p>
                        <div className="flex items-center mt-1">
                          <p className="font-mono text-sm text-blue-600 font-semibold">
                            #{bookingData.bookingId}
                          </p>
                          <button
                            className="ml-2 text-blue-500 hover:text-blue-700"
                            onClick={() =>
                              navigator.clipboard.writeText(
                                bookingData.bookingId
                              )
                            }
                          >
                            <i className="far fa-copy" />
                          </button>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">
                          Thời Gian Đăng Ký
                        </p>
                        <p className="font-medium">
                          {dayjs(bookingData.createdAt).format(
                            'DD/MM/YYYY HH:mm:ss'
                          )}
                        </p>
                      </div>
                      {bookingData.blockchainTxHash && (
                        <div>
                          <p className="text-sm text-gray-500">
                            Blockchain Transaction
                          </p>
                          <div className="flex items-center mt-1">
                            <p className="font-mono text-xs text-green-600 truncate">
                              {bookingData.blockchainTxHash}
                            </p>
                            <button
                              className="ml-2 text-green-500 hover:text-green-700"
                              onClick={() =>
                                navigator.clipboard.writeText(
                                  bookingData.blockchainTxHash
                                )
                              }
                            >
                              <i className="far fa-copy" />
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Verify Button */}
                      {nftData && nftData.tokenId && (
                        <div className="pt-2">
                          <a
                            href={getVerifyUrl()}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Button
                              type="primary"
                              icon={<SafetyCertificateOutlined />}
                              block
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              Xác Minh Công Khai Trên Blockchain
                            </Button>
                          </a>
                        </div>
                      )}

                      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <i className="fas fa-shield-alt text-blue-400 text-xl" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm text-blue-700">
                              Chứng nhận này được lưu trữ an toàn trên hệ thống
                              MedChainAI. Mọi thông tin được mã hóa và bảo mật.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 px-4 sm:px-6">
              {/* Security Badges */}
              <div className="flex flex-wrap justify-center gap-3">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-2">
                    <i className="fas fa-lock text-green-600" />
                  </div>
                  <span className="text-xs font-medium">
                    Xác Thực Blockchain
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                    <i className="fas fa-fingerprint text-blue-600" />
                  </div>
                  <span className="text-xs font-medium">Ký Điện Tử</span>
                </div>
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center mr-2">
                    <i className="fas fa-link text-purple-600" />
                  </div>
                  <span className="text-xs font-medium">Hồ Sơ Bất Biến</span>
                </div>
              </div>
            </div>

            {/* Certificate Footer */}
            <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center certificate-footer">
              <div className="flex items-center mb-3 sm:mb-0">
                <i className="fas fa-shield-virus text-blue-600 mr-2" />
                <span className="text-sm font-medium text-gray-600">
                  MedChainAI © 2025
                </span>
              </div>
              <div className="flex space-x-3">
                <button
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={() => {
                    const url = window.location.href;
                    navigator.clipboard.writeText(url);
                  }}
                >
                  <i className="fas fa-share-alt mr-2" /> Chia Sẻ
                </button>
                <button
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={() => window.print()}
                >
                  <i className="fas fa-file-pdf mr-2" /> Tải PDF
                </button>
              </div>
            </div>
          </div>

          {/* Verification Instructions */}
          <div className="mt-8 bg-white shadow rounded-lg overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Cách Xác Thực Chứng Nhận Này
              </h3>
              <ol className="list-decimal list-inside space-y-3 text-sm text-gray-700">
                <li>
                  Quét mã QR bằng bất kỳ ứng dụng quét QR hoặc camera điện thoại
                </li>
                <li>
                  Truy cập cổng xác thực MedChainAI tại medchain.ai/verify
                </li>
                <li>Nhập mã hash chứng nhận hoặc ID giao dịch</li>
                <li>
                  So sánh thông tin trên blockchain với chi tiết chứng nhận này
                </li>
              </ol>
              <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-400 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <i className="fas fa-exclamation-triangle text-yellow-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      Vì lý do an ninh, luôn xác thực chứng nhận thông qua các
                      kênh chính thức. Không chỉ dựa vào việc kiểm tra trực
                      quan.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VaccineCertificate;
