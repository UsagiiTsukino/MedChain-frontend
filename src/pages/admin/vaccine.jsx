import { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  message,
  notification,
  Popconfirm,
  Space,
  Tooltip,
  Tag,
  Avatar,
  Image,
} from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  MedicineBoxOutlined,
  DollarOutlined,
  SafetyOutlined,
} from '@ant-design/icons';
import { sfLike } from 'spring-filter-query-builder';
import queryString from 'query-string';

import { callDeleteVaccine } from '../../config/api.vaccine';
import DataTable from '../../components/data-table';
import { fetchVaccine } from '../../redux/slice/vaccineSlice';
import ModalVaccine from '../../components/modal/modal.vaccine';

const VaccinePage = () => {
  const tableRef = useRef();
  const reloadTable = () => {
    tableRef?.current?.reload();
  };

  const [dataInit, setDataInit] = useState([]);

  const isFetching = useSelector((state) => state.vaccine.isFetching);
  const meta = useSelector((state) => state.vaccine.meta);
  const vaccines = useSelector((state) => state.vaccine.result);
  const dispatch = useDispatch();

  const [openModal, setOpenModal] = useState(false);

  const handleDeleteVaccine = async (id) => {
    if (id) {
      const res = await callDeleteVaccine(id);
      if (res && +res.statusCode === 200) {
        message.success('Xóa vaccine thành công');
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
      render: (text, record, index) => {
        return (
          <span className="font-semibold text-gray-600">
            {index + 1 + (meta.page - 1) * meta.pageSize}
          </span>
        );
      },
      hideInSearch: true,
    },
    {
      title: 'Tên Vaccine',
      dataIndex: 'name',
      sorter: true,
      width: 300,
      render: (text, record) => (
        <div className="flex items-center gap-3">
          <Avatar
            size={48}
            icon={<SafetyOutlined />}
            className="bg-gradient-to-br from-purple-500 to-pink-600"
          />
          <div className="flex flex-col">
            <span className="font-semibold text-gray-900">{text}</span>
            <Tag color="purple" className="w-fit mt-1">
              {record.manufacturer}
            </Tag>
          </div>
        </div>
      ),
    },
    {
      title: 'Quốc gia',
      dataIndex: 'country',
      width: 120,
      hideInSearch: true,
      render: (text) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: 'Bệnh',
      dataIndex: 'disease',
      width: 150,
      render: (text) => (
        <Tooltip title={text}>
          <Tag color="orange" className="max-w-full truncate">
            {text}
          </Tag>
        </Tooltip>
      ),
    },
    {
      title: 'Lịch tiêm',
      dataIndex: 'schedule',
      width: 150,
      hideInSearch: true,
      render: (text) => (
        <Tooltip title={text}>
          <span className="text-gray-600">
            {text.length > 20 ? text.slice(0, 20) + '...' : text}
          </span>
        </Tooltip>
      ),
    },
    {
      title: 'Hiệu quả',
      dataIndex: 'efficacy',
      width: 100,
      hideInSearch: true,
      render: (text) => (
        <Tag color="green" className="font-semibold">
          {text}%
        </Tag>
      ),
    },
    {
      title: 'Đối tượng',
      dataIndex: 'target',
      width: 150,
      hideInSearch: true,
      render: (text) => (
        <Tooltip title={text}>
          <span className="text-gray-600">
            {text.length > 20 ? text.slice(0, 20) + '...' : text}
          </span>
        </Tooltip>
      ),
    },
    {
      title: 'Liều lượng',
      dataIndex: 'dosage',
      width: 120,
      hideInSearch: true,
      render: (text) => <Tag color="cyan">{text}</Tag>,
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      width: 150,
      hideInSearch: true,
      sorter: true,
      render: (value) => {
        return (
          <div className="flex items-center gap-2">
            <DollarOutlined className="text-lg bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent" />
            <span className="font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND',
              }).format(value)}
            </span>
          </div>
        );
      },
    },
    {
      title: 'Tồn kho',
      dataIndex: 'stockQuantity',
      width: 100,
      hideInSearch: true,
      render: (value) => (
        <Tag color={value > 50 ? 'green' : value > 10 ? 'orange' : 'red'}>
          {value}
        </Tag>
      ),
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      width: 200,
      hideInSearch: true,
      render: (text) => (
        <Tooltip title={text}>
          <span className="text-gray-600">
            {text.length > 50 ? text.slice(0, 50) + '...' : text}
          </span>
        </Tooltip>
      ),
    },
    {
      title: 'Thao tác',
      hideInSearch: true,
      width: 120,
      fixed: 'right',
      render: (_value, entity) => (
        <Space>
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              icon={
                <EditOutlined
                  style={{
                    fontSize: 18,
                    color: '#ffa500',
                  }}
                />
              }
              onClick={() => {
                setOpenModal(true);
                setDataInit(entity);
              }}
            />
          </Tooltip>

          <Popconfirm
            placement="leftTop"
            title="Xóa Vaccine"
            description="Bạn có chắc chắn muốn xóa vaccine này?"
            onConfirm={() => handleDeleteVaccine(entity.vaccineId)}
            okText="Xác nhận"
            cancelText="Hủy"
          >
            <Tooltip title="Xóa">
              <Button
                type="text"
                danger
                icon={
                  <DeleteOutlined
                    style={{
                      fontSize: 18,
                    }}
                  />
                }
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
    if (clone.disease) {
      q.filter = q.filter
        ? `${q.filter} and ${sfLike('disease', clone.disease)}`
        : `${sfLike('disease', clone.disease)}`;
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

    temp = `${temp}&${sortBy}`;

    return temp;
  };

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Quản lý Vaccine
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Danh sách và thông tin các loại vaccine trong hệ thống
        </p>
      </div>

      <DataTable
        actionRef={tableRef}
        headerTitle={
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
              <MedicineBoxOutlined className="text-white text-lg" />
            </div>
            <span className="text-lg font-semibold text-gray-900">
              Danh sách Vaccine
            </span>
          </div>
        }
        rowKey="vaccineId"
        loading={isFetching}
        columns={columns}
        dataSource={vaccines}
        request={async (params, sort, filter) => {
          const query = buildQuery(params, sort, filter);
          dispatch(fetchVaccine({ query }));
        }}
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
        toolBarRender={() => [
          <Button
            key="button"
            type="primary"
            size="large"
            className="bg-gradient-to-r from-purple-600 to-pink-600 border-0 h-10 px-6 font-semibold shadow-md hover:shadow-lg rounded-lg"
            onClick={() => {
              setOpenModal(true);
              setDataInit(null);
            }}
          >
            <PlusOutlined /> Thêm Vaccine
          </Button>,
        ]}
      />

      <ModalVaccine
        openModal={openModal}
        setOpenModal={setOpenModal}
        reloadTable={reloadTable}
        dataInit={dataInit}
        setDataInit={setDataInit}
      />
    </>
  );
};

export default VaccinePage;
