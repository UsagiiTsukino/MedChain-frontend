import React, { useState, useEffect } from 'react';
import { Card, Tag, Typography, Tabs } from 'antd';
import { WalletOutlined, ArrowRightOutlined, SendOutlined, InboxOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import LoadingTable from '../../../components/share/LoadingTable';

const { Text } = Typography;
const { TabPane } = Tabs;

/**
 * Component hiển thị lịch sử giao dịch của người dùng
 * 
 * @param {Array} allTransactions - Tất cả các giao dịch
 * @param {Array} sender - Các giao dịch gửi đi
 * @param {Array} receiver - Các giao dịch nhận vào
 */
const TransactionHistory = ({ allTransactions, sender, receiver }) => {
    const { user } = useSelector((state) => state.account);
    const [loading, setLoading] = useState(true);
    
    // Giả lập trạng thái loading cho demo
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000);
        
        return () => clearTimeout(timer);
    }, []);

    const columns = [
        {
            title: 'Mã giao dịch',
            dataIndex: 'hash',
            key: 'hash',
            render: (hash) => (
                <Text copyable className="text-xs">{hash}</Text>
            ),
        },
        {
            title: 'Người gửi',
            dataIndex: 'from',
            key: 'from',
            render: (from) => (
                <Text copyable className="text-xs">{from}</Text>
            ),
        },
        {
            title: '',
            key: 'arrow',
            width: 50,
            render: () => <ArrowRightOutlined />,
        },
        {
            title: 'Người nhận',
            dataIndex: 'to',
            key: 'to',
            render: (to) => (
                <Text copyable className="text-xs">{to}</Text>
            ),
        },
        {
            title: 'Giá trị',
            dataIndex: 'value',
            key: 'value',
            render: (value) => (
                <Tag color="green" icon={<WalletOutlined />}>
                    {value}
                </Tag>
            ),
        },
    ];

    return (
        <Card>
            <Tabs defaultActiveKey="sent">
                <TabPane 
                    tab={<span><SendOutlined /> Giao dịch gửi đi</span>} 
                    key="sent"
                >
                    <LoadingTable
                        columns={columns}
                        dataSource={sender}
                        loading={loading}
                        rowCount={5}
                        timeout={1000}
                        pagination={{
                            pageSize: 5,
                            showTotal: (total) => `Tổng ${total} giao dịch`
                        }}
                        scroll={{ x: true }}
                        rowKey="hash"
                    />
                </TabPane>
                
                <TabPane 
                    tab={<span><InboxOutlined /> Giao dịch nhận vào</span>} 
                    key="received"
                >
                    <LoadingTable
                        columns={columns}
                        dataSource={receiver}
                        loading={loading}
                        rowCount={5}
                        timeout={1000}
                        pagination={{
                            pageSize: 5,
                            showTotal: (total) => `Tổng ${total} giao dịch`
                        }}
                        scroll={{ x: true }}
                        rowKey="hash"
                    />
                </TabPane>
                
                {user?.role === 'ADMIN' && (
                    <TabPane 
                        tab={<span><WalletOutlined /> Tất cả giao dịch</span>} 
                        key="all"
                    >
                        <LoadingTable
                columns={columns}
                            dataSource={allTransactions}
                            loading={loading}
                            rowCount={5}
                            timeout={1000}
                pagination={{
                    pageSize: 5,
                    showTotal: (total) => `Tổng ${total} giao dịch`
                }}
                scroll={{ x: true }}
                            rowKey="hash"
            />
                    </TabPane>
                )}
            </Tabs>
        </Card>
    );
};

export default TransactionHistory; 