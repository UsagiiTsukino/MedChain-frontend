import { useState } from 'react';
import { CheckSquareOutlined } from '@ant-design/icons';
import { Col, Form, message, notification, Row } from 'antd';
import {
  FooterToolbar,
  ModalForm,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';

import '../../styles/reset.scss';
import { callCreatePermission, callUpdatePermission } from '../../config/api.permission';


const ModalPermission = (props) => {
  const { openModal, setOpenModal, reloadTable, dataInit, setDataInit } = props;

  const [form] = Form.useForm();
  const [animation, setAnimation] = useState('open');


  const submitUser = async (valuesForm) => {
    const { name, method, apiPath, module } = valuesForm;
    try {
      if (dataInit?.id) {
        // Update user
        const res = await callUpdatePermission(
          dataInit.id,
          name,
          method,
          apiPath,
          module
        );
  
        if (res.data) {
          message.success('Permission updated successfully');
        } else {
          notification.error({
            message: 'An error occurred',
            description: res.message,
          });
        }
      } else {
        // Create user
        const res = await callCreatePermission(
          name,
          method,
          apiPath,
          module
        );
  
        if (res.data) {
          message.success('Permission created successfully');
        } else {
          notification.error({
            message: 'Permission creation failed',
            description: res.error,
          });
        }
      }
  
      handleReset();
      reloadTable();
    } catch (error) {
      notification.error({
        message: 'An error occurred',
        description: error.message || 'Unknown error',
      });
    }
  };

  const handleReset = async () => {
    form.resetFields();
    setDataInit(null);
    // Add animation when closing modal
    setAnimation('close');
    await new Promise((resolve) => setTimeout(resolve, 400));
    setOpenModal(false);
    setAnimation('open');
  };

  return (
    <>
     {openModal && (
  <ModalForm
    title={dataInit?.userId ? 'Update Permission' : 'Create New Permission'}
    open={openModal}
    modalProps={{
      onCancel: () => {
        handleReset();
      },
      afterClose: () => handleReset(),
      destroyOnClose: true,
      footer: null,
      keyboard: false,
      maskClosable: false,
      className: `modal-company ${animation}`,
      rootClassName: `modal-company-root ${animation}`,
    }}
    scrollToFirstError
    preserve={false}
    form={form}
    onFinish={submitUser}
    initialValues={dataInit?.id ? dataInit : {}}
    submitter={{
      render: (_, dom) => <FooterToolbar>{dom}</FooterToolbar>,
      submitButtonProps: {
        icon: <CheckSquareOutlined />,
      },
      searchConfig: {
        resetText: 'Cancel',
        submitText: <>{dataInit?.id ? 'Update' : 'Create'}</>,
      },
    }}
  >
    <Row gutter={16}>
      <Col span={12}>
        <ProFormText
          label="Permission Name"
          name="name"
          rules={[{ required: true, message: 'Please do not leave blank' }]}
          placeholder="Enter permission name..."
        />
      </Col>
      <Col span={12}>
        <ProFormSelect
          label="Method"
          name="method"
          valueEnum={{
            GET: 'GET',
            POST: 'POST',
            PUT: 'PUT',
            DELETE: 'DELETE',
          }}
        />
      </Col>

      <Col span={12}>
        <ProFormText
          label="API"
          name="apiPath"
          rules={[{ required: true, message: 'Please do not leave blank' }]}
          placeholder="Enter API name..."
        />
      </Col>
      <Col span={12}>
        <ProFormText
          label="Module"
          name="module"
          rules={[{ required: true, message: 'Please do not leave blank' }]}
          placeholder="Enter module name..."
        />
      </Col>
    </Row>
  </ModalForm>
)}
    </>
  );
};

export default ModalPermission;