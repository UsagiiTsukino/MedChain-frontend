import { useEffect, useState } from 'react';
import { Form, message, notification, Descriptions, Tag, Avatar } from 'antd';
import {
  ModalForm,
  ProFormSelect,
  FooterToolbar,
} from '@ant-design/pro-components';
import {
  CalendarOutlined,
  SaveOutlined,
  UserOutlined,
  MedicineBoxOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
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
    if (res && res.data) {
      setListDoctor(res.data?.result);
    }
  };

  const submitAppointment = async (valuesForm) => {
    const { doctorId } = valuesForm;
    const res = await callUpdateAppointment(dataInit.id, doctorId);

    if (res) {
      message.success('Đã xác nhận lịch hẹn thành công!');
      handleReset();
      reloadTable();
    } else {
      notification.error({
        message: 'Có lỗi xảy ra',
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
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg">
                <CalendarOutlined className="text-white text-xl" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 m-0">
                  Xác nhận Lịch hẹn
                </h3>
                <p className="text-sm text-gray-500 m-0">
                  Chỉ định bác sĩ cho lịch hẹn tiêm chủng
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
            width: 700,
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
              submitText: 'Xác nhận',
            },
          }}
        >
          {/* Appointment Info Card */}
          {dataInit && (
            <div className="mb-6 p-5 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl">
              <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CalendarOutlined className="text-blue-600" />
                Thông tin lịch hẹn
              </h4>
              <Descriptions column={1} size="small">
                <Descriptions.Item
                  label={
                    <span className="font-semibold flex items-center gap-2">
                      <UserOutlined className="text-purple-600" />
                      Bệnh nhân
                    </span>
                  }
                >
                  <div className="flex items-center gap-2">
                    <Avatar
                      size={24}
                      className="bg-gradient-to-br from-purple-500 to-indigo-600"
                    >
                      {dataInit.patientName?.charAt(0)}
                    </Avatar>
                    <span className="font-medium">{dataInit.patientName}</span>
                  </div>
                </Descriptions.Item>
                <Descriptions.Item
                  label={
                    <span className="font-semibold flex items-center gap-2">
                      <MedicineBoxOutlined className="text-green-600" />
                      Vaccine
                    </span>
                  }
                >
                  <Tag color="green" className="text-sm">
                    {dataInit.vaccineName}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item
                  label={
                    <span className="font-semibold flex items-center gap-2">
                      <EnvironmentOutlined className="text-red-600" />
                      Trung tâm
                    </span>
                  }
                >
                  {dataInit.centerName}
                </Descriptions.Item>
                <Descriptions.Item
                  label={
                    <span className="font-semibold flex items-center gap-2">
                      <ClockCircleOutlined className="text-orange-600" />
                      Thời gian
                    </span>
                  }
                >
                  <div className="flex gap-3">
                    <Tag color="blue" className="text-sm">
                      {dataInit.scheduledDate
                        ? dayjs(dataInit.scheduledDate).format('DD/MM/YYYY')
                        : 'N/A'}
                    </Tag>
                    <Tag color="orange" className="text-sm">
                      {dataInit.scheduledTime || 'N/A'}
                    </Tag>
                  </div>
                </Descriptions.Item>
              </Descriptions>
            </div>
          )}

          {/* Doctor Selection */}
          <ProFormSelect
            name="doctorId"
            label={
              <span className="font-semibold text-gray-700 text-base flex items-center gap-2">
                <UserOutlined className="text-cyan-600" />
                Chỉ định Bác sĩ
              </span>
            }
            placeholder="Chọn bác sĩ phụ trách..."
            options={listDoctor.map((doctor) => ({
              label: (
                <div className="flex items-center gap-2 py-1">
                  <Avatar
                    size={28}
                    className="bg-gradient-to-br from-cyan-500 to-blue-600"
                  >
                    {doctor.fullname?.charAt(0) || 'D'}
                  </Avatar>
                  <span className="font-medium">{doctor.fullname}</span>
                </div>
              ),
              value: doctor.walletAddress,
            }))}
            rules={[
              {
                required: true,
                message: 'Vui lòng chọn bác sĩ phụ trách!',
              },
            ]}
            fieldProps={{
              size: 'large',
              className: 'rounded-lg',
              showSearch: true,
              filterOption: (input, option) =>
                (option?.label?.props?.children[1]?.props?.children ?? '')
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
