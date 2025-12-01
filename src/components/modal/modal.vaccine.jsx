import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  CheckSquareOutlined,
  LoadingOutlined,
  PlusOutlined,
  MedicineBoxOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import {
  FooterToolbar,
  ModalForm,
  ProCard,
  ProFormText,
  ProFormTextArea,
  ProFormDigit,
} from '@ant-design/pro-components';
import {
  Col,
  ConfigProvider,
  Form,
  message,
  Modal,
  notification,
  Row,
  Upload,
  InputNumber,
} from 'antd';
import enUS from 'antd/es/calendar/locale/en_US';

import { callCreateVaccine, callUpdateVaccine } from '../../config/api.vaccine';
import { callUploadSingleFile } from '../../config/api.file';

import '../../styles/reset.scss';

const ModalVaccine = (props) => {
  const { openModal, setOpenModal, reloadTable, dataInit, setDataInit } = props;
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [form] = Form.useForm();
  const [value, setValue] = useState('');
  const [animation, setAnimation] = useState('open');

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');

  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  const handlePreview = async (file) => {
    if (!file.originFileObj) {
      setPreviewImage(file.url);
      setPreviewOpen(true);
      setPreviewTitle(
        file.name || file.url.substring(file.url.lastIndexOf('/') + 1)
      );
      return;
    }
    getBase64(file.originFileObj, (url) => {
      setPreviewImage(url);
      setPreviewOpen(true);
      setPreviewTitle(
        file.name || file.url.substring(file.url.lastIndexOf('/') + 1)
      );
    });
  };

  const handleReset = async () => {
    form.resetFields();
    setValue('');
    setDataInit(null);

    setAnimation('close');
    await new Promise((r) => setTimeout(r, 400));
    setOpenModal(false);
    setAnimation('open');
  };

  const submitVaccine = async (valuesForm) => {
    const {
      name,
      manufacturer,
      country,
      disease,
      schedule,
      efficacy,
      target,
      dosage,
      price,
      stockQuantity,
      requiredDoses,
    } = valuesForm;

    if (dataInit?.vaccineId) {
      const res = await callUpdateVaccine(
        dataInit.vaccineId,
        name,
        value,
        manufacturer,
        country,
        disease,
        schedule,
        efficacy,
        target,
        dosage,
        price,
        stockQuantity,
        requiredDoses
      );
      if (res.data) {
        message.success('Cập nhật vaccine thành công');
        handleReset();
        reloadTable();
      } else {
        notification.error({
          message: 'Đã xảy ra lỗi',
          description: res.message,
        });
      }
    } else {
      const res = await callCreateVaccine(
        name,
        value,
        manufacturer,
        country,
        disease,
        schedule,
        efficacy,
        target,
        dosage,
        price,
        stockQuantity,
        requiredDoses
      );
      if (res.data) {
        message.success('Tạo vaccine thành công');
        handleReset();
        reloadTable();
      } else {
        notification.error({
          message: 'Đã xảy ra lỗi',
          description: res.message,
        });
      }
    }
  };

  useEffect(() => {
    if (dataInit?.vaccineId && dataInit?.description) {
      setValue(dataInit.description);
    }
  }, [dataInit]);

  return (
    <>
      {openModal && (
        <>
          <ModalForm
            title={
              <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
                  <MedicineBoxOutlined className="text-white text-lg" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 m-0">
                    {dataInit?.vaccineId
                      ? 'Cập nhật Vaccine'
                      : 'Tạo mới Vaccine'}
                  </h3>
                  <p className="text-sm text-gray-500 m-0">
                    {dataInit?.vaccineId
                      ? 'Chỉnh sửa thông tin vaccine'
                      : 'Thêm vaccine mới vào hệ thống'}
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
              width: 900,
              styles: {
                body: { paddingTop: 24 },
              },
            }}
            scrollToFirstError={true}
            preserve={false}
            form={form}
            onFinish={submitVaccine}
            initialValues={dataInit?.vaccineId ? dataInit : {}}
            submitter={{
              render: (_, dom) => <FooterToolbar>{dom}</FooterToolbar>,
              submitButtonProps: {
                icon: <SaveOutlined />,
                className:
                  'bg-gradient-to-r from-green-600 to-emerald-600 border-0 h-10 px-6 font-semibold shadow-md hover:shadow-lg',
              },
              resetButtonProps: {
                className: 'h-10 px-6 font-semibold',
              },
              searchConfig: {
                resetText: 'Hủy',
                submitText: dataInit?.vaccineId ? 'Cập nhật' : 'Tạo mới',
              },
            }}
          >
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <ProFormText
                  label={
                    <span className="font-semibold text-gray-700">
                      Tên vaccine
                    </span>
                  }
                  name="name"
                  rules={[
                    { required: true, message: 'Vui lòng nhập tên vaccine' },
                  ]}
                  placeholder="Nhập tên vaccine..."
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
                      Nhà sản xuất
                    </span>
                  }
                  name="manufacturer"
                  rules={[
                    { required: true, message: 'Vui lòng nhập nhà sản xuất' },
                  ]}
                  placeholder="Nhập tên nhà sản xuất..."
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
                      Quốc gia
                    </span>
                  }
                  name="country"
                  rules={[
                    { required: true, message: 'Vui lòng nhập quốc gia' },
                  ]}
                  placeholder="Nhập quốc gia sản xuất..."
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
                      Loại bệnh
                    </span>
                  }
                  name="disease"
                  rules={[
                    { required: true, message: 'Vui lòng nhập loại bệnh' },
                  ]}
                  placeholder="Nhập loại bệnh..."
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
                      Lịch tiêm
                    </span>
                  }
                  name="schedule"
                  rules={[
                    { required: true, message: 'Vui lòng nhập lịch tiêm' },
                  ]}
                  placeholder="Ví dụ: 2 mũi, cách nhau 1 tháng..."
                  fieldProps={{
                    size: 'large',
                    className: 'rounded-lg',
                  }}
                />
              </Col>
              <Col span={12}>
                <ProFormDigit
                  label={
                    <span className="font-semibold text-gray-700">
                      Hiệu quả (%)
                    </span>
                  }
                  name="efficacy"
                  min={0}
                  max={100}
                  rules={[
                    { required: true, message: 'Vui lòng nhập hiệu quả' },
                  ]}
                  placeholder="Nhập hiệu quả..."
                  fieldProps={{
                    precision: 0,
                    formatter: (value) => `${value}%`,
                    parser: (value) => value.replace('%', ''),
                    size: 'large',
                    className: 'rounded-lg w-full',
                  }}
                />
              </Col>
              <Col span={12}>
                <ProFormText
                  label={
                    <span className="font-semibold text-gray-700">
                      Đối tượng
                    </span>
                  }
                  name="target"
                  rules={[
                    { required: true, message: 'Vui lòng nhập đối tượng' },
                  ]}
                  placeholder="Ví dụ: Trẻ em, người lớn..."
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
                      Liều lượng
                    </span>
                  }
                  name="dosage"
                  rules={[
                    { required: true, message: 'Vui lòng nhập liều lượng' },
                  ]}
                  placeholder="Ví dụ: 0.5ml..."
                  fieldProps={{
                    size: 'large',
                    className: 'rounded-lg',
                  }}
                />
              </Col>
              <Col span={12}>
                <ProFormDigit
                  label={
                    <span className="font-semibold text-gray-700">
                      Giá (VNĐ)
                    </span>
                  }
                  name="price"
                  rules={[{ required: true, message: 'Vui lòng nhập giá' }]}
                  placeholder="Nhập giá bán..."
                  fieldProps={{
                    formatter: (value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                    parser: (value) => value.replace(/\$\s?|(,*)/g, ''),
                    size: 'large',
                    className: 'rounded-lg w-full',
                  }}
                />
              </Col>
              <Col span={12}>
                <ProFormDigit
                  label={
                    <span className="font-semibold text-gray-700">
                      Số lượng tồn kho
                    </span>
                  }
                  name="stockQuantity"
                  min={0}
                  rules={[
                    { required: true, message: 'Vui lòng nhập số lượng' },
                  ]}
                  placeholder="Nhập số lượng..."
                  fieldProps={{
                    size: 'large',
                    className: 'rounded-lg w-full',
                  }}
                />
              </Col>

              <ProCard
                title="Mô tả"
                headStyle={{ color: '#d81921' }}
                style={{ marginBottom: 20 }}
                headerBordered
                size="small"
                bordered
              >
                <Col span={24}>
                  <ProFormTextArea
                    name="description"
                    placeholder="Nhập mô tả vaccine..."
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    rows={6}
                  />
                </Col>
              </ProCard>
            </Row>
          </ModalForm>
          <Modal
            open={previewOpen}
            title={previewTitle}
            footer={null}
            onCancel={() => setPreviewOpen(false)}
            style={{ zIndex: 1500 }}
          >
            <img alt="example" style={{ width: '100%' }} src={previewImage} />
          </Modal>
        </>
      )}
    </>
  );
};

export default ModalVaccine;
