import { useEffect, useRef, useState } from 'react';
import DataTable from '../data-table';
import { Badge, message, notification, Popconfirm, Space } from 'antd';
import { CloseCircleOutlined, EditOutlined } from '@ant-design/icons';
import { callCancelAppointment } from '../../config/api.appointment';
import { callMyAppointments } from '../../config/api.auth';

const History = () => {
    const tableRef = useRef();

    const reloadTable = () => {
        tableRef?.current?.reload();
    };

    const [isFetching, setFetching] = useState(false);
    const [listSchedule, setListSchedule] = useState([]);
    const [meta, setMeta] = useState({
        page: 1,
        pageSize: 10,
        pages: 0,
        total: 0,
    });

    const handleCancel = async (id) => {
        if (id) {
            const res = await callCancelAppointment(id);
            if (res && +res.statusCode === 200) {
                message.success('Hủy lịch tiêm thành công');
                reloadTable();
            } else {
                notification.error({
                    message: res.error,
                    description: res.message,
                });
            }
        }
    };

    useEffect(() => {
        fetchMyAppointments();
    }, []);

    const fetchMyAppointments = async () => {
        setFetching(true);

        setTimeout(async () => {
            const res = await callMyAppointments();
            if (res && res.data) {
                setMeta(res.data.meta);
                setListSchedule(res.data.result);
            }
            setFetching(false);
        }, 500);
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
            title: 'Vaccine',
            dataIndex: 'vaccineName',
            hideInSearch: true,
        },
        {
            title: 'Doctor',
            dataIndex: 'doctorName',
            hideInSearch: true,
        },
        {
            title: 'Date',
            dataIndex: 'appointmentDate',
            hideInSearch: true,
        },
        {
            title: 'Time',
            dataIndex: 'appointmentTime',
            hideInSearch: true,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            hideInSearch: true,
            render: (_value, entity) => {
                let color;
                switch (entity.status) {
                    case 'PENDING':
                        color = '#faad14';
                        break;
                    case 'COMPLETED':
                        color = '#1890ff';
                        break;
                    case 'PROCESSING':
                        color = '#52c41a';
                        break;
                }
                return <Badge count={entity.status} showZero color={color} />;
            },
        },
        {
            title: 'Actions',
            hideInSearch: true,
            width: 50,
            render: (_value, entity) => (

                entity.status !== 'COMPLETED' && entity.status !== 'CANCELLED' ? (
                    <Popconfirm
                        placement='leftTop'
                        title='Xác nhận hủy lịch hẹn'
                        description='Bạn có chắc chắn muốn hủy lịch hẹn này?'
                        onConfirm={() => handleCancel(entity.appointmentId)}
                        okText='Xác nhận'
                        cancelText='Hủy'
                    >
                        <span style={{ cursor: 'pointer', margin: '0 10px' }}>
                            <CloseCircleOutlined
                                style={{
                                    fontSize: 20,
                                    color: '#e22929',
                                }}
                            />
                        </span>
                    </Popconfirm>
                ) : null
               
            ),
        },
    ]



    return (
        <div>
            <DataTable
                actionRef={tableRef}
                headerTitle='Lịch sử tiêm chủng'
                rowKey='appointId'
                loading={isFetching}
                columns={columns}
                dataSource={listSchedule}
                request={async () => {
                    await fetchMyAppointments();
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
                search={false}
            />

        </div>
    )
}

export default History