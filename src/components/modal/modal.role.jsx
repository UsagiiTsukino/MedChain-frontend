import { useState } from 'react';
import { SafetyOutlined, SaveOutlined } from '@ant-design/icons';
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
  const { openModal, setOpenModal, listPermissions, singleRole, reloadTable } =
    props;
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
          title={
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg">
                <SafetyOutlined className="text-white text-lg" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 m-0">
                  Cập nhật Vai trò
                </h3>
                <p className="text-sm text-gray-500 m-0">
                  Chỉnh sửa quyền hạn của vai trò
                </p>
              </div>
            </div>
          }
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
            width: 800,
            styles: {
              body: { paddingTop: 24 },
            },
          }}
          scrollToFirstError
          onFinish={submitRole}
          preserve={false}
          form={form}
          initialValues={singleRole}
          submitter={{
            render: (_, dom) => <FooterToolbar>{dom}</FooterToolbar>,
            submitButtonProps: {
              icon: <SaveOutlined />,
              className:
                'bg-gradient-to-r from-purple-600 to-pink-600 border-0 h-10 px-6 font-semibold shadow-md hover:shadow-lg',
            },
            resetButtonProps: {
              className: 'h-10 px-6 font-semibold',
            },
            searchConfig: {
              resetText: 'Hủy',
              submitText: 'Cập nhật',
            },
          }}
        >
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <ProFormText
                label={
                  <span className="font-semibold text-gray-700">
                    Tên vai trò
                  </span>
                }
                name="name"
                rules={[
                  { required: true, message: 'Vui lòng nhập tên vai trò' },
                ]}
                placeholder="Nhập tên vai trò..."
                fieldProps={{
                  size: 'large',
                  className: 'rounded-lg',
                }}
              />
            </Col>
            <Col span={24}>
              <ProCard
                title="Quyền hạn"
                subTitle="Các quyền được phép cho vai trò này"
                headStyle={{ color: '#9333ea', fontWeight: 600 }}
                style={{ marginBottom: 20 }}
                headerBordered
                size="small"
                bordered
                className="rounded-lg"
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
