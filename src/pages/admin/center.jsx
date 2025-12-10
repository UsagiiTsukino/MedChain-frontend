import { useDispatch, useSelector } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import queryString from 'query-string';
import { sfLike } from 'spring-filter-query-builder';
import {
  Button,
  message,
  notification,
  Popconfirm,
  Space,
  Tag,
  Avatar,
  Tooltip,
  Image,
} from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  HomeOutlined,
} from '@ant-design/icons';

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
      width: 60,
      align: 'center',
      fixed: 'left',
      render: (text, record, index) => (
        <span className="font-semibold text-gray-600">
          {index + 1 + (meta.page || 0) * (meta.pageSize || 20)}
        </span>
      ),
      hideInSearch: true,
    },
    {
      title: 'Trung tâm',
      dataIndex: 'name',
      width: 300,
      sorter: true,
      render: (text, record) => (
        <div className="flex items-center gap-3">
          <Image
            src={'http://localhost:8080/storage/center/' + record.image}
            alt="center"
            width={56}
            height={56}
            className="rounded-xl object-cover shadow-md"
            preview={{
              mask: 'Đồ XEM',
            }}
          />
          <div>
            <div className="font-semibold text-gray-900 mb-1">{text}</div>
            <Tag color="blue" icon={<HomeOutlined />} className="text-xs">
              Trung tâm tiêm chủng
            </Tag>
          </div>
        </div>
      ),
    },
    {
      title: 'Thông tin liên hệ',
      width: 280,
      hideInSearch: true,
      render: (_, record) => (
        <div className="space-y-2">
          <Tooltip title={record.address}>
            <div className="flex items-center gap-2">
              <EnvironmentOutlined className="text-red-500" />
              <span className="text-sm text-gray-600 truncate">
                {record.address || 'N/A'}
              </span>
            </div>
          </Tooltip>
          <div className="flex items-center gap-2">
            <PhoneOutlined className="text-green-500" />
            <span className="text-sm text-gray-600">
              {record.phoneNumber || 'N/A'}
            </span>
          </div>
        </div>
      ),
    },
    {
      title: 'Sức chứa',
      dataIndex: 'capacity',
      width: 120,
      align: 'center',
      hideInSearch: true,
      sorter: true,
      render: (text) => (
        <Tag color="purple" className="px-3 py-1 text-sm font-semibold">
          <TeamOutlined /> {text || 0} người
        </Tag>
      ),
    },
    {
      title: 'Giờ làm việc',
      dataIndex: 'workingHours',
      width: 150,
      hideInSearch: true,
      render: (text) => (
        <div className="flex items-center gap-2">
          <ClockCircleOutlined className="text-orange-500" />
          <span className="text-sm text-gray-600">{text || 'N/A'}</span>
        </div>
      ),
    },
    {
      title: 'Thao tác',
      hideInSearch: true,
      width: 120,
      fixed: 'right',
      align: 'center',
      render: (_value, entity) => (
        <Space size="middle">
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              icon={<EditOutlined />}
              className="text-orange-500 hover:text-orange-600 hover:bg-orange-50"
              onClick={() => {
                setOpenModal(true);
                setDataInit(entity);
              }}
            />
          </Tooltip>

          <Popconfirm
            placement="leftTop"
            title="Xác nhận xóa cơ sở"
            description="Bạn có chắc chắn muốn xóa cơ sở tiêm chủng này?"
            onConfirm={() => handleDeleteCompany(entity.centerId)}
            okText="Xác nhận"
            cancelText="Hủy"
          >
            <Tooltip title="Xóa">
              <Button
                type="text"
                icon={<DeleteOutlined />}
                className="text-red-500 hover:text-red-600 hover:bg-red-50"
                danger
              />
            </Tooltip>
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
      <div className="mb-6">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
          Quản lý Trung tâm
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Danh sách và thông tin các trung tâm tiêm chủng
        </p>
      </div>

      <DataTable
        actionRef={tableRef}
        headerTitle={
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
              <HomeOutlined className="text-white text-lg" />
            </div>
            <span className="text-lg font-semibold text-gray-900">
              Danh sách trung tâm
            </span>
          </div>
        }
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
        toolBarRender={() => [
          <Button
            key="button"
            icon={<PlusOutlined />}
            type="primary"
            size="large"
            className="bg-gradient-to-r from-green-600 to-emerald-600 border-0 h-10 px-6 font-semibold shadow-md hover:shadow-lg rounded-lg"
            onClick={() => setOpenModal(true)}
          >
            Thêm trung tâm
          </Button>,
        ]}
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
