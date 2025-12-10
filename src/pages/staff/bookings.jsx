/* eslint-disable no-unused-vars */
import { useRef, useState } from 'react';
import {
  Badge,
  Button,
  Space,
  Tag,
  Tooltip,
  Avatar,
  Drawer,
  Descriptions,
  Typography,
  message,
  Select,
} from 'antd';
import {
  EditOutlined,
  CalendarOutlined,
  UserOutlined,
  MedicineBoxOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  EyeOutlined,
  PhoneOutlined,
  MailOutlined,
  IdcardOutlined,
  DollarOutlined,
} from '@ant-design/icons';

import DataTable from '../../components/data-table';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBooking } from '../../redux/slice/bookingSlice';
import {
  callUpdateAppointment,
  callUnassignDoctor,
} from '../../config/api.appointment';
import { callFetchDoctor } from '../../config/api.user';
import dayjs from 'dayjs';

const { Title, Paragraph, Text } = Typography;

const BookingsPage = () => {
  const tableRef = useRef();

  const isFetching = useSelector((state) => state.booking.isFetching);
  const meta = useSelector((state) => state.booking.meta);
  const bookings = useSelector((state) => state.booking.result);
  const user = useSelector((state) => state.account.user);
  const dispatch = useDispatch();

  // eslint-disable-next-line no-console
  console.log('[BookingsPage] bookings from Redux:', bookings);
  // eslint-disable-next-line no-console
  console.log('[BookingsPage] meta from Redux:', meta);
  // eslint-disable-next-line no-console
  console.log('[BookingsPage] user from Redux:', user);

  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [assigningDoctor, setAssigningDoctor] = useState(false);

  const reloadTable = () => {
    tableRef?.current?.reload();
  };

  const fetchDoctors = async (bookingRecord) => {
    // eslint-disable-next-line no-console
    console.log('[fetchDoctors] CALLED with bookingRecord:', bookingRecord);
    try {
      // Lấy centerId từ user hiện tại hoặc từ booking đang xem
      // Center entity có field 'id', không phải 'centerId'
      const centerId =
        user?.centerId || bookingRecord?.center?.id || bookingRecord?.centerId;
      // eslint-disable-next-line no-console
      console.log('[fetchDoctors] user:', user);
      // eslint-disable-next-line no-console
      console.log(
        '[fetchDoctors] bookingRecord.center:',
        bookingRecord?.center
      );
      // eslint-disable-next-line no-console
      console.log('[fetchDoctors] centerId:', centerId);

      if (!centerId) {
        message.error('Không tìm thấy thông tin trung tâm');
        return;
      }

      // eslint-disable-next-line no-console
      console.log('[fetchDoctors] Calling API with centerId:', centerId);
      const res = await callFetchDoctor(centerId);
      // eslint-disable-next-line no-console
      console.log('[fetchDoctors] Response:', res);

      if (res?.result) {
        setDoctors(res.result);
        // eslint-disable-next-line no-console
        console.log(
          '[fetchDoctors] Doctors loaded:',
          res.result.length,
          'doctors'
        );
      } else {
        // eslint-disable-next-line no-console
        console.warn('[fetchDoctors] No doctors in response');
        setDoctors([]);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('[fetchDoctors] Error:', error);
      message.error('Không thể tải danh sách bác sĩ');
      setDoctors([]);
    }
  };

  const showBookingDetails = async (record) => {
    // eslint-disable-next-line no-console
    console.log('[showBookingDetails] record:', record);
    // eslint-disable-next-line no-console
    console.log('[showBookingDetails] appointments:', record.appointments);
    setSelectedBooking(record);
    setDrawerVisible(true);
    await fetchDoctors(record);
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
    setSelectedBooking(null);
    setSelectedDoctor(null);
  };

  const handleAssignDoctor = async () => {
    if (!selectedDoctor) {
      message.warning('Vui lòng chọn bác sĩ');
      return;
    }

    // Find the first appointment of this booking to assign doctor
    if (
      !selectedBooking?.appointments ||
      selectedBooking.appointments.length === 0
    ) {
      message.error('Booking này chưa có appointment');
      return;
    }

    const firstAppointment = selectedBooking.appointments[0];
    // eslint-disable-next-line no-console
    console.log(
      '[handleAssignDoctor] appointmentId:',
      firstAppointment.appointmentId
    );
    // eslint-disable-next-line no-console
    console.log('[handleAssignDoctor] selectedDoctor:', selectedDoctor);

    setAssigningDoctor(true);
    try {
      const res = await callUpdateAppointment(
        firstAppointment.appointmentId,
        selectedDoctor
      );
      // eslint-disable-next-line no-console
      console.log('[handleAssignDoctor] response:', res);
      if (res) {
        message.success('Phân công bác sĩ thành công!');
        closeDrawer();
        reloadTable();
      } else {
        message.error('Không nhận được phản hồi từ server');
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('[handleAssignDoctor] error:', error);
      message.error(
        error.response?.data?.message ||
          'Có lỗi xảy ra khi phân công bác sĩ: ' +
            (error.message || 'Unknown error')
      );
    } finally {
      setAssigningDoctor(false);
    }
  };

  const handleUnassignDoctor = async () => {
    if (
      !selectedBooking?.appointments ||
      selectedBooking.appointments.length === 0
    ) {
      message.error('Booking này chưa có appointment');
      return;
    }

    const firstAppointment = selectedBooking.appointments[0];

    setAssigningDoctor(true);
    try {
      const res = await callUnassignDoctor(firstAppointment.appointmentId);
      if (res) {
        message.success('Đã hủy phân công bác sĩ. Có thể phân công lại.');
        closeDrawer();
        reloadTable();
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('[handleUnassignDoctor] error:', error);
      message.error(
        error.response?.data?.message ||
          'Có lỗi xảy ra khi hủy phân công: ' +
            (error.message || 'Unknown error')
      );
    } finally {
      setAssigningDoctor(false);
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      PENDING: {
        color: 'warning',
        text: 'Chờ xử lý',
        icon: <ClockCircleOutlined />,
      },
      CONFIRMED: {
        color: 'processing',
        text: 'Đã xác nhận',
        icon: <CheckCircleOutlined />,
      },
      COMPLETED: {
        color: 'success',
        text: 'Hoàn thành',
        icon: <CheckCircleOutlined />,
      },
      CANCELLED: {
        color: 'error',
        text: 'Đã hủy',
        icon: <ClockCircleOutlined />,
      },
      PROGRESS: {
        color: 'processing',
        text: 'Đang xử lý',
        icon: <ClockCircleOutlined />,
      },
    };
    return configs[status] || configs.PENDING;
  };

  const columns = [
    {
      title: 'STT',
      key: 'index',
      width: 60,
      align: 'center',
      fixed: 'left',
      render: (text, record, index) => (
        <span className="font-semibold text-gray-600">
          {index + 1 + meta.page * meta.pageSize}
        </span>
      ),
      hideInSearch: true,
    },
    {
      title: 'Mã Booking',
      dataIndex: 'bookingId',
      width: 120,
      render: (text) => (
        <Tag color="blue" className="font-mono">
          #{text}
        </Tag>
      ),
    },
    {
      title: 'Bệnh nhân',
      width: 200,
      render: (_, record) => {
        const patientName = record.patient?.fullName || 'N/A';
        const patientPhone = record.patient?.phone || 'N/A';
        return (
          <div className="flex items-center gap-3">
            <Avatar
              size={40}
              className="bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-md"
            >
              {patientName?.charAt(0)}
            </Avatar>
            <div>
              <div className="font-semibold text-gray-900">{patientName}</div>
              <div className="text-xs text-gray-500 flex items-center gap-1">
                <PhoneOutlined />
                {patientPhone}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      title: 'Vaccine',
      width: 180,
      render: (_, record) => {
        const vaccineName = record.vaccine?.name || 'N/A';
        return (
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
              <MedicineBoxOutlined className="text-green-600" />
            </div>
            <Tooltip title={vaccineName}>
              <span className="font-medium text-gray-900">
                {vaccineName?.length > 20
                  ? vaccineName.slice(0, 20) + '...'
                  : vaccineName}
              </span>
            </Tooltip>
          </div>
        );
      },
    },
    {
      title: 'Lịch hẹn',
      width: 180,
      render: (_, record) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-gray-900">
            <CalendarOutlined className="text-orange-500" />
            <span className="font-medium">
              {record.firstDoseDate
                ? dayjs(record.firstDoseDate).format('DD/MM/YYYY')
                : 'N/A'}
            </span>
          </div>
          <div className="flex items-center gap-2 text-gray-500 text-xs">
            <ClockCircleOutlined />
            {record.firstDoseTime || 'N/A'}
          </div>
        </div>
      ),
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalAmount',
      width: 120,
      render: (amount) => (
        <Tag color="green" icon={<DollarOutlined />} className="px-3 py-1">
          {amount?.toLocaleString('vi-VN')} đ
        </Tag>
      ),
    },
    {
      title: 'Phân công BS',
      width: 150,
      render: (_, record) => {
        const hasDoctor =
          record.appointments &&
          record.appointments.length > 0 &&
          record.appointments[0].doctor;
        return hasDoctor ? (
          <div className="flex items-center gap-2">
            <Badge status="success" />
            <Tooltip title={record.appointments[0].doctor.fullName}>
              <span className="text-sm font-medium text-green-700">
                Đã phân công
              </span>
            </Tooltip>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Badge status="warning" />
            <span className="text-sm text-gray-500">Chưa phân công</span>
          </div>
        );
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'overallStatus',
      width: 140,
      render: (status) => {
        const config = getStatusConfig(status);
        return (
          <Tag color={config.color} icon={config.icon} className="px-3 py-1">
            {config.text}
          </Tag>
        );
      },
    },
    {
      title: 'Thao tác',
      width: 120,
      fixed: 'right',
      align: 'center',
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EyeOutlined />}
            size="large"
            className="bg-gradient-to-r from-blue-600 to-cyan-600 border-0 shadow-md hover:shadow-lg"
            onClick={() => showBookingDetails(record)}
          >
            Chi tiết
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
          Quản lý Booking
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Xem và quản lý các booking tiêm chủng
        </p>
      </div>

      <DataTable
        actionRef={tableRef}
        headerTitle={
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
              <CalendarOutlined className="text-white text-lg" />
            </div>
            <span className="text-lg font-semibold text-gray-900">
              Danh sách booking
            </span>
          </div>
        }
        rowKey="bookingId"
        loading={isFetching}
        columns={columns}
        dataSource={bookings}
        request={async (params, sort, filter) => {
          // eslint-disable-next-line no-console
          console.log('[BookingsPage] params:', params);
          // params.current is 1-based from ProTable, convert to 0-based for backend
          const page = params.current ? params.current - 1 : 0;
          const size = params.pageSize || 10;
          // eslint-disable-next-line no-console
          console.log('[BookingsPage] Dispatching page:', page, 'size:', size);
          dispatch(fetchBooking({ page, size }));
        }}
        scroll={{ x: 1400 }}
        pagination={{
          current: meta.page !== undefined ? meta.page + 1 : 1, // Backend returns 0-based, UI needs 1-based
          pageSize: meta.pageSize || 10,
          showSizeChanger: true,
          total: meta.total,
          showTotal: (total, range) => {
            return (
              <div>
                {range[0]}-{range[1]} trên tổng số {total} booking
              </div>
            );
          },
        }}
        rowSelection={false}
      />

      <Drawer
        title={
          <div className="flex items-center gap-3 pb-4 border-b">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg">
              <CalendarOutlined className="text-white text-xl" />
            </div>
            <div>
              <Title level={4} className="m-0">
                Chi tiết Booking
              </Title>
              <Text className="text-gray-500 text-sm">
                Mã: #{selectedBooking?.bookingId}
              </Text>
            </div>
          </div>
        }
        width={700}
        onClose={closeDrawer}
        open={drawerVisible}
        extra={
          <Button
            onClick={closeDrawer}
            size="large"
            className="border-gray-300"
          >
            Đóng
          </Button>
        }
      >
        {selectedBooking && (
          <div className="space-y-6">
            {/* Patient Information */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6">
              <Title level={5} className="flex items-center gap-2 mb-4">
                <UserOutlined className="text-blue-600" />
                Thông tin bệnh nhân
              </Title>
              <Descriptions column={1} size="middle">
                <Descriptions.Item
                  label={<span className="font-semibold">Họ tên</span>}
                >
                  <span className="font-medium">
                    {selectedBooking.patient?.fullName || 'N/A'}
                  </span>
                </Descriptions.Item>
                <Descriptions.Item
                  label={
                    <span className="font-semibold flex items-center gap-1">
                      <PhoneOutlined /> Số điện thoại
                    </span>
                  }
                >
                  {selectedBooking.patient?.phone || 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item
                  label={
                    <span className="font-semibold flex items-center gap-1">
                      <MailOutlined /> Email
                    </span>
                  }
                >
                  {selectedBooking.patient?.email || 'Chưa có'}
                </Descriptions.Item>
                <Descriptions.Item
                  label={
                    <span className="font-semibold flex items-center gap-1">
                      <IdcardOutlined /> Địa chỉ
                    </span>
                  }
                >
                  {selectedBooking.patient?.address || 'Chưa có'}
                </Descriptions.Item>
              </Descriptions>
            </div>

            {/* Booking Information */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6">
              <Title level={5} className="flex items-center gap-2 mb-4">
                <CalendarOutlined className="text-green-600" />
                Thông tin booking
              </Title>
              <Descriptions column={1} size="middle">
                <Descriptions.Item
                  label={<span className="font-semibold">Vaccine</span>}
                >
                  <Tag color="green" className="text-sm">
                    {selectedBooking.vaccine?.name || 'N/A'}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item
                  label={<span className="font-semibold">Trung tâm</span>}
                >
                  {selectedBooking.center?.name || 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item
                  label={<span className="font-semibold">Ngày hẹn</span>}
                >
                  <Tag color="blue" className="text-sm">
                    {selectedBooking.firstDoseDate
                      ? dayjs(selectedBooking.firstDoseDate).format(
                          'DD/MM/YYYY'
                        )
                      : 'N/A'}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item
                  label={<span className="font-semibold">Giờ hẹn</span>}
                >
                  <Tag color="orange" className="text-sm">
                    {selectedBooking.firstDoseTime || 'N/A'}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item
                  label={<span className="font-semibold">Tổng số liều</span>}
                >
                  {selectedBooking.totalDoses || 1}
                </Descriptions.Item>
                <Descriptions.Item
                  label={<span className="font-semibold">Tổng tiền</span>}
                >
                  <Tag
                    color="green"
                    icon={<DollarOutlined />}
                    className="text-sm"
                  >
                    {selectedBooking.totalAmount?.toLocaleString('vi-VN')} đ
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item
                  label={<span className="font-semibold">Trạng thái</span>}
                >
                  {(() => {
                    const config = getStatusConfig(
                      selectedBooking.overallStatus
                    );
                    return (
                      <Tag
                        color={config.color}
                        icon={config.icon}
                        className="px-3 py-1"
                      >
                        {config.text}
                      </Tag>
                    );
                  })()}
                </Descriptions.Item>
              </Descriptions>
            </div>

            {/* Payment Information */}
            {selectedBooking.payment && (
              <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-6">
                <Title level={5} className="flex items-center gap-2 mb-4">
                  <DollarOutlined className="text-amber-600" />
                  Thông tin thanh toán
                </Title>
                <Descriptions column={1} size="middle">
                  <Descriptions.Item
                    label={<span className="font-semibold">Phương thức</span>}
                  >
                    {(() => {
                      const method =
                        selectedBooking.payment.method ||
                        selectedBooking.payment.paymentMethod ||
                        selectedBooking.paymentMethod;
                      const methodMap = {
                        CASH: { text: 'Tiền mặt', color: 'green' },
                        PAYPAL: { text: 'PayPal', color: 'blue' },
                        METAMASK: { text: 'MetaMask', color: 'purple' },
                        BANK_TRANSFER: { text: 'Chuyển khoản', color: 'cyan' },
                      };
                      const info = methodMap[method] || {
                        text: method || 'N/A',
                        color: 'default',
                      };
                      return <Tag color={info.color}>{info.text}</Tag>;
                    })()}
                  </Descriptions.Item>
                  <Descriptions.Item
                    label={<span className="font-semibold">Trạng thái</span>}
                  >
                    <Tag
                      color={
                        {
                          COMPLETED: 'success',
                          PENDING: 'warning',
                          FAILED: 'error',
                        }[selectedBooking.payment.status] || 'default'
                      }
                    >
                      {{
                        COMPLETED: 'Đã thanh toán',
                        PENDING: 'Chờ thanh toán',
                        FAILED: 'Thất bại',
                      }[selectedBooking.payment.status] ||
                        selectedBooking.payment.status ||
                        'N/A'}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item
                    label={<span className="font-semibold">Số tiền</span>}
                  >
                    {(() => {
                      const amount =
                        selectedBooking.payment.amount ||
                        selectedBooking.totalAmount ||
                        0;
                      const currency =
                        selectedBooking.payment.currency || 'VND';

                      // Format amount based on currency
                      if (currency === 'VND') {
                        return (
                          <span className="font-semibold text-green-600">
                            {new Intl.NumberFormat('vi-VN').format(amount)} đ
                          </span>
                        );
                      } else if (currency === 'ETH') {
                        return (
                          <span className="font-semibold text-purple-600">
                            {amount.toFixed(4)} ETH
                          </span>
                        );
                      } else if (currency === 'USD') {
                        return (
                          <span className="font-semibold text-blue-600">
                            ${amount.toFixed(2)}
                          </span>
                        );
                      } else {
                        return (
                          <span className="font-semibold">
                            {amount} {currency}
                          </span>
                        );
                      }
                    })()}
                  </Descriptions.Item>
                </Descriptions>
              </div>
            )}

            {/* Doctor Assignment */}
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6">
              <Title level={5} className="flex items-center gap-2 mb-4">
                <UserOutlined className="text-purple-600" />
                Phân công bác sĩ
              </Title>

              {/* Show current doctor if assigned */}
              {selectedBooking.appointments &&
              selectedBooking.appointments.length > 0 &&
              selectedBooking.appointments[0].doctor ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white rounded-lg">
                    <div className="flex items-center gap-3">
                      <Avatar
                        size={48}
                        className="bg-gradient-to-br from-purple-500 to-indigo-600"
                      >
                        {selectedBooking.appointments[0].doctor.fullName?.charAt(
                          0
                        )}
                      </Avatar>
                      <div>
                        <div className="font-semibold text-gray-900">
                          {selectedBooking.appointments[0].doctor.fullName}
                        </div>
                        <div className="text-sm text-gray-500">
                          Bác sĩ phụ trách
                        </div>
                      </div>
                    </div>
                    <Tag color="success" className="px-3 py-1">
                      Đã phân công
                    </Tag>
                  </div>

                  {(() => {
                    const status = selectedBooking.appointments[0].status;
                    const canUnassign =
                      status === 'SCHEDULED' || status === 'CONFIRMED';
                    const isCompleted = status === 'COMPLETED';
                    const isInProgress = status === 'IN_PROGRESS';

                    return (
                      <>
                        <Tooltip
                          title={
                            !canUnassign
                              ? isCompleted
                                ? 'Bác sĩ đã hoàn thành ca tiêm này, không thể hủy phân công'
                                : isInProgress
                                ? 'Bác sĩ đã bắt đầu điều trị, không thể hủy phân công'
                                : 'Không thể hủy phân công ở trạng thái hiện tại'
                              : ''
                          }
                        >
                          <Button
                            danger
                            size="large"
                            block
                            disabled={!canUnassign}
                            loading={assigningDoctor}
                            onClick={handleUnassignDoctor}
                            className="h-10 font-semibold"
                          >
                            Hủy phân công (cho phép phân công lại)
                          </Button>
                        </Tooltip>
                        {!canUnassign && (
                          <div className="text-center text-sm text-gray-500 p-2 bg-gray-50 rounded">
                            {isCompleted && '✓ Ca tiêm đã hoàn thành'}
                            {isInProgress && '⏳ Đang trong quá trình điều trị'}
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <Text className="font-semibold mb-2 block">
                      Chọn bác sĩ:
                    </Text>
                    {/* eslint-disable-next-line no-console */}
                    {console.log('[Drawer] doctors:', doctors)}
                    {/* eslint-disable-next-line no-console */}
                    {console.log('[Drawer] doctors.length:', doctors?.length)}
                    <Select
                      size="large"
                      placeholder={
                        doctors && doctors.length > 0
                          ? 'Chọn bác sĩ phụ trách'
                          : 'Đang tải danh sách bác sĩ...'
                      }
                      style={{ width: '100%' }}
                      value={selectedDoctor}
                      onChange={setSelectedDoctor}
                      loading={!doctors || doctors.length === 0}
                      options={
                        doctors && doctors.length > 0
                          ? doctors.map((doctor) => ({
                              label: (
                                <div className="flex items-center gap-2 py-1">
                                  <Avatar
                                    size={28}
                                    className="bg-gradient-to-br from-purple-500 to-indigo-600"
                                  >
                                    {doctor.fullName?.charAt(0) || 'D'}
                                  </Avatar>
                                  <span>{doctor.fullName}</span>
                                </div>
                              ),
                              value: doctor.walletAddress,
                            }))
                          : []
                      }
                    />
                  </div>
                  <Button
                    type="primary"
                    size="large"
                    block
                    loading={assigningDoctor}
                    onClick={handleAssignDoctor}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 border-0 h-12 font-semibold shadow-md hover:shadow-lg"
                  >
                    <CheckCircleOutlined /> Xác nhận phân công
                  </Button>
                </div>
              )}

              {/* Show message if no appointments */}
              {(!selectedBooking.appointments ||
                selectedBooking.appointments.length === 0) && (
                <div className="text-center py-4 text-gray-500">
                  <Text>
                    Booking này chưa có appointment để phân công bác sĩ
                  </Text>
                </div>
              )}
            </div>
          </div>
        )}
      </Drawer>
    </>
  );
};

export default BookingsPage;
