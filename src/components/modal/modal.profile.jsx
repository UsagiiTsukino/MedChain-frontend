import {
  ModalForm,
  ProFormDatePicker,
  ProFormText,
} from '@ant-design/pro-components';
import { Col, Form, message, notification, Row } from 'antd';
import { useState } from 'react';

import { callUpdateUser } from '../../config/api.user';

const ModalProfile = (props) => {
  const { openModal, setOpenModal, reloadData, user } = props;

  const [animation, setAnimation] = useState('open');

  const [form] = Form.useForm();

  const updateProfile = async (valuesForm) => {
    const { fullName, phoneNumber, birthday, address, email } = valuesForm;

    try {
      const res = await callUpdateUser(
        user.walletAddress,
        fullName,
        email,
        phoneNumber,
        birthday,
        address
      );

      // Response is already unwrapped by axios interceptor
      if (res) {
        message.success('Cập nhật thông tin thành công');
        // Reload data FIRST to update UI
        await reloadData();
        // Small delay to ensure state is updated
        await new Promise((resolve) => setTimeout(resolve, 300));
        // Then close modal
        handleReset();
      } else {
        notification.error({
          message: 'Có lỗi xảy ra',
          description: 'Không thể cập nhật thông tin',
        });
      }
    } catch (error) {
      notification.error({
        message: 'Có lỗi xảy ra',
        description: error?.message || 'Không thể cập nhật thông tin',
      });
    }
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
                name="fullName"
                rules={[
                  { required: true, message: 'Please do not leave blank' },
                ]}
                placeholder="Enter name ..."
              />
            </Col>
            <Col span={12}>
              <ProFormText
                label="Email"
                name="email"
                rules={[
                  { required: true, message: 'Please do not leave blank' },
                ]}
                placeholder="Enter email ..."
              />
            </Col>
            <Col span={12}>
              <ProFormText
                label="Address"
                name="address"
                rules={[
                  { required: true, message: 'Please do not leave blank' },
                ]}
                placeholder="Enter address..."
              />
            </Col>
            <Col span={12}>
              <ProFormText
                label="Phone Number"
                name="phoneNumber"
                rules={[
                  { required: true, message: 'Please do not leave blank' },
                ]}
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
