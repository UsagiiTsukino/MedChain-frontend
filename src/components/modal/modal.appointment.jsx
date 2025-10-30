import { useEffect, useState } from 'react';
import { Form, message, notification } from 'antd';
import { ModalForm, ProFormSelect } from '@ant-design/pro-components';
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
    console.log(list)
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
          title="Update Appointment"
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
          onFinish={submitAppointment}
          initialValues={dataInit}
        >
          <ProFormSelect
            name="doctorId"
            label="Assign Doctor"
            placeholder="Select Doctor"
            options={listDoctor.map((doctor) => ({
              label: doctor.doctorName,
              value: doctor.id,
            }))}
            rules={[
              {
                required: true,
                message: 'Please select a doctor!',
              },
            ]}
          />
        </ModalForm>
      )}
    </>
  );
};

export default ModalAppointment;
