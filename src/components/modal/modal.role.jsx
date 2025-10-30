import { useState } from 'react';
import { CheckSquareOutlined } from '@ant-design/icons';
import { Col, Form, message, notification, Row } from 'antd';
import {
  FooterToolbar,
  ModalForm,
  ProCard,
  ProFormText,
} from '@ant-design/pro-components';

import '../../styles/reset.scss';
import ModuleApi from './module.api';
import { callUpdateRole } from '../../config/api.role';

const ModalRole = (props) => {
  const { openModal, setOpenModal, listPermissions, singleRole, reloadTable } = props;
  const [animation, setAnimation] = useState('open');
  const [form] = Form.useForm();

  const handleReset = async () => {
    setAnimation('close');
    await new Promise((resolve) => setTimeout(resolve, 400));
    setOpenModal(false);
    setAnimation('open');
  };

  const submitRole = async (valuesForm) => {
    const { name, permissions } = valuesForm;

    const checkedPermissions = [];

    if (permissions) {
      for (const key in permissions) {
        if (key.match(/^[1-9][0-9]*$/) && permissions[key] === true) {
          checkedPermissions.push({ id: key });
        }
      }
    }
    if (singleRole?.id) {
      //update
      const role = {
        name,
        permissions: checkedPermissions,
      };
      const res = await callUpdateRole(role, singleRole.id);
      if (res.data) {
        message.success('Role updated successfully');
        handleReset();
        reloadTable();
      } else {
        notification.error({
          message: 'An error occurred',
          description: res.message,
        });
      }
    }
  };

  return (
    <>
      {openModal && (
        <ModalForm
          title="Update Role"
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
          onFinish={submitRole}
          preserve={false}
          form={form}
          initialValues={singleRole}
          submitter={{
            render: (_, dom) => <FooterToolbar>{dom}</FooterToolbar>,
            submitButtonProps: {
              icon: <CheckSquareOutlined />,
            },
            searchConfig: {
              resetText: 'Cancel',
              submitText: 'Update',
            },
          }}
        >
          <Row gutter={16}>
            <Col span={24}>
              <ProFormText
                label="Role"
                name="name"
                rules={[{ required: true, message: 'Please do not leave blank' }]}
                placeholder="Enter role name..."
              />
            </Col>
            <Col span={24}>
              <ProCard
                title="Permissions"
                subTitle="Permissions allowed for this role"
                headStyle={{ color: '#d81921' }}
                style={{ marginBottom: 20 }}
                headerBordered
                size="small"
                bordered
              >
                <ModuleApi
                  form={form}
                  listPermissions={listPermissions}
                  singleRole={singleRole}
                  openModal={openModal}
                />
              </ProCard>
            </Col>
          </Row>
        </ModalForm>
      )}
    </>
  );
};

export default ModalRole;