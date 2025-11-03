import { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Badge, Button, message, notification, Popconfirm, Space } from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  MenuUnfoldOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { sfLike } from 'spring-filter-query-builder';
import queryString from 'query-string';

import DataTable from '../../components/data-table';
import { callDeletePermission } from '../../config/api.permission';
import { fetchPermission } from '../../redux/slice/permissionSlice';
import ModalPermission from '../../components/modal/modal.permission';
import ViewDetailPermission from '../../components/modal/view.permission';
import { blue, green, orange, red } from '@ant-design/colors';

const PermissionPage = () => {
  const tableRef = useRef();
  const reloadTable = () => {
    tableRef?.current?.reload();
  };

  const [dataInit, setDataInit] = useState(null);

  const isFetching = useSelector((state) => state.permission.isFetching);
  const meta = useSelector((state) => state.permission.meta);
  const permissions = useSelector((state) => state.permission.result);

  const dispatch = useDispatch();

  const [openModal, setOpenModal] = useState(false);
  const [openViewDetail, setOpenViewDetail] = useState(false);

  const handleDeletePermission = async (id) => {
    if (id) {
      const res = await callDeletePermission(id);
      if (res && +res.statusCode === 200) {
        message.success('Permission deleted successfully');
        reloadTable();
      } else {
        notification.error({
          message: 'An error occurred',
          description: res.message,
        });
      }
    }
  };

  const columns = [
    {
      title: 'No.',
      key: 'index',
      width: 50,
      align: 'center',
      render: (text, record, index) => {
        // Backend returns 0-based page, so use meta.page directly
        return <>{index + 1 + (meta.page || 0) * (meta.pageSize || 20)}</>;
      },
      hideInSearch: true,
    },
    {
      title: 'API',
      dataIndex: 'apiPath',
      sorter: true,
    },
    {
      title: 'Method',
      dataIndex: 'method',
      render: (_value, entity) => {
        let color;
        switch (entity.method) {
          case 'PUT':
            color = orange[6];
            break;
          case 'GET':
            color = blue[6];
            break;
          case 'DELETE':
            color = red[6];
            break;
          default:
            color = green[6];
        }
        return <Badge count={entity.method} showZero color={color} />;
      },
    },
    {
      title: 'Name',
      dataIndex: 'name',
      hideInSearch: true,
    },
    {
      title: 'Module',
      dataIndex: 'module',
    },
    {
      title: 'Actions',
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
          <MenuUnfoldOutlined
            style={{
              fontSize: 20,
              color: '#1890ff',
            }}
            onClick={() => {
              setOpenViewDetail(true);
              setDataInit(entity);
            }}
          />

          <Popconfirm
            placement="leftTop"
            title="Confirm delete this permission?"
            description="Are you sure you want to delete this permission?"
            onConfirm={() => handleDeletePermission(entity.id)}
            okText="Confirm"
            cancelText="Cancel"
          >
            <span style={{ cursor: 'pointer', margin: '0' }}>
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
    const q = {};

    // Backend permission API uses q and module parameters, no pagination
    if (clone.apiPath) {
      q.q = clone.apiPath; // Use q for search
    }
    if (clone.module) {
      q.module = clone.module;
    }
    if (clone.method) {
      // If method is provided, we might need to add it to filter
      // But backend only supports q and module, so we'll use q for method search
      if (!q.q) {
        q.q = clone.method;
      }
    }

    let temp = queryString.stringify(q);

    let sortBy = '';
    if (sort && sort.apiPath) {
      sortBy =
        sort.apiPath === 'ascend' ? 'sort=apiPath,asc' : 'sort=apiPath,desc';
    }

    // Only append sortBy if it's not empty
    if (sortBy) {
      temp = `${temp}&${sortBy}`;
    }

    return temp;
  };

  return (
    <>
      <DataTable
        actionRef={tableRef}
        headerTitle="Permission List"
        rowKey="id"
        loading={isFetching}
        columns={columns}
        request={async (params, sort, filter) => {
          const query = buildQuery(params, sort, filter);
          console.log('[PermissionPage] Request params:', params);
          console.log('[PermissionPage] Built query:', query);
          // Dispatch and wait for result
          const resultAction = await dispatch(fetchPermission({ query }));
          console.log('[PermissionPage] Result action:', resultAction);
          // Get the fulfilled action result
          if (resultAction.type === 'permission/fetchPermission/fulfilled') {
            const payload = resultAction.payload?.data || resultAction.payload;
            console.log('[PermissionPage] Payload:', payload);
            // Backend returns { items, total } format
            const result = {
              data: payload?.items || payload?.result || [],
              success: true,
              total: payload?.total || payload?.meta?.total || 0,
            };
            console.log('[PermissionPage] Returning result:', result);
            return result;
          }
          console.warn('[PermissionPage] Request not fulfilled:', resultAction);
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
                {range[0]}-{range[1]} of {total} rows
              </div>
            );
          },
        }}
        rowSelection={false}
        toolBarRender={() => {
          return (
            <Button
              icon={<PlusOutlined />}
              type="primary"
              onClick={() => setOpenModal(true)}
            >
              Add new
            </Button>
          );
        }}
      />
      <ModalPermission
        openModal={openModal}
        setOpenModal={setOpenModal}
        reloadTable={reloadTable}
        dataInit={dataInit}
        setDataInit={setDataInit}
      />
      <ViewDetailPermission
        onClose={setOpenViewDetail}
        open={openViewDetail}
        dataInit={dataInit}
        setDataInit={setDataInit}
      />
    </>
  );
};
export default PermissionPage;
