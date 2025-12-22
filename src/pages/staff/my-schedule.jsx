/* eslint-disable no-console */
import { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Badge,
  Button,
  Checkbox,
  Descriptions,
  Drawer,
  message,
  Select,
  Space,
  Tag,
  Popconfirm,
} from 'antd';
import {
  CheckOutlined,
  CloseOutlined,
  EyeOutlined,
  CalendarOutlined,
  MessageOutlined,
} from '@ant-design/icons';
import ChatModal from '../../components/chat/ChatModal';
import { ProTable } from '@ant-design/pro-components';
import {
  callCompleteAppointment,
  callMySchedule,
  callAcceptAppointment,
} from '../../config/api.appointment';
import dayjs from 'dayjs';

const MySchedulePage = () => {
  const actionRef = useRef();
  const user = useSelector((state) => state.account.user);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [chatVisible, setChatVisible] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [showTodayOnly, setShowTodayOnly] = useState(false);

  const handleViewDetail = (record) => {
    setSelectedAppointment(record);
    setOpenDrawer(true);
  };

  const closeDrawer = () => {
    setOpenDrawer(false);
    setSelectedAppointment(null);
  };

  const handleAcceptAppointment = async (appointmentId) => {
    try {
      setLoading(true);
      const res = await callAcceptAppointment(appointmentId);
      if (res) {
        message.success('Đã xác nhận đảm nhiệm ca tiêm!');
        actionRef.current?.reload();
        closeDrawer();
      }
    } catch (error) {
      console.error('[MySchedule] Accept error:', error);
      message.error(
        error?.response?.data?.message ||
          'Không thể xác nhận ca tiêm. Vui lòng thử lại!'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async (appointmentId) => {
    try {
      setLoading(true);
      const res = await callCompleteAppointment(appointmentId);
      if (res) {
        message.success('Hoàn thành ca tiêm thành công!');
        actionRef.current?.reload();
        closeDrawer();
      }
    } catch (error) {
      console.error('[MySchedule] Complete error:', error);
      message.error(
        error?.response?.data?.message ||
          'Không thể hoàn thành ca tiêm. Vui lòng thử lại!'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChat = (record) => {
    console.log('[MySchedule] handleOpenChat called with record:', record);

    // Open modal first for instant UI feedback
    setChatVisible(true);

    // Set data after modal is visible
    setTimeout(() => {
      setSelectedPatient({
        walletAddress: record.patientAddress,
        fullName: record.patientName,
        role: 'PATIENT',
      });
      setSelectedAppointment({
        appointmentId: record.appointmentId,
        doseNumber: record.doseNumber || 1,
        appointmentDate: record.scheduledDate,
        appointmentTime: record.scheduledTime,
        vaccine: { name: record.vaccineName },
      });
    }, 0);
  };

  const getStatusConfig = (status) => {
    const configs = {
      ASSIGNED: {
        color: 'gold',
        text: 'Chờ xác nhận',
        badge: 'warning',
      },
      CONFIRMED: {
        color: 'blue',
        text: 'Đã xác nhận - Sẵn sàng tiêm',
        badge: 'processing',
      },
      IN_PROGRESS: {
        color: 'cyan',
        text: 'Đang tiêm',
        badge: 'processing',
      },
      COMPLETED: {
        color: 'green',
        text: 'Đã hoàn thành',
        badge: 'success',
      },
      CANCELLED: {
        color: 'red',
        text: 'Đã hủy',
        badge: 'error',
      },
    };
    return configs[status] || configs.ASSIGNED;
  };

  const columns = [
    {
      title: 'STT',
      key: 'index',
      width: 60,
      align: 'center',
      render: (_, __, index) => index + 1,
      search: false,
    },
    {
      title: 'Bệnh nhân',
      dataIndex: 'patientName',
      width: 180,
      ellipsis: true,
      render: (text) => <span className="font-medium">{text}</span>,
    },
    {
      title: 'Vaccine',
      dataIndex: 'vaccineName',
      width: 200,
      ellipsis: true,
      render: (text) => (
        <span className="text-blue-600 font-medium">{text}</span>
      ),
    },
    {
      title: 'Mũi tiêm',
      width: 100,
      align: 'center',
      search: false,
      render: (_, record) => {
        // Get total doses from booking if available
        const totalDoses = record.totalDoses || '?';
        const doseNumber = record.doseNumber || 1;

        return (
          <Tag color="purple" className="font-medium">
            Mũi {doseNumber}/{totalDoses}
          </Tag>
        );
      },
    },
    {
      title: 'Ngày tiêm',
      dataIndex: 'scheduledDate',
      width: 120,
      align: 'center',
      search: false,
      render: (date) => (
        <span className="font-medium">{dayjs(date).format('DD/MM/YYYY')}</span>
      ),
    },
    {
      title: 'Giờ tiêm',
      dataIndex: 'scheduledTime',
      width: 100,
      align: 'center',
      search: false,
      render: (time) => (
        <Tag color="cyan" icon={<CalendarOutlined />}>
          {time}
        </Tag>
      ),
    },
    {
      title: 'Trung tâm',
      dataIndex: 'centerName',
      width: 180,
      ellipsis: true,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      width: 140,
      align: 'center',
      search: false,
      render: (status) => {
        const config = getStatusConfig(status);
        return (
          <Badge
            status={config.badge}
            text={config.text}
            className="font-medium"
          />
        );
      },
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 200,
      align: 'center',
      fixed: 'right',
      search: false,
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            ghost
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record)}
            size="small"
          >
            Chi tiết
          </Button>
          {record.status !== 'COMPLETED' && record.status !== 'CANCELLED' && (
            <Button
              icon={<MessageOutlined />}
              onClick={() => handleOpenChat(record)}
              size="small"
              className="text-blue-600 border-blue-400 hover:bg-blue-50"
            >
              Chat
            </Button>
          )}
          {(record.status === 'CONFIRMED' ||
            record.status === 'IN_PROGRESS') && (
            <Popconfirm
              title="Xác nhận hoàn thành"
              description="Bạn đã hoàn thành ca tiêm này?"
              onConfirm={() => handleComplete(record.appointmentId)}
              okText="Có"
              cancelText="Không"
            >
              <Button type="primary" icon={<CheckOutlined />} size="small">
                Hoàn thành
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-screen">
      <div className="max-w-[1600px] mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Lịch làm việc của tôi
            </h1>
          </div>
          <p className="text-gray-600 ml-7">
            Danh sách các ca tiêm được phân công cho bạn
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <ProTable
            actionRef={actionRef}
            rowKey="appointmentId"
            columns={columns}
            request={async (params) => {
              console.log('[MySchedule] Request params:', params);
              const query = new URLSearchParams({
                page: (params.current - 1).toString(),
                size: params.pageSize.toString(),
              }).toString();

              console.log('[MySchedule] Query string:', query);
              console.log(
                '[MySchedule] Full URL:',
                `/appointments/my-schedules?${query}`
              );

              try {
                const res = await callMySchedule(query);

                // Filter based on status dropdown
                let processedData = res?.result || [];
                if (statusFilter !== 'ALL') {
                  processedData = processedData.filter(
                    (item) => item.status === statusFilter
                  );
                }

                // Filter by today's date if checkbox is checked
                if (showTodayOnly) {
                  const today = dayjs().format('YYYY-MM-DD');
                  processedData = processedData.filter(
                    (item) => item.scheduledDate === today
                  );
                }

                // Sort by date (newest first)
                const sortedData = processedData.sort((a, b) => {
                  const dateA = dayjs(`${a.scheduledDate} ${a.scheduledTime}`);
                  const dateB = dayjs(`${b.scheduledDate} ${b.scheduledTime}`);
                  return dateB.diff(dateA); // Descending order (newest first)
                });

                // axios interceptor returns res.data directly
                return {
                  data: sortedData,
                  success: true,
                  total:
                    statusFilter !== 'ALL'
                      ? sortedData.length
                      : res?.meta?.total || 0,
                };
              } catch (error) {
                console.error('[MySchedule] API Error:', error);
                console.error(
                  '[MySchedule] Error details:',
                  error?.response?.data || error.message
                );
                message.error('Không thể tải dữ liệu lịch làm việc');
                return {
                  data: [],
                  success: false,
                  total: 0,
                };
              }
            }}
            pagination={{
              defaultPageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              pageSizeOptions: [10, 20, 50, 100],
              showTotal: (total, range) => (
                <span className="text-gray-600">
                  Hiển thị {range[0]}-{range[1]} trong tổng số {total} ca tiêm
                </span>
              ),
            }}
            scroll={{ x: 1400 }}
            search={{
              labelWidth: 'auto',
              defaultCollapsed: false,
              optionRender: (searchConfig, formProps, dom) => [
                ...dom.reverse(),
              ],
            }}
            dateFormatter="string"
            toolbar={{
              multipleLine: true,
              filter: (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-700 font-medium">
                      Trạng thái:
                    </span>
                    <Select
                      value={statusFilter}
                      onChange={(value) => {
                        setStatusFilter(value);
                        actionRef.current?.reload();
                      }}
                      style={{ width: 200 }}
                      options={[
                        { label: '🔍 Tất cả', value: 'ALL' },
                        { label: '⏳ Chờ xác nhận', value: 'PENDING' },
                        { label: '✅ Đã xác nhận', value: 'CONFIRMED' },
                        { label: '✔️ Hoàn thành', value: 'COMPLETED' },
                        { label: '❌ Đã hủy', value: 'CANCELLED' },
                      ]}
                    />
                  </div>
                  <div className="flex items-center">
                    <Checkbox
                      checked={showTodayOnly}
                      onChange={(e) => {
                        setShowTodayOnly(e.target.checked);
                        actionRef.current?.reload();
                      }}
                    >
                      <span className="text-gray-700 font-medium">
                        📅 Chỉ hiển thị lịch hôm nay
                      </span>
                    </Checkbox>
                  </div>
                </div>
              ),
            }}
            options={{
              reload: true,
              density: true,
              setting: true,
            }}
          />
        </div>

        <Drawer
          title={
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full" />
              <span className="text-lg font-bold">Chi tiết ca tiêm</span>
            </div>
          }
          width={720}
          onClose={closeDrawer}
          open={openDrawer}
          styles={{
            body: { paddingBottom: 80 },
          }}
        >
          {selectedAppointment && (
            <>
              <div className="mb-6">
                <Descriptions
                  bordered
                  column={1}
                  size="small"
                  styles={{
                    label: {
                      fontWeight: 600,
                      backgroundColor: '#f9fafb',
                      width: '200px',
                    },
                  }}
                >
                  <Descriptions.Item label="Mã ca tiêm">
                    <Tag color="blue">{selectedAppointment.appointmentId}</Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Trạng thái">
                    {(() => {
                      const config = getStatusConfig(
                        selectedAppointment.status
                      );
                      return (
                        <Badge
                          status={config.badge}
                          text={config.text}
                          className="font-medium"
                        />
                      );
                    })()}
                  </Descriptions.Item>
                </Descriptions>
              </div>

              <div className="mb-6">
                <h3 className="text-base font-semibold mb-3 text-gray-700">
                  Thông tin bệnh nhân
                </h3>
                <Descriptions bordered column={1} size="small">
                  <Descriptions.Item label="Họ tên">
                    {selectedAppointment.patientName}
                  </Descriptions.Item>
                  <Descriptions.Item label="Số điện thoại">
                    {selectedAppointment.patientPhone}
                  </Descriptions.Item>
                  <Descriptions.Item label="Email">
                    {selectedAppointment.patientEmail}
                  </Descriptions.Item>
                </Descriptions>
              </div>

              <div className="mb-6">
                <h3 className="text-base font-semibold mb-3 text-gray-700">
                  Thông tin tiêm chủng
                </h3>
                <Descriptions bordered column={1} size="small">
                  <Descriptions.Item label="Vaccine">
                    <span className="text-blue-600 font-medium">
                      {selectedAppointment.vaccineName}
                    </span>
                  </Descriptions.Item>
                  <Descriptions.Item label="Liều số">
                    <Tag color="purple">
                      Liều {selectedAppointment.doseNumber}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Ngày tiêm">
                    {dayjs(selectedAppointment.scheduledDate).format(
                      'DD/MM/YYYY'
                    )}
                  </Descriptions.Item>
                  <Descriptions.Item label="Giờ tiêm">
                    <Tag color="cyan" icon={<CalendarOutlined />}>
                      {selectedAppointment.scheduledTime}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Trung tâm">
                    {selectedAppointment.centerName}
                  </Descriptions.Item>
                  {selectedAppointment.notes && (
                    <Descriptions.Item label="Ghi chú">
                      {selectedAppointment.notes}
                    </Descriptions.Item>
                  )}
                </Descriptions>
              </div>

              {/* Patient Contact Section */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <MessageOutlined className="text-blue-600" />
                    Liên hệ bệnh nhân
                  </h3>
                  {selectedAppointment.status !== 'COMPLETED' &&
                    selectedAppointment.status !== 'CANCELLED' && (
                      <Button
                        type="primary"
                        icon={<MessageOutlined />}
                        onClick={() => handleOpenChat(selectedAppointment)}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 border-0"
                      >
                        Nhắn tin tư vấn
                      </Button>
                    )}
                </div>
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">
                    💡 Sử dụng tính năng chat để tư vấn cho bệnh nhân trước khi
                    tiêm chủng. Bạn có thể hỏi về tình trạng sức khỏe, dị ứng,
                    hoặc giải đáp thắc mắc.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t">
                {selectedAppointment.status === 'ASSIGNED' && (
                  <Button
                    type="primary"
                    size="large"
                    block
                    icon={<CheckOutlined />}
                    loading={loading}
                    onClick={() =>
                      handleAcceptAppointment(selectedAppointment.appointmentId)
                    }
                    className="h-10 font-semibold bg-gradient-to-r from-blue-500 to-cyan-500 border-0"
                  >
                    Xác nhận đảm nhiệm ca tiêm này
                  </Button>
                )}
                {selectedAppointment.status === 'CONFIRMED' && (
                  <Button
                    type="primary"
                    size="large"
                    block
                    icon={<CheckOutlined />}
                    loading={loading}
                    onClick={() =>
                      handleComplete(selectedAppointment.appointmentId)
                    }
                    className="h-10 font-semibold bg-gradient-to-r from-green-500 to-emerald-500 border-0"
                  >
                    Hoàn thành ca tiêm này
                  </Button>
                )}
                <Button
                  size="large"
                  block
                  icon={<CloseOutlined />}
                  onClick={closeDrawer}
                  className="h-10 font-semibold"
                >
                  Đóng
                </Button>
              </div>
            </>
          )}
        </Drawer>

        {/* Chat Modal */}
        <ChatModal
          visible={chatVisible}
          onClose={() => {
            setChatVisible(false);
            setSelectedPatient(null);
          }}
          appointment={selectedAppointment}
          currentUser={{
            walletAddress: user?.walletAddress || user?.email,
            fullName: user?.fullName,
            role: 'DOCTOR',
          }}
          otherUser={selectedPatient}
        />
      </div>
    </div>
  );
};

export default MySchedulePage;
