/* eslint-disable no-undef */
import { useEffect, useRef, useState } from 'react';
import {
  Badge,
  Button,
  Popconfirm,
  Space,
  Tag,
  message,
  notification,
} from 'antd';
import { CheckOutlined } from '@ant-design/icons';

import DataTable from '../../components/data-table';
import { callCompleteAppointment } from '../../config/api.appointment';
import queryString from 'query-string';
import { sfLike } from 'spring-filter-query-builder';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAppointmentOfDoctor } from '../../redux/slice/appointmentSlice';
import { getColorStatus } from '../../utils/status';

const MySchedulePage = () => {
  const tableRef = useRef();

  const isFetching = useSelector((state) => state.appointment.isFetching);
  const meta = useSelector((state) => state.appointment.meta);
  const appointments = useSelector((state) => state.appointment.result);
  const dispatch = useDispatch();

  const reloadTable = () => {
    tableRef?.current?.reload();
  };

  const handleComplete = async (id) => {
    if (id) {
      const res = await callCompleteAppointment(id);
      if (res) {
        message.success('Hoàn thành lịch hẹn thành công');
        reloadTable();
      } else {
        notification.error({
          message: res.error,
          description: res.message,
        });
      }
    }
  };

  const columns = [
    {
      title: 'STT',
      key: 'index',
      width: 50,
      align: 'center',
      render: (text, record, index) => index + 1,
      hideInSearch: true,
    },
    {
      title: 'Vaccine',
      dataIndex: 'vaccineName',
    },
    {
      title: 'Bệnh nhân',
      dataIndex: 'patientName',
    },
    {
      title: 'Trung tâm',
      dataIndex: 'centerName',
    },
    {
      title: 'Ngày tiêm',
      dataIndex: 'scheduledDate',
    },
    {
      title: 'Giờ tiêm',
      dataIndex: 'scheduledTime',
    },
    {
      title: 'Bác sĩ',
      dataIndex: 'doctorName',
      render: (text) => {
        return text ? (
          <Badge color="green" text={text} />
        ) : (
          <Badge color="red" text="Cập nhật" />
        );
      },
    },
    {
      title: 'Thu Ngân',
      dataIndex: 'cashierName',
      render: (text) => {
        return text ? (
          <Badge color="green" text={text} />
        ) : (
          <Badge color="red" text="Cập nhật" />
        );
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      render: (text) => {
        return <Tag color={getColorStatus(text)}>{text}</Tag>;
      },
    },
    {
      title: 'Thao tác',
      render: (_value, entity) =>
        entity.status === 'SCHEDULED' ? (
          <Space>
            <Button type="primary" onClick={() => handleComplete(entity.id)}>
              <CheckOutlined />
              Xác nhận
            </Button>
          </Space>
        ) : null,
    },
  ];

  const buildQuery = (params, sort) => {
    const clone = { ...params };
    const q = {
      page: params.current,
      size: params.pageSize,
      filter: '',
    };

    if (clone.name) q.filter = `${sfLike('name', clone.name)}`;
    if (clone.manufacturer) {
      q.filter = clone.name
        ? q.filter + ' and ' + `${sfLike('manufacturer', clone.manufacturer)}`
        : `${sfLike('manufacturer', clone.manufacturer)}`;
    }

    if (!q.filter) delete q.filter;

    let temp = queryString.stringify(q);

    let sortBy = '';
    if (sort && sort.name) {
      sortBy = sort.name === 'ascend' ? 'sort=name,asc' : 'sort=name,desc';
    }
    if (sort && sort.manufacturer) {
      sortBy =
        sort.manufacturer === 'ascend'
          ? 'sort=manufacturer,asc'
          : 'sort=manufacturer,desc';
    }

    if (sort && sort.price) {
      sortBy = sort.price === 'ascend' ? 'sort=price,asc' : 'sort=price,desc';
    }
    if (sort && sort.stockQuantity) {
      sortBy =
        sort.stockQuantity === 'ascend'
          ? 'sort=stockQuantity,asc'
          : 'sort=stockQuantity,desc';
    }
    temp = `${temp}&${sortBy}`;

    return temp;
  };

  return (
    <>
      <DataTable
        actionRef={tableRef}
        headerTitle="Danh sách lịch hẹn hôm nay"
        rowKey="id"
        loading={isFetching}
        columns={columns}
        dataSource={appointments}
        request={async (params, sort, filter) => {
          const query = buildQuery(params, sort, filter);
          dispatch(fetchAppointmentOfDoctor({ query }));
        }}
        scroll={{ x: true }}
        pagination={{
          current: meta.page,
          pageSize: meta.pageSize,
          showSizeChanger: true,
          total: meta.total,
          showTotal: (total, range) => {
            return (
              <div>
                {range[0]}-{range[1]} trên tổng số {total} dòng
              </div>
            );
          },
        }}
        rowSelection={false}
      />
    </>
  );
};

export default MySchedulePage;
