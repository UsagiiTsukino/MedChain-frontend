import React, { useEffect, useState } from 'react';
import {
  Table,
  Card,
  Tag,
  Button,
  Space,
  message,
  Tooltip,
  Modal,
  Form,
  Select,
  Input,
  DatePicker,
} from 'antd';
import {
  EditOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  SearchOutlined,
  ReloadOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import {
  callAllBookings,
  callCancelAppointment,
  callCompleteAppointment,
  callConfirmAppointment,
  callRefundAppointment,
} from '../../config/api.appointment';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import LoadingTable from '../../components/share/LoadingTable';
import useLoadingData from '../../utils/withLoadingData';
import Web3 from 'web3';

const AppointmentManagementPage = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { confirm } = Modal;

  // Sử dụng custom hook để quản lý trạng thái loading
  const {
    loading,
    data: appointments,
    fetchData: fetchAppointments,
  } = useLoadingData(
    async () => {
      const response = await callAllBookings();
      console.log('[AppointmentPage] API response:', response);
      // Response format: { message: "success", data: { result: [...], meta: {...} } }
      // Or direct: { result: [...], meta: {...} }
      const data = response?.data?.data || response?.data || response;
      const result = data?.result || data || [];
      console.log('[AppointmentPage] Parsed appointments:', result);
      return result;
    },
    {
      errorMessage: 'Không thể tải danh sách lịch hẹn',
      timeout: 1000,
    }
  );

  useEffect(() => {
    fetchAppointments();
  }, []);

  const getStatusTag = (status) => {
    switch (status) {
      case 0:
        return (
          <Tag icon={<ClockCircleOutlined />} color="warning">
            Chờ xác nhận
          </Tag>
        );
      case 1:
        return (
          <Tag icon={<CheckCircleOutlined />} color="processing">
            Đã xác nhận
          </Tag>
        );
      case 2:
        return (
          <Tag icon={<CheckCircleOutlined />} color="success">
            Đã tiêm
          </Tag>
        );
      case 3:
        return (
          <Tag icon={<CloseCircleOutlined />} color="error">
            Đã hủy
          </Tag>
        );
      case 4:
        return (
          <Tag icon={<CloseCircleOutlined />} color="default">
            Đã hoàn tiền
          </Tag>
        );
      default:
        return (
          <Tag icon={<ExclamationCircleOutlined />} color="default">
            Không xác định
          </Tag>
        );
    }
  };

  const web3Instance = new Web3(window.ethereum);
  const sendETH = async (patientAddress, price) => {
    try {
      // Calculate ETH based on vaccine price (10000 VND = 1 ETH)
      const ethAmount = price / 100000;
      const amountInWei = web3Instance.utils.toWei(
        ethAmount.toString(),
        'ether'
      );

      // Display the conversion in console for verification
      console.log(`Refunding ${price} VND as ${ethAmount} ETH at rate 10000:1`);

      const tx = {
        from: '0x672DF7fDcf5dA93C30490C7d49bd6b5bF7B4D32C',
        to: patientAddress,
        value: amountInWei,
        gas: 21000,
      };

      const receipt = await web3Instance.eth.sendTransaction(tx);
      return receipt.transactionHash;
    } catch (error) {
      console.error('Transaction failed:', error);
      return false;
    }
  };

  const handleRefund = async (patientAddress, appointmentId, price) => {
    const ethAmount = price / 10000;

    confirm({
      title: 'Xác nhận hoàn tiền',
      icon: <ExclamationCircleOutlined />,
      content: (
        <div>
          <p>Bạn có chắc chắn muốn hoàn tiền cho lịch hẹn này?</p>
          <p>
            Số tiền:{' '}
            {new Intl.NumberFormat('vi-VN', {
              style: 'currency',
              currency: 'VND',
            }).format(price)}
          </p>
          <p className="text-blue-600 font-semibold">
            Tương đương: {ethAmount} ETH
          </p>
        </div>
      ),
      async onOk() {
        message.loading('Đang xử lý hoàn tiền...');
        const hash = await sendETH(patientAddress, price);
        if (hash) {
          await callRefundAppointment(appointmentId);
          message.success('Hoàn tiền thành công');
          fetchAppointments();
        } else {
          message.error('Hoàn tiền thất bại. Vui lòng thử lại sau.');
        }
      },
    });
  };
  const columns = [
    {
      title: 'ID',
      dataIndex: 'appointmentId',
      key: 'appointmentId',
      width: 80,
      render: (id) => <span className="text-xs font-mono">{id}</span>,
    },
    {
      title: 'Bệnh nhân',
      dataIndex: 'patientAddress',
      key: 'patientName',
    },
    {
      title: 'Vaccine',
      dataIndex: 'vaccineName',
      key: 'vaccineName',
    },
    {
      title: 'Trung tâm',
      dataIndex: 'centerName',
      key: 'centerName',
    },
    {
      title: 'Ngày',
      dataIndex: 'date',
      key: 'date',
      render: (date) => dayjs(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Giờ',
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: 'Giá (VND)',
      dataIndex: 'price',
      key: 'price',
      render: (price) =>
        new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND',
        }).format(price),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => getStatusTag(status),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 200,
      render: (_, record) => {
        return (
          <Space>
            {record.status === 3 && (
              <Button
                type="default"
                danger
                size="small"
                onClick={() =>
                  handleRefund(
                    record.patientAddress,
                    record.appointmentId,
                    record.price
                  )
                }
              >
                Hoàn tiền
              </Button>
            )}
          </Space>
        );
      },
    },
  ];

  console.log(appointments);

  return (
    <div className="p-6">
      <Card
        title="Quản lý lịch hẹn tiêm chủng"
        extra={
          <Button
            type="primary"
            icon={<ReloadOutlined />}
            onClick={() => fetchAppointments()}
          >
            Làm mới
          </Button>
        }
      >
        <LoadingTable
          columns={columns}
          dataSource={appointments}
          loading={loading}
          rowKey="appointmentId"
          pagination={{
            pageSize: 10,
            showTotal: (total) => `Tổng ${total} lịch hẹn`,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50'],
          }}
        />
      </Card>
    </div>
  );
};

export default AppointmentManagementPage;
