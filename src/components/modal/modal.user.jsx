import { useEffect, useState } from 'react';
import {
  CheckSquareOutlined,
  UserOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import { Col, Form, message, notification, Row } from 'antd';
import {
  FooterToolbar,
  ModalForm,
  ProFormDatePicker,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

import { callUpdateUser } from '../../config/api.user';
import '../../styles/reset.scss';
import { callFetchCenter } from '../../config/api.center';

dayjs.extend(customParseFormat);
const dateFormat = 'YYYY-MM-DD';

const ModalUser = (props) => {
  const { openModal, setOpenModal, reloadTable, dataInit, setDataInit } = props;

  const [form] = Form.useForm();
  const [animation, setAnimation] = useState('open');
  const [displayCenter, setDisplayCenter] = useState(null);
  const [role, setRole] = useState();

  useEffect(() => {
    console.log('[ModalUser] Props received:', { dataInit, openModal });

    if (!openModal) {
      // When modal closes, ensure form is reset
      form.resetFields();
      setRole(null);
      return;
    }

    if (openModal && dataInit) {
      console.log('[ModalUser] DataInit details:', {
        walletAddress: dataInit.walletAddress,
        fullName: dataInit.fullName,
        email: dataInit.email,
        role: dataInit.role,
        centerName: dataInit.centerName,
      });

      // Set initial role
      if (dataInit.role) {
        setRole(dataInit.role);
      }

      // Reset and set form values when dataInit changes
      form.setFieldsValue({
        fullname: dataInit.fullName,
        email: dataInit.email,
        phoneNumber: dataInit.phoneNumber,
        birthday: dataInit.birthday,
        address: dataInit.address,
        role: dataInit.role,
        centerName: dataInit.centerName,
      });
    } else if (openModal && !dataInit) {
      // Reset form when opening for new entry
      form.resetFields();
      setRole(null);
    }
  }, [dataInit, openModal, form]);

  useEffect(() => {
    fetchCenter();
  }, []);

  const fetchCenter = async () => {
    const res = await callFetchCenter();
    if (res && res.data) {
      setDisplayCenter(res.data.result);
    }
  };

  const submitUser = async (valuesForm) => {
    const { fullname, email, phoneNumber, birthday, address, centerName } =
      valuesForm;

    try {
      if (dataInit?.walletAddress) {
        // Update user
        const res = await callUpdateUser(
          dataInit.walletAddress,
          fullname || dataInit.fullName,
          email,
          phoneNumber,
          birthday,
          address,
          centerName
        );

        if (res.data) {
          message.success('User updated successfully');
        } else {
          notification.error({
            message: 'An error occurred',
            description: res.message,
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
    console.log('[ModalUser] handleReset called');
    form.resetFields();
    setRole(null);
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
          title={
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                <UserOutlined className="text-white text-lg" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 m-0">
                  Cập nhật người dùng
                </h3>
                <p className="text-sm text-gray-500 m-0">
                  Chỉnh sửa thông tin người dùng
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
          preserve={false}
          form={form}
          onFinish={submitUser}
          submitter={{
            render: (_, dom) => <FooterToolbar>{dom}</FooterToolbar>,
            submitButtonProps: {
              icon: <SaveOutlined />,
              className:
                'bg-gradient-to-r from-blue-600 to-indigo-600 border-0 h-10 px-6 font-semibold shadow-md hover:shadow-lg',
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
            <Col span={12}>
              <ProFormText
                label={
                  <span className="font-semibold text-gray-700">Họ và tên</span>
                }
                name="fullname"
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
                name="birthday"
                label={
                  <span className="font-semibold text-gray-700">Ngày sinh</span>
                }
                placeholder="Chọn ngày sinh..."
                value={
                  dataInit?.birthday
                    ? dayjs(dataInit.birthday, dateFormat)
                    : null
                }
                width="100%"
                fieldProps={{
                  size: 'large',
                  className: 'rounded-lg w-full',
                  format: 'DD/MM/YYYY',
                }}
              />
            </Col>
            <Col span={12}>
              <ProFormTextArea
                label={
                  <span className="font-semibold text-gray-700">Địa chỉ</span>
                }
                name="address"
                rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
                placeholder="Nhập địa chỉ đầy đủ..."
                fieldProps={{
                  autoSize: { minRows: 4 },
                  className: 'rounded-lg',
                }}
              />
            </Col>
            <Col span={12}>
              <ProFormSelect
                width="100%"
                onChange={(value) => setRole(value)}
                options={[
                  { value: 'DOCTOR', label: 'Bác sĩ' },
                  { value: 'PATIENT', label: 'Bệnh nhân' },
                  { value: 'CASHIER', label: 'Thu ngân' },
                ]}
                name="role"
                label={
                  <span className="font-semibold text-gray-700">Vai trò</span>
                }
                placeholder="Chọn vai trò..."
                rules={[{ required: true, message: 'Vui lòng chọn vai trò' }]}
                fieldProps={{
                  size: 'large',
                  className: 'rounded-lg',
                }}
              />
            </Col>
            <Col span={12}>
              {role === 'DOCTOR' ||
              role === 'CASHIER' ||
              dataInit?.role === 'DOCTOR' ||
              dataInit?.role === 'CASHIER' ? (
                <ProFormSelect
                  width="100%"
                  options={
                    displayCenter &&
                    displayCenter.map((center) => {
                      return {
                        label: center.name,
                        value: center.name,
                      };
                    })
                  }
                  name="centerName"
                  label={
                    <span className="font-semibold text-gray-700">
                      Trung tâm làm việc
                    </span>
                  }
                  placeholder="Chọn trung tâm..."
                  rules={[
                    { required: true, message: 'Vui lòng chọn trung tâm' },
                  ]}
                  fieldProps={{
                    size: 'large',
                    className: 'rounded-lg',
                  }}
                />
              ) : null}
            </Col>
          </Row>
        </ModalForm>
      )}
    </>
  );
};

export default ModalUser;
