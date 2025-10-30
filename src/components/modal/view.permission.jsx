import { Descriptions, Drawer } from 'antd';

const ViewDetailPermission = (props) => {
  const { onClose, open, dataInit, setDataInit } = props;

  return (
    <>
      <Drawer
        title="Permission Information"
        placement="right"
        onClose={() => { onClose(false); setDataInit(null) }}
        open={open}
        width="40vw"
        maskClosable={false}
      >
        <Descriptions title="" bordered column={2} layout="vertical">
          <Descriptions.Item label="Permission Name">{dataInit?.name}</Descriptions.Item>
          <Descriptions.Item label="API Path">{dataInit?.apiPath}</Descriptions.Item>

          <Descriptions.Item label="Method">{dataInit?.method}</Descriptions.Item>
          <Descriptions.Item label="Module">{dataInit?.module}</Descriptions.Item>
        </Descriptions>
      </Drawer>
    </>
  );
};

export default ViewDetailPermission;