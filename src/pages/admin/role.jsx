import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { EditOutlined } from '@ant-design/icons';
import { sfLike } from 'spring-filter-query-builder';
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
  const roles = useSelector((state) => state.role.result);
  const dispatch = useDispatch();

  const [openModal, setOpenModal] = useState(false);
  const [listPermissions, setListPermissions] = useState();
  const [singleRole, setSingleRole] = useState();
  useEffect(() => {
    const init = async () => {
      const res = await callFetchPermission('page=1&size=100');
      if (res.data?.result) {
        setListPermissions(groupByPermission(res.data?.result))
      }
    }
    init();
  }, [])

  const columns = [
    {
      title: 'STT',
      key: 'index',
      width: 50,
      align: 'center',
      render: (text, record, index) => {
        return <>{index + 1 + (meta.page - 1) * meta.pageSize}</>;
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
    const q = {
      page: params.current,
      size: params.pageSize,
      filter: '',
    };

    if (clone.name)
      q.filter = `${sfLike('name', clone.name)}`;
    if (clone.manufacturer) {
      q.filter = clone.name
        ? q.filter + ' and ' + `${sfLike('manufacturer', clone.manufacturer)}`
        : `${sfLike('manufacturer', clone.manufacturer)}`;
    }

    if (!q.filter) delete q.filter;

    let temp = queryString.stringify(q);

    let sortBy = '';
    if (sort && sort.name) {
      sortBy =
        sort.name === 'ascend'
          ? 'sort=name,asc'
          : 'sort=name,desc';
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
        headerTitle='List Role'
        rowKey='id'
        loading={isFetching}
        columns={columns}
        dataSource={roles}
        request={async (params, sort, filter) => {
          const query = buildQuery(params, sort, filter);
          dispatch(fetchRole({ query }));
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