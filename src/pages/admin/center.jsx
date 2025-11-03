import { useDispatch, useSelector } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import queryString from 'query-string';
import { sfLike } from 'spring-filter-query-builder';
import { Button, message, notification, Popconfirm, Space } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';

import { fetchCenter } from '../../redux/slice/centerSlice';
import DataTable from '../../components/data-table';
import ModalCenter from '../../components/modal/modal.center';
import { callDeleteCenter } from '../../config/api.center';

const CenterPage = () => {
  const tableRef = useRef();

  const reloadTable = () => {
    tableRef?.current?.reload();
  };

  const [dataInit, setDataInit] = useState(null);

  const isFetching = useSelector((state) => state.center.isFetching);
  const meta = useSelector((state) => state.center.meta);
  const centers = useSelector((state) => state.center.result);
  const dispatch = useDispatch();
  const [openModal, setOpenModal] = useState(false);

  // Debug logging
  useEffect(() => {
    console.log('[CenterPage] State updated:', {
      isFetching,
      meta,
      centersCount: centers?.length,
      centers: centers,
    });
  }, [isFetching, meta, centers]);

  const handleDeleteCompany = async (id) => {
    if (id) {
      const res = await callDeleteCenter(id);
      if (res && +res.statusCode === 200) {
        message.success('Xóa cơ sở tiêm chủng thành công');
        reloadTable();
      } else {
        notification.error({
          message: 'Đã xảy ra lỗi',
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
      render: (text, record, index) => {
        return <>{index + 1 + (meta.page - 1) * meta.pageSize}</>;
      },
      hideInSearch: true,
    },
    {
      title: 'Hình ảnh',
      dataIndex: 'image',
      hideInSearch: true,
      render: (text) => (
        <img
          src={'http://localhost:8080/storage/center/' + text}
          alt="center"
          style={{
            width: '50px',
            height: 'auto',
            objectFit: 'cover',
            borderRadius: '8px',
          }}
        />
      ),
    },
    {
      title: 'Tên cơ sở',
      dataIndex: 'name',
      sorter: true,
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      sorter: true,
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phoneNumber',
      hideInSearch: true,
    },
    {
      title: 'Sức chứa',
      dataIndex: 'capacity',
      hideInSearch: true,
      sorter: true,
    },
    {
      title: 'Giờ làm việc',
      hideInSearch: true,
      dataIndex: 'workingHours',
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
            title="Xác nhận xóa cơ sở"
            description="Bạn có chắc chắn muốn xóa cơ sở tiêm chủng này?"
            onConfirm={() => handleDeleteCompany(entity.centerId)}
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

    if (clone.name) q.filter = `${sfLike('name', clone.name)}`;
    if (clone.address) {
      q.filter = clone.name
        ? q.filter + ' and ' + `${sfLike('address', clone.address)}`
        : `${sfLike('address', clone.address)}`;
    }

    if (!q.filter) delete q.filter;

    let temp = queryString.stringify(q);

    let sortBy = '';
    if (sort && sort.name) {
      sortBy = sort.name === 'ascend' ? 'sort=name,asc' : 'sort=name,desc';
    }
    if (sort && sort.address) {
      sortBy =
        sort.address === 'ascend' ? 'sort=address,asc' : 'sort=address,desc';
    }
    if (sort && sort.capacity) {
      sortBy =
        sort.capacity === 'ascend' ? 'sort=capacity,asc' : 'sort=capacity,desc';
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
        headerTitle="Danh sách cơ sở tiêm chủng"
        rowKey="centerId"
        loading={isFetching}
        columns={columns}
        request={async (params, sort, filter) => {
          const query = buildQuery(params, sort, filter);
          console.log('[CenterPage] Request params:', params);
          console.log('[CenterPage] Built query:', query);
          // Dispatch and wait for result
          const resultAction = await dispatch(fetchCenter({ query }));
          console.log('[CenterPage] Result action:', resultAction);
          // Get the fulfilled action result
          if (resultAction.type === 'center/fetchCenter/fulfilled') {
            const payload = resultAction.payload?.data || resultAction.payload;
            console.log('[CenterPage] Payload:', payload);
            const result = {
              data: payload?.result || [],
              success: true,
              total: payload?.meta?.total || 0,
            };
            console.log('[CenterPage] Returning result:', result);
            return result;
          }
          console.warn('[CenterPage] Request not fulfilled:', resultAction);
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
        toolBarRender={() => {
          return (
            <Button
              icon={<PlusOutlined />}
              type="primary"
              onClick={() => setOpenModal(true)}
            >
              Thêm mới
            </Button>
          );
        }}
      />
      <ModalCenter
        openModal={openModal}
        setOpenModal={setOpenModal}
        reloadTable={reloadTable}
        dataInit={dataInit}
        setDataInit={setDataInit}
      />
    </>
  );
};
export default CenterPage;
