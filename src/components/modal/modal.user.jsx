import { useEffect, useState } from 'react';
import { CheckSquareOutlined } from '@ant-design/icons';
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
    fetchCenter();
  }, []);


  const fetchCenter = async () => {
    const res = await callFetchCenter();
    if (res && res.data) {
      setDisplayCenter(res.data.result);
    }
  };

  const submitUser = async (valuesForm) => {
    const { fullname, email, phoneNumber, birthday, address, centerName } = valuesForm;

    try {
      if (dataInit?.walletAddress) {
        // Update user
        const res = await callUpdateUser(
          dataInit.walletAddress,
          fullname,
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
    form.resetFields();
    setDataInit(null);
    setRole(null);
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
          title="Update User"
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
          initialValues={dataInit}
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
            <Col span={12}>
              <ProFormText
                label="User Name"
                name="fullname"
                rules={[{ required: true, message: 'Please do not leave blank' }]}
                placeholder="Enter user name..."
              />
            </Col>
            <Col span={12}>
              <ProFormText
                label="Email"
                name="email"
                rules={[{ required: true, message: 'Please do not leave blank' }]}
                placeholder="Enter email..."
              />
            </Col>
            <Col span={12}>
              <ProFormText
                label="Phone Number"
                name="phoneNumber"
                rules={[{ required: true, message: 'Please do not leave blank' }]}
                placeholder="Enter phone number..."
              />
            </Col>
            <Col span={12}>
              <ProFormDatePicker
                name="birthday"
                label="Birthday"
                placeholder="Enter birthday..."
                value={dataInit?.birthday ? dayjs(dataInit.birthday, dateFormat) : null}
                width="100%"
              />
            </Col>
            <Col span={12}>
              <ProFormTextArea
                label="Address"
                name="address"
                rules={[{ required: true, message: 'Please do not leave blank' }]}
                placeholder="Enter address..."
                fieldProps={{
                  autoSize: { minRows: 4 },
                }}
              />
            </Col>
            <Col span={12}>
              {dataInit?.userId ? null : (
                <ProFormSelect
                  width="100%"
                  onChange={(value) => setRole(value)}
                  options={[
                    { value: 'DOCTOR', label: 'DOCTOR' },
                    { value: 'PATIENT', label: 'PATIENT' },
                    { value: 'CASHIER', label: 'CASHIER' },
                  ]}
                  name="role"
                  label="Role"
                  placeholder="Select role..."
                  rules={[{ required: true, message: 'Please do not leave blank' }]}
                />
              )}
            </Col>
            <Col span={12}>
              {role === 'DOCTOR' || role === 'CASHIER' || dataInit?.role === 'DOCTOR' || dataInit?.role === 'CASHIER' ? (
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
                  label="Select Working Center"
                  placeholder="Select role..."
                  rules={[{ required: true, message: 'Please do not leave blank' }]}
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