import { Badge, Button, message, notification, Popconfirm, Space } from 'antd';
import { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { sfLike } from 'spring-filter-query-builder';
import queryString from 'query-string';

import { callDeleteUser } from '../../config/api.user';
import DataTable from '../../components/data-table';
import { fetchUser } from '../../redux/slice/userSlice';
import ModalUser from '../../components/modal/modal.user';

const UserPage = () => {
  const tableRef = useRef();
  const reloadTable = () => {
    tableRef?.current?.reload();
  };

  const [dataInit, setDataInit] = useState(null);

  const isFetching = useSelector((state) => state.user.isFetching);
  const meta = useSelector((state) => state.user.meta);
  const users = useSelector((state) => state.user.result);
  const dispatch = useDispatch();

  const [openModal, setOpenModal] = useState(false);

  // Debug logging
  useEffect(() => {
    console.log('[UserPage] State updated:', {
      isFetching,
      meta,
      usersCount: users?.length,
      users: users,
    });
  }, [isFetching, meta, users]);

  const handleDeleteUser = async (id) => {
    if (id) {
      const res = await callDeleteUser(id);
      if (res && +res.statusCode === 200) {
        message.success('Xóa người dùng thành công');
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
      hideInSearch: true,
      render: (text, record, index) => {
        // Backend returns 0-based page, so use meta.page directly
        return <>{index + 1 + (meta.page || 0) * (meta.pageSize || 20)}</>;
      },
    },
    {
      title: 'Ví',
      dataIndex: 'walletAddress',
      hideInSearch: true,
    },
    {
      title: 'Họ tên',
      dataIndex: 'fullName',
      sorter: true,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      sorter: true,
    },
    {
      title: 'Điện thoại',
      dataIndex: 'phoneNumber',
      hideInSearch: true,
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      sorter: true,
    },
    {
      title: 'Cơ sở',
      dataIndex: 'centerName',
      hideInSearch: true,
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      hideInSearch: true,
      render: (_value, entity) => {
        let color;
        switch (entity.role) {
          case 'ADMIN':
            color = '#faad14';
            break;
          case 'DOCTOR':
            color = '#52c41a';
            break;
          case 'CASHIER':
            color = '#1890ff';
            break;
          default:
            color = '#d9d9d9';
        }
        return <Badge count={entity.role} showZero color={color} />;
      },
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'birthday',
      hideInSearch: true,
    },
    {
      title: 'Thao tác',
      hideInSearch: true,
      width: 50,
      render: (_value, entity) => (
        <Space>
          <EditOutlined
            style={{
              fontSize: 20,
              color: '#ffa500',
            }}
            onClick={() => {
              setOpenModal(true);
              setDataInit(entity);
            }}
          />

          <Popconfirm
            placement="leftTop"
            title="Xác nhận xóa người dùng"
            description="Bạn có chắc chắn muốn xóa người dùng này?"
            onConfirm={() => handleDeleteUser(entity.userId)}
            okText="Xác nhận"
            cancelText="Hủy"
          >
            <span style={{ cursor: 'pointer', margin: '0 10px' }}>
              <DeleteOutlined
                style={{
                  fontSize: 20,
                  color: '#ff4d4f',
                }}
              />
            </span>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const buildQuery = (params, sort) => {
    const clone = { ...params };
    const q = {
      page: (params.current || 1) - 1, // Backend expects 0-based page
      size: params.pageSize || 10,
      filter: '',
    };

    if (clone.fullName) q.filter = `${sfLike('fullname', clone.fullName)}`;
    if (clone.email) {
      q.filter = clone.fullName
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
    if (sort && sort.fullName) {
      sortBy =
        sort.fullName === 'ascend' ? 'sort=fullname,asc' : 'sort=fullname,desc';
    }
    if (sort && sort.email) {
      sortBy = sort.email === 'ascend' ? 'sort=email,asc' : 'sort=email,desc';
    }
    if (sort && sort.address) {
      sortBy =
        sort.address === 'ascend' ? 'sort=address,asc' : 'sort=address,desc';
    }

    // Only append sortBy if it's not empty
    if (sortBy) {
      temp = `${temp}&${sortBy}`;
    }

    return temp;
  };

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Quản lý Người dùng
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Danh sách và thông tin người dùng trong hệ thống
        </p>
      </div>

      <DataTable
        actionRef={tableRef}
        headerTitle={
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <TeamOutlined className="text-white text-lg" />
            </div>
            <span className="text-lg font-semibold text-gray-900">
              Danh sách người dùng
            </span>
          </div>
        }
        rowKey="userId"
        loading={isFetching}
        columns={columns}
        request={async (params, sort, filter) => {
          const query = buildQuery(params, sort, filter);
          console.log('[UserPage] Request params:', params);
          console.log('[UserPage] Built query:', query);
          // Dispatch and wait for result
          const resultAction = await dispatch(fetchUser({ query }));
          console.log('[UserPage] Result action:', resultAction);
          // Get the fulfilled action result
          if (resultAction.type === 'user/fetchUser/fulfilled') {
            const payload = resultAction.payload?.data || resultAction.payload;
            console.log('[UserPage] Payload:', payload);
            const result = {
              data: payload?.result || [],
              success: true,
              total: payload?.meta?.total || 0,
            };
            console.log('[UserPage] Returning result:', result);
            return result;
          }
          console.warn('[UserPage] Request not fulfilled:', resultAction);
          return {
            data: [],
            success: false,
            total: 0,
          };
        }}
        scroll={{ x: true }}
        pagination={{
          showSizeChanger: true,
          showTotal: (total, range) => {
            return (
              <div>
                {range[0]}-{range[1]} trên tổng số {total} dòng
              </div>
            );
          },
        }}
        rowSelection={false}
        toolBarRender={() => [
          <Button
            key="button"
            type="primary"
            size="large"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 border-0 h-10 px-6 font-semibold shadow-md hover:shadow-lg rounded-lg"
            onClick={() => {
              setOpenModal(true);
              setDataInit(null);
            }}
          >
            <PlusOutlined /> Thêm người dùng
          </Button>,
        ]}
      />
      <ModalUser
        openModal={openModal}
        setOpenModal={setOpenModal}
        reloadTable={reloadTable}
        dataInit={dataInit}
        setDataInit={setDataInit}
      />
    </>
  );
};

export default UserPage;
