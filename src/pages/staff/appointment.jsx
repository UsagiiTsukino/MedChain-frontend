/* eslint-disable no-unused-vars */
import { useRef, useState } from 'react';
import queryString from 'query-string';
import { sfLike } from 'spring-filter-query-builder';
import { Badge, Button, Space, Tag, Typography, Tooltip, Avatar } from 'antd';
import {
  EditOutlined,
  CalendarOutlined,
  UserOutlined,
  MedicineBoxOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';

import DataTable from '../../components/data-table';
import ModalAppointment from '../../components/modal/modal.appointment';
import { useDispatch, useSelector } from 'react-redux';
import { getColorStatus } from '../../utils/status';
import { fetchAppointmentOfCenter } from '../../redux/slice/appointmentSlice';
import dayjs from 'dayjs';

const AppointmentPage = () => {
  const tableRef = useRef();

  const isFetching = useSelector((state) => state.appointment.isFetching);
  const meta = useSelector((state) => state.appointment.meta);
  const appointments = useSelector((state) => state.appointment.result);
  const user = useSelector((state) => state.account.user);
  const dispatch = useDispatch();

  const reloadTable = () => {
    tableRef?.current?.reload();
  };

  const [dataInit, setDataInit] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const getStatusConfig = (status) => {
    const configs = {
      SCHEDULED: {
        color: 'warning',
        text: 'Đã lên lịch',
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
      RESCHEDULED: {
        color: 'warning',
        text: 'Đổi lịch',
        icon: <ClockCircleOutlined />,
      },
    };
    return configs[status] || configs.SCHEDULED;
  };

  const columns = [
    {
      title: 'STT',
      key: 'index',
      width: 60,
      align: 'center',
      fixed: 'left',
      render: (text, record, index) => (
        <span className="font-semibold text-gray-600">{index + 1}</span>
      ),
      hideInSearch: true,
    },
    {
      title: 'Bệnh nhân',
      dataIndex: 'patientName',
      width: 180,
      render: (text, record) => (
        <div className="flex items-center gap-3">
          <Avatar
            size={40}
            className="bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-md"
          >
            {text?.charAt(0)}
          </Avatar>
          <div>
            <div className="font-semibold text-gray-900">{text}</div>
            <div className="text-xs text-gray-500">ID: #{record.id}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Vaccine',
      dataIndex: 'vaccineName',
      width: 180,
      render: (text) => (
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
            <MedicineBoxOutlined className="text-green-600" />
          </div>
          <Tooltip title={text}>
            <span className="font-medium text-gray-900">
              {text?.length > 20 ? text.slice(0, 20) + '...' : text}
            </span>
          </Tooltip>
        </div>
      ),
    },
    {
      title: 'Trung tâm',
      dataIndex: 'centerName',
      width: 200,
      ellipsis: true,
      render: (text) => (
        <div className="flex items-center gap-2">
          <EnvironmentOutlined className="text-red-500" />
          <Tooltip title={text}>
            <span className="text-gray-700">
              {text?.length > 25 ? text.slice(0, 25) + '...' : text}
            </span>
          </Tooltip>
        </div>
      ),
    },
    {
      title: 'Lịch hẹn',
      width: 180,
      render: (_, record) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-gray-900">
            <CalendarOutlined className="text-orange-500" />
            <span className="font-medium">
              {record.scheduledDate
                ? dayjs(record.scheduledDate).format('DD/MM/YYYY')
                : 'N/A'}
            </span>
          </div>
          <div className="flex items-center gap-2 text-gray-500 text-xs">
            <ClockCircleOutlined />
            {record.scheduledTime || 'N/A'}
          </div>
        </div>
      ),
    },
    {
      title: 'Bác sĩ',
      dataIndex: 'doctorName',
      width: 150,
      render: (text) => {
        return text ? (
          <Badge
            color="green"
            text={<span className="text-gray-700 font-medium">{text}</span>}
          />
        ) : (
          <Badge
            color="red"
            text={<span className="text-gray-500 italic">Chưa chỉ định</span>}
          />
        );
      },
    },
    {
      title: 'Thu Ngân',
      dataIndex: 'cashierName',
      width: 150,
      render: (text) => {
        return text ? (
          <Badge
            color="green"
            text={<span className="text-gray-700 font-medium">{text}</span>}
          />
        ) : (
          <Badge
            color="red"
            text={<span className="text-gray-500 italic">Chưa chỉ định</span>}
          />
        );
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
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
      render: (_value, entity) =>
        entity.status === 'SCHEDULED' ? (
          <Space>
            <Button
              type="primary"
              icon={<EditOutlined />}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 border-0 shadow-md hover:shadow-lg"
              onClick={() => {
                setOpenModal(true);
                setDataInit(entity);
              }}
            >
              Xác nhận
            </Button>
          </Space>
        ) : (
          <Tag color="default" className="text-gray-500">
            Đã xử lý
          </Tag>
        ),
    },
  ];

  const buildQuery = (params, sort) => {
    const clone = { ...params };

    // Get centerId from logged-in user
    const centerId = user?.centerId;

    const q = {
      centerId: centerId || '', // Pass centerId to backend
      page: params.current - 1, // Convert to 0-based
      size: params.pageSize,
    };

    return queryString.stringify(q);
  };

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
          Quản lý Lịch hẹn
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Xác nhận và quản lý các lịch hẹn tiêm chủng
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
              Danh sách lịch hẹn
            </span>
          </div>
        }
        rowKey="id"
        loading={isFetching}
        columns={columns}
        dataSource={appointments}
        request={async (params, sort, filter) => {
          const query = buildQuery(params, sort, filter);
          dispatch(fetchAppointmentOfCenter({ query }));
        }}
        scroll={{ x: 1400 }}
        pagination={{
          current: meta.page !== undefined ? meta.page + 1 : 1, // Convert 0-based to 1-based
          pageSize: meta.pageSize,
          showSizeChanger: true,
          total: meta.total,
          showTotal: (total, range) => {
            return (
              <div>
                {range[0]}-{range[1]} trên tổng số {total} lịch hẹn
              </div>
            );
          },
        }}
        rowSelection={false}
      />
      <ModalAppointment
        openModal={openModal}
        setOpenModal={setOpenModal}
        reloadTable={reloadTable}
        dataInit={dataInit}
        setDataInit={setDataInit}
      />
    </>
  );
};

export default AppointmentPage;
