import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { EditOutlined } from '@ant-design/icons';
import queryString from 'query-string';

import DataTable from '../../components/data-table';
import { fetchRole } from '../../redux/slice/roleSlice';
import { callFetchPermission } from '../../config/api.permission';
import { groupByPermission } from '../../config/utils';
import ModalRole from '../../components/modal/modal.role';

const RolePage = () => {
  const tableRef = useRef();

  const isFetching = useSelector((state) => state.role.isFetching);
  const meta = useSelector((state) => state.role.meta);
  const dispatch = useDispatch();

  const [openModal, setOpenModal] = useState(false);
  const [listPermissions, setListPermissions] = useState();
  const [singleRole, setSingleRole] = useState();
  useEffect(() => {
    const init = async () => {
      const res = await callFetchPermission('page=1&size=100');
      if (res.data?.result) {
        setListPermissions(groupByPermission(res.data?.result));
      }
    };
    init();
  }, []);

  const columns = [
    {
      title: 'STT',
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
      title: 'Name',
      dataIndex: 'name',
      sorter: true,
    },

    {
      title: 'Actions',
      hideInSearch: true,
      width: 50,
      render: (_value, entity) => (
        <EditOutlined
          style={{
            fontSize: 20,
            color: '#ffa500',
          }}
          onClick={() => {
            setSingleRole(entity);
            setOpenModal(true);
          }}
        />
      ),
    },
  ];

  const buildQuery = (params, sort) => {
    const clone = { ...params };
    const q = {};

    // Backend role API doesn't use pagination, just uses q parameter for search
    if (clone.name) {
      q.q = clone.name;
    }

    let temp = queryString.stringify(q);

    let sortBy = '';
    if (sort && sort.name) {
      sortBy = sort.name === 'ascend' ? 'sort=name,asc' : 'sort=name,desc';
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
        headerTitle="List Role"
        rowKey="id"
        loading={isFetching}
        columns={columns}
        request={async (params, sort, filter) => {
          const query = buildQuery(params, sort, filter);
          console.log('[RolePage] Request params:', params);
          console.log('[RolePage] Built query:', query);
          // Dispatch and wait for result
          const resultAction = await dispatch(fetchRole({ query }));
          console.log('[RolePage] Result action:', resultAction);
          // Get the fulfilled action result
          if (resultAction.type === 'role/fetchRole/fulfilled') {
            const payload = resultAction.payload?.data || resultAction.payload;
            console.log('[RolePage] Payload:', payload);
            // Backend returns { items, total } format
            const result = {
              data: payload?.items || payload?.result || [],
              success: true,
              total: payload?.total || payload?.meta?.total || 0,
            };
            console.log('[RolePage] Returning result:', result);
            return result;
          }
          console.warn('[RolePage] Request not fulfilled:', resultAction);
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
                {range[0]}-{range[1]} trên {total} rows
              </div>
            );
          },
        }}
        rowSelection={false}
      />
      <ModalRole
        openModal={openModal}
        setOpenModal={setOpenModal}
        listPermissions={listPermissions}
        singleRole={singleRole}
        setSingleRole={setSingleRole}
      />
    </>
  );
};
export default RolePage;
