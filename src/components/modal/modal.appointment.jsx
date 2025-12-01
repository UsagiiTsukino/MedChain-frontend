import { useEffect, useState } from 'react';
import { Form, message, notification } from 'antd';
import {
  ModalForm,
  ProFormSelect,
  FooterToolbar,
} from '@ant-design/pro-components';
import { CalendarOutlined, SaveOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

import { callFetchDoctor } from '../../config/api.user';
import { callUpdateAppointment } from '../../config/api.appointment';
import '../../styles/reset.scss';
import { useSelector } from 'react-redux';

dayjs.extend(customParseFormat);

const ModalAppointment = (props) => {
  const user = useSelector((state) => state.account.user);
  const { openModal, setOpenModal, reloadTable, dataInit, setDataInit } = props;

  const [form] = Form.useForm();
  const [animation, setAnimation] = useState('open');
  const [listDoctor, setListDoctor] = useState([]);

  useEffect(() => {
    fetchDoctor();
  }, []);

  const fetchDoctor = async () => {
    const res = await callFetchDoctor();
    const list = res.data?.result || [];
    console.log(list);
    // list.filter((doctor) => doctor. === user.clinicId);
    if (res && res.data) {
      setListDoctor(res.data?.result);
    }
  };

  const submitAppointment = async (valuesForm) => {
    const { doctorId } = valuesForm;
    const res = await callUpdateAppointment(dataInit.id, doctorId);

    if (res) {
      console.log(res);
      message.success('Appointment updated successfully');
      handleReset();
      reloadTable();
    } else {
      notification.error({
        message: 'An error occurred',
        description: res.message,
      });
    }
  };
  const handleReset = async () => {
    form.resetFields();
    setDataInit(null);

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
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg">
                <CalendarOutlined className="text-white text-lg" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 m-0">
                  Cập nhật Lịch hẹn
                </h3>
                <p className="text-sm text-gray-500 m-0">
                  Chỉ định bác sĩ cho lịch hẹn
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
            width: 600,
            styles: {
              body: { paddingTop: 24 },
            },
          }}
          scrollToFirstError
          preserve={false}
          form={form}
          onFinish={submitAppointment}
          initialValues={dataInit}
          submitter={{
            render: (_, dom) => <FooterToolbar>{dom}</FooterToolbar>,
            submitButtonProps: {
              icon: <SaveOutlined />,
              className:
                'bg-gradient-to-r from-cyan-600 to-blue-600 border-0 h-10 px-6 font-semibold shadow-md hover:shadow-lg',
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
          <ProFormSelect
            name="doctorId"
            label={
              <span className="font-semibold text-gray-700">
                Chỉ định Bác sĩ
              </span>
            }
            placeholder="Chọn bác sĩ..."
            options={listDoctor.map((doctor) => ({
              label: doctor.doctorName,
              value: doctor.id,
            }))}
            rules={[
              {
                required: true,
                message: 'Vui lòng chọn bác sĩ!',
              },
            ]}
            fieldProps={{
              size: 'large',
              className: 'rounded-lg',
              showSearch: true,
              filterOption: (input, option) =>
                (option?.label ?? '')
                  .toLowerCase()
                  .includes(input.toLowerCase()),
            }}
          />
        </ModalForm>
      )}
    </>
  );
};

export default ModalAppointment;
