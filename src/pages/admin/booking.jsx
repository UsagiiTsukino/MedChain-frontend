import { useRef } from 'react';
import DataTable from '../../components/data-table';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBooking } from '../../redux/slice/bookingSlice';
import { sfLike } from 'spring-filter-query-builder';
import queryString from 'query-string';
import { Table, Tag } from 'antd';
import { getColorStatus } from '../../utils/status';

const BookingManager = () => {
  const tableRef = useRef();
  const reloadTable = () => {
    tableRef?.current?.reload();
  };

  const isFetching = useSelector((state) => state.booking.isFetching);
  const meta = useSelector((state) => state.booking.meta);
  const bookings = useSelector((state) => state.booking.result);
  const { appointments } = bookings;
  const dispatch = useDispatch();

  const buildQuery = (params, sort) => {
    const clone = { ...params };
    const q = {
      page: params.current,
      size: params.pageSize,
      filter: '',
    };

    if (clone.fullname) q.filter = `${sfLike('fullname', clone.fullname)}`;
    if (clone.email) {
      q.filter = clone.fullname
        ? q.filter + ' and ' + `${sfLike('email', clone.email)}`
        : `${sfLike('email', clone.email)}`;
    }
    if (clone.address) {
      q.filter = q.filter
        ? `${q.filter} and ${sfLike('address', clone.address)}`
        : `${sfLike('address', clone.address)}`;
    }

    if (!q.filter) delete q.filter;

    let temp = queryString.stringify(q);

    let sortBy = '';
    if (sort && sort.fullname) {
      sortBy =
        sort.fullname === 'ascend' ? 'sort=fullname,asc' : 'sort=fullname,desc';
    }
    if (sort && sort.email) {
      sortBy = sort.email === 'ascend' ? 'sort=email,asc' : 'sort=email,desc';
    }
    if (sort && sort.address) {
      sortBy =
        sort.address === 'ascend' ? 'sort=address,asc' : 'sort=address,desc';
    }
    temp = `${temp}&${sortBy}`;

    return temp;
  };

  const expandColumns = [
    {
      title: 'Thứ tự mũi',
      dataIndex: 'doseNumber',
      hideInSearch: true,
    },
    {
      title: 'Ngày tiêm',
      dataIndex: 'scheduledDate',
      hideInSearch: true,
    },
    {
      title: 'Giờ tiêm',
      dataIndex: 'scheduledTime',
      hideInSearch: true,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      render: (text) => {
        return (
          <Tag bordered={false} color={getColorStatus(text)}>
            {text}
          </Tag>
        );
      },
      hideInSearch: true,
    },
  ];

  const columns = [
    {
      title: 'STT',
      key: 'index',
      width: 50,
      align: 'center',
      hideInSearch: true,
      render: (text, record, index) => {
        return <>{index + 1 + (meta.page - 1) * meta.pageSize}</>;
      },
    },
    {
      title: 'Bệnh nhân',
      dataIndex: 'patientName',
      hideInSearch: true,
    },
    {
      title: 'Vaccine',
      dataIndex: 'vaccineName',
      hideInSearch: true,
    },
    {
      title: 'Trung tâm',
      dataIndex: 'centerName',
      hideInSearch: true,
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalAmount',
      hideInSearch: true,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      hideInSearch: true,
      render: (text) => {
        return (
          <Tag bordered={false} color={getColorStatus(text)}>
            {text}
          </Tag>
        );
      },
    },
  ];

  const expandedRowRender = (record) => (
    <Table
      columns={expandColumns}
      dataSource={record.appointments}
      pagination={false}
    />
  );

  return (
    <>
      <DataTable
        actionRef={tableRef}
        headerTitle="Danh sách booking"
        rowKey="id"
        loading={isFetching}
        columns={columns}
        dataSource={bookings}
        request={async (params, sort, filter) => {
          const query = buildQuery(params, sort, filter);
          dispatch(fetchBooking({ query }));
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
        expandable={{ expandedRowRender, defaultExpandedRowKeys: ['0'] }}
      />
    </>
  );
};

export default BookingManager;
