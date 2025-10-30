import { ModalForm, ProFormDatePicker, ProFormText } from '@ant-design/pro-components';
import { Col, Form, message, notification, Row } from 'antd';
import { useState } from 'react';

import { callUpdateUser } from '../../config/api.user';

const ModalProfile = (props) => {
  const { openModal, setOpenModal, reloadData, user } = props;

  const [animation, setAnimation] = useState('open');

  const [form] = Form.useForm();

  const updateProfile = async (valuesForm) => {
    const { fullname, phone, birthday, address, email } = valuesForm;

    const res = await callUpdateUser(
      user.walletAddress,
      fullname,
      email,
      phone,
      birthday,
      address
    );

    if (res.data) {
      message.success('User updated successfully');
    } else {
      notification.error({
        message: 'An error occurred',
        description: res.message,
      });
    }
    handleReset();
    reloadData();
  };

  const handleReset = async () => {
    form.resetFields();

    setAnimation('close');
    await new Promise((r) => setTimeout(r, 400));
    setOpenModal(false);
    setAnimation('open');
  };

  return (
    <>
      {openModal && (
        <ModalForm
          title="Edit Profile Information"
          open={openModal}
          preserve={false}
          form={form}
          submitter={{
            searchConfig: {
              submitText: 'Update',
              resetText: 'Cancel',
            },
          }}
          initialValues={user}
          onFinish={updateProfile}
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
        >
          <Row gutter={16}>
            <Col span={12}>
              <ProFormText
                label="Full Name"
                name="fullname"
                rules={[{ required: true, message: 'Please do not leave blank' }]}
                placeholder="Enter name ..."
              />
            </Col>
            <Col span={12}>
              <ProFormText label="Email" name="email" rules={[{ required: true, message: 'Please do not leave blank' }]}
                placeholder="Enter email ..." />
            </Col>
            <Col span={12}>
              <ProFormText
                label="Address"
                name="address"
                rules={[{ required: true, message: 'Please do not leave blank' }]}
                placeholder="Enter address..."
              />
            </Col>
            <Col span={12}>
              <ProFormText
                label="Phone Number"
                name="phone"
                rules={[{ required: true, message: 'Please do not leave blank' }]}
                placeholder="Enter phone number..."
              />
            </Col>
            <Col span={12}>
              <ProFormDatePicker
                colProps={{ xl: 12, md: 24 }}
                width="md"
                label="Birthday"
                name="birthday"
                placeholder="Select birthday"
                rules={[
                  {
                    required: true,
                    message: 'Please select birthday!',
                  },
                ]}
              />
            </Col>
          </Row>
        </ModalForm>
      )}
    </>
  );
};

export default ModalProfile;