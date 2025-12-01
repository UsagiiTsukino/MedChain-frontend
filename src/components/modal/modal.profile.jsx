import {
  ModalForm,
  ProFormDatePicker,
  ProFormText,
} from '@ant-design/pro-components';
import { Col, Form, message, notification, Row } from 'antd';
import { useState } from 'react';
import { UserOutlined, SaveOutlined } from '@ant-design/icons';

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
          title={
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                <UserOutlined className="text-white text-lg" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 m-0">
                  Chỉnh sửa thông tin
                </h3>
                <p className="text-sm text-gray-500 m-0">
                  Cập nhật thông tin cá nhân của bạn
                </p>
              </div>
            </div>
          }
          open={openModal}
          preserve={false}
          form={form}
          submitter={{
            searchConfig: {
              submitText: 'Cập nhật',
              resetText: 'Hủy',
            },
            submitButtonProps: {
              icon: <SaveOutlined />,
              className:
                'bg-gradient-to-r from-blue-600 to-indigo-600 border-0 h-10 px-6 font-semibold shadow-md hover:shadow-lg',
            },
            resetButtonProps: {
              className: 'h-10 px-6 font-semibold',
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
            width: 720,
            styles: {
              body: { paddingTop: 24 },
            },
          }}
        >
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <ProFormText
                label={
                  <span className="font-semibold text-gray-700">Họ và tên</span>
                }
                name="fullName"
                rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
                placeholder="Nhập họ và tên..."
                fieldProps={{
                  size: 'large',
                  className: 'rounded-lg',
                }}
              />
            </Col>
            <Col span={12}>
              <ProFormText
                label={
                  <span className="font-semibold text-gray-700">Email</span>
                }
                name="email"
                rules={[
                  { required: true, message: 'Vui lòng nhập email' },
                  { type: 'email', message: 'Email không hợp lệ' },
                ]}
                placeholder="Nhập địa chỉ email..."
                fieldProps={{
                  size: 'large',
                  className: 'rounded-lg',
                }}
              />
            </Col>
            <Col span={12}>
              <ProFormText
                label={
                  <span className="font-semibold text-gray-700">
                    Số điện thoại
                  </span>
                }
                name="phoneNumber"
                rules={[
                  { required: true, message: 'Vui lòng nhập số điện thoại' },
                ]}
                placeholder="Nhập số điện thoại..."
                fieldProps={{
                  size: 'large',
                  className: 'rounded-lg',
                }}
              />
            </Col>
            <Col span={12}>
              <ProFormDatePicker
                width="100%"
                label={
                  <span className="font-semibold text-gray-700">Ngày sinh</span>
                }
                name="birthday"
                placeholder="Chọn ngày sinh"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng chọn ngày sinh',
                  },
                ]}
                fieldProps={{
                  size: 'large',
                  className: 'rounded-lg w-full',
                  format: 'DD/MM/YYYY',
                }}
              />
            </Col>
            <Col span={24}>
              <ProFormText
                label={
                  <span className="font-semibold text-gray-700">Địa chỉ</span>
                }
                name="address"
                rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
                placeholder="Nhập địa chỉ đầy đủ..."
                fieldProps={{
                  size: 'large',
                  className: 'rounded-lg',
                }}
              />
            </Col>
          </Row>
        </ModalForm>
      )}
    </>
  );
};

export default ModalProfile;
