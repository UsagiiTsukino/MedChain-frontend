import React from 'react';
import {
  TwitterOutlined,
  LinkedinOutlined,
  GithubOutlined,
  SafetyOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center">
              <SafetyOutlined className="text-blue-600 text-xl mr-2" />
              <span className="text-lg font-bold text-gray-900">VaxChain</span>
            </div>
            <p className="mt-4 text-sm text-gray-500">
              Bảo vệ sức khỏe toàn cầu thông qua công nghệ blockchain.
            </p>
            <div className="mt-4 flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <TwitterOutlined />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <LinkedinOutlined />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <GithubOutlined />
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
              Giải pháp
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  to="/individual"
                  className="text-sm text-gray-500 hover:text-blue-600"
                >
                  Cho cá nhân
                </Link>
              </li>
              <li>
                <Link
                  to="/healthcare"
                  className="text-sm text-gray-500 hover:text-blue-600"
                >
                  Cho y tế
                </Link>
              </li>
              <li>
                <Link
                  to="/government"
                  className="text-sm text-gray-500 hover:text-blue-600"
                >
                  Cho chính phủ
                </Link>
              </li>
              <li>
                <Link
                  to="/travel"
                  className="text-sm text-gray-500 hover:text-blue-600"
                >
                  Cho du lịch
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
              Tài nguyên
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  to="/docs"
                  className="text-sm text-gray-500 hover:text-blue-600"
                >
                  Tài liệu
                </Link>
              </li>
              <li>
                <Link
                  to="/api"
                  className="text-sm text-gray-500 hover:text-blue-600"
                >
                  API
                </Link>
              </li>
              <li>
                <Link
                  to="/blog"
                  className="text-sm text-gray-500 hover:text-blue-600"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  to="/support"
                  className="text-sm text-gray-500 hover:text-blue-600"
                >
                  Hỗ trợ
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
              Công ty
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  to="/about"
                  className="text-sm text-gray-500 hover:text-blue-600"
                >
                  Về chúng tôi
                </Link>
              </li>
              <li>
                <Link
                  to="/careers"
                  className="text-sm text-gray-500 hover:text-blue-600"
                >
                  Tuyển dụng
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-sm text-gray-500 hover:text-blue-600"
                >
                  Quyền riêng tư
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-sm text-gray-500 hover:text-blue-600"
                >
                  Điều khoản
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500">
            © 2025 VaxChain. Đã đăng ký bản quyền.
          </p>
          <div className="mt-4 md:mt-0">
            <p className="text-xs text-gray-500">
              Bảo mật sức khỏe bằng công nghệ blockchain
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
