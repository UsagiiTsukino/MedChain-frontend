import React, { useEffect } from 'react';
import dayjs from 'dayjs';
import { QRCodeSVG } from 'qrcode.react';
import { useSelector } from 'react-redux';
const VaccineCertificate = ({ data, transactionHash }) => {
  const user = useSelector((state) => state.account.user);

  return (
    <div className="bg-gray-50">
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Certificate Container */}
          <div className="bg-white certificate-border shadow-xl rounded-lg overflow-hidden">
            {/* Certificate Header */}
            <div className="bg-gradient-to-r from-blue-600 to-green-500 p-6 text-white">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold">
                    Chứng Nhận Tiêm Chủng Số
                  </h1>
                  <p className="mt-1">Được cấp qua Mạng Blockchain VaxChain</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
                  <i className="fas fa-shield-virus text-white text-xl" />
                </div>
              </div>
            </div>

            {/* Certificate Body */}
            <div className="p-6 sm:p-8">
              {/* Recipient Info */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Thông Tin Người Nhận
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Họ Tên</p>
                    <p className="font-medium">{user.fullname}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Ngày Sinh</p>
                    <p className="font-medium">
                      {dayjs(user.birthday).format('DD/MM/YYYY')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Vaccine Details */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Chi Tiết Tiêm Chủng
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Loại Vaccine</p>
                    <p className="font-medium">{data.vaccineName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Ngày Tiêm</p>
                    <p className="font-medium">
                      {dayjs(data.date).format('DD/MM/YYYY')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Giờ Tiêm</p>
                    <p className="font-medium">{data.time}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                  <div>
                    <p className="text-sm text-gray-500">Trạng Thái</p>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <i className="fas fa-check-circle mr-1" /> Đã Xác Thực
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Cơ Sở Tiêm</p>
                    <p className="font-medium">{data.centerName}</p>
                  </div>
                </div>
              </div>

              {/* Verification Section */}
              <div className="border-t border-gray-200 pt-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Xác Thực Blockchain
                </h2>
                <div className="flex flex-col sm:flex-row gap-6">
                  {/* QR Code */}
                  <div className="sm:w-1/3">
                    <div className="bg-gray-100 p-4 rounded-lg flex flex-col items-center">
                      <div className="h-40 w-40 bg-white p-2 rounded flex items-center justify-center mb-2">
                        <QRCodeSVG
                          value={`${window.location.origin}/verify/${transactionHash}`}
                          size={150}
                          level="H"
                        />
                      </div>
                      <p className="text-xs text-center text-gray-600">
                        Quét để xác thực chứng nhận
                      </p>
                      <p className="text-xs text-center text-gray-500 mt-1">
                        vaxchain.io/verify/{transactionHash.slice(0, 6)}
                      </p>
                    </div>
                  </div>

                  {/* Blockchain Info */}
                  <div className="sm:w-2/3">
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-500">
                          Mã Xác Thực Blockchain
                        </p>
                        <div className="flex items-center mt-1">
                          <p className="font-mono text-sm text-blue-600 truncate">
                            {data.appointmentHash}
                          </p>
                          <button
                            className="ml-2 text-blue-500 hover:text-blue-700"
                            onClick={() =>
                              navigator.clipboard.writeText(
                                data.appointmentHash
                              )
                            }
                          >
                            <i className="far fa-copy" />
                          </button>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Thời Gian Tạo</p>
                        <p className="font-medium">
                          {dayjs(data.datetime).format('DD/MM/YYYY HH:mm')} UTC
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Mã Giao Dịch</p>
                        <div className="flex items-center mt-1">
                          <p className="font-mono text-sm text-green-600 truncate">
                            {data.paymentHash}
                          </p>
                          <button
                            className="ml-2 text-green-500 hover:text-green-700"
                            onClick={() =>
                              navigator.clipboard.writeText(data.paymentHash)
                            }
                          >
                            <i className="far fa-copy" />
                          </button>
                        </div>
                      </div>
                      <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <i className="fas fa-shield-alt text-blue-400" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm text-blue-700">
                              Chứng nhận này được ký điện tử và lưu trữ bất biến
                              trên blockchain Ethereum.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Security Badges */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex flex-wrap justify-center gap-4">
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
            </div>

            {/* Certificate Footer */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center">
              <div className="flex items-center mb-3 sm:mb-0">
                <i className="fas fa-shield-virus text-blue-600 mr-2" />
                <span className="text-sm font-medium text-gray-600">
                  VaxChain © 2025
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
                <li>Truy cập cổng xác thực VaxChain tại vaxchain.io/verify</li>
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
