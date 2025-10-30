import { Tabs } from 'antd'
import History from './_history'
import ChancePassword from './_chance-password';

const TabOption = () => {

    const tab = [
        {
            key: '1',
            label: 'Lịch sử tiêm chủng',
            children: <History />,
        },
        {
            key: '2',
            label: 'Đổi mật khẩu',
            children: <ChancePassword />,
        },
    ];

    return (
        <div className='my-4 mx-2'>
            <Tabs defaultActiveKey="1" items={tab}/>
        </div>
    )
}
export default TabOption
