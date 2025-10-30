import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import VaccineCertificate from '../../../components/certificate/VaccineCertificate';
import { Spin, message } from 'antd';
import { callGetAppointment, callVerifyId } from '../../../config/api.appointment';

const CertificatePage = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [transactionHash, setTransactionHash] = useState('');

  useEffect(() => {
    // Fetch api appointment data
    const fetchData = async () => {
      try {
        setLoading(true);
        // Gọi API để lấy thông tin appointment
        const response = await callGetAppointment(id);
        const verify = await callVerifyId(id);
        if (response && response.data && verify && verify.data) {
          // Chuẩn bị dữ liệu cho certificate
          const appointmentData = {
            vaccineName: response.data.vaccineName,
            date: response.data.date,
            time: response.data.time,
            centerName: response.data.centerName,
            paymentHash: verify.data.paymentHash,
            appointmentHash: verify.data.appointmentHash,
            datetime: verify.data.datetime,
          };
          
          setData(appointmentData);
          // Hash giao dịch có thể được lấy từ response hoặc tạo ra từ id
          setTransactionHash(response.data.transactionHash || `0x${id.padStart(64, '0')}`);
        } else {
          message.error('Không thể tải thông tin chứng nhận');
        }
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu chứng nhận:', error);
        message.error('Đã xảy ra lỗi khi tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" tip="Đang tải chứng nhận..." />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="text-red-500 text-5xl mb-4">
          <i className="fas fa-exclamation-circle"></i>
        </div>
        <h2 className="text-2xl font-bold mb-2">Không tìm thấy chứng nhận</h2>
        <p className="text-gray-500">Mã chứng nhận không hợp lệ hoặc đã hết hạn</p>
      </div>
    );
  }

  return (
    <VaccineCertificate 
      data={data} 
      transactionHash={transactionHash} 
    />
  );
};

export default CertificatePage; 