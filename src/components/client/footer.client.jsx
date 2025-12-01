import React from 'react';
import {
  TwitterOutlined,
  LinkedinOutlined,
  GithubOutlined,
  SafetyCertificateOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  HeartFilled,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute top-0 left-0 w-full h-full"
          style={{
            backgroundImage:
              'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                <SafetyCertificateOutlined className="text-white text-xl" />
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-300 to-indigo-300 bg-clip-text text-transparent">
                  VaxChain
                </span>
                <div className="text-xs text-blue-300">
                  Blockchain Healthcare
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed mb-4">
              Nền tảng quản lý tiêm chủng hàng đầu sử dụng công nghệ Blockchain
              để đảm bảo tính minh bạch, an toàn và xác thực.
            </p>
            <div className="flex gap-3">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-lg bg-white/10 hover:bg-blue-500 flex items-center justify-center transition-all duration-300 backdrop-blur-sm border border-white/10 hover:border-blue-400"
              >
                <TwitterOutlined className="text-lg" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-lg bg-white/10 hover:bg-blue-600 flex items-center justify-center transition-all duration-300 backdrop-blur-sm border border-white/10 hover:border-blue-400"
              >
                <LinkedinOutlined className="text-lg" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-lg bg-white/10 hover:bg-gray-700 flex items-center justify-center transition-all duration-300 backdrop-blur-sm border border-white/10 hover:border-gray-400"
              >
                <GithubOutlined className="text-lg" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <span className="h-1 w-8 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full" />
              Dịch vụ
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/market"
                  className="text-sm text-gray-300 hover:text-blue-300 transition-colors duration-200 flex items-center gap-2 group"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Chợ Vaccine
                </Link>
              </li>
              <li>
                <Link
                  to="/booking"
                  className="text-sm text-gray-300 hover:text-blue-300 transition-colors duration-200 flex items-center gap-2 group"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Đặt lịch tiêm
                </Link>
              </li>
              <li>
                <Link
                  to="/profile"
                  className="text-sm text-gray-300 hover:text-blue-300 transition-colors duration-200 flex items-center gap-2 group"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Hồ sơ tiêm chủng
                </Link>
              </li>
              <li>
                <Link
                  to="/cart"
                  className="text-sm text-gray-300 hover:text-blue-300 transition-colors duration-200 flex items-center gap-2 group"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Giỏ hàng
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <span className="h-1 w-8 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full" />
              Hỗ trợ
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/about"
                  className="text-sm text-gray-300 hover:text-blue-300 transition-colors duration-200 flex items-center gap-2 group"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Về chúng tôi
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="text-sm text-gray-300 hover:text-blue-300 transition-colors duration-200 flex items-center gap-2 group"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Câu hỏi thường gặp
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-sm text-gray-300 hover:text-blue-300 transition-colors duration-200 flex items-center gap-2 group"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Chính sách bảo mật
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-sm text-gray-300 hover:text-blue-300 transition-colors duration-200 flex items-center gap-2 group"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Điều khoản sử dụng
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <span className="h-1 w-8 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full" />
              Liên hệ
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-gray-300">
                <EnvironmentOutlined className="text-blue-400 text-base mt-0.5" />
                <span className="leading-relaxed">
                  Đại học Sư Phạm Kỹ Thuật,
                  <br />
                  TP. Hồ Chí Minh, Việt Nam
                </span>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-300">
                <PhoneOutlined className="text-blue-400 text-base" />
                <a
                  href="tel:+84123456789"
                  className="hover:text-blue-300 transition-colors"
                >
                  +84 123 456 789
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-300">
                <MailOutlined className="text-blue-400 text-base" />
                <a
                  href="mailto:contact@vaxchain.com"
                  className="hover:text-blue-300 transition-colors"
                >
                  contact@vaxchain.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider with gradient */}
        <div className="h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent mb-6" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span>© {currentYear} VaxChain.</span>
            <span className="hidden sm:inline">Được phát triển với</span>
            <HeartFilled className="text-red-500 text-xs animate-pulse" />
            <span className="hidden sm:inline">tại Việt Nam</span>
          </div>
          <div className="flex items-center gap-6 text-xs text-gray-400">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <span>Hệ thống hoạt động</span>
            </div>
            <span className="hidden md:inline">
              Powered by Blockchain Technology
            </span>
          </div>
        </div>
      </div>

      {/* Decorative gradient orbs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
    </footer>
  );
};

export default Footer;
