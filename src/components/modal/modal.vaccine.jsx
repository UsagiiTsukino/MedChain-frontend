import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  CheckSquareOutlined,
  LoadingOutlined,
  PlusOutlined,
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
              <>
                {dataInit?.vaccineId ? 'Cập nhật Vaccine' : 'Tạo mới Vaccine'}
              </>
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
            }}
            scrollToFirstError={true}
            preserve={false}
            form={form}
            onFinish={submitVaccine}
            initialValues={dataInit?.vaccineId ? dataInit : {}}
            submitter={{
              render: (_, dom) => <FooterToolbar>{dom}</FooterToolbar>,
              submitButtonProps: {
                icon: <CheckSquareOutlined />,
              },
              searchConfig: {
                resetText: 'Hủy',
                submitText: <>{dataInit?.vaccineId ? 'Cập nhật' : 'Tạo mới'}</>,
              },
            }}
          >
            <Row gutter={16}>
              <Col span={12}>
                <ProFormText
                  label="Tên vaccine"
                  name="name"
                  rules={[{ required: true, message: 'Vui lòng không để trống' }]}
                  placeholder="Nhập tên vaccine..."
                />
              </Col>
              <Col span={12}>
                <ProFormText
                  label="Nhà sản xuất"
                  name="manufacturer"
                  rules={[{ required: true, message: 'Vui lòng không để trống' }]}
                  placeholder="Nhà sản xuất..."
                />
              </Col>
              <Col span={12}>
                <ProFormText
                  label="Quốc gia"
                  name="country"
                  rules={[{ required: true, message: 'Vui lòng không để trống' }]}
                  placeholder="Quốc gia sản xuất..."
                />
              </Col>
              <Col span={12}>
                <ProFormText
                  label="Loại bệnh"
                  name="disease"
                  rules={[{ required: true, message: 'Vui lòng không để trống' }]}
                  placeholder="Loại bệnh..."
                />
              </Col>
              <Col span={12}>
                <ProFormText
                  label="Lịch tiêm"
                  name="schedule"
                  rules={[{ required: true, message: 'Vui lòng không để trống' }]}
                  placeholder="Lịch tiêm chủng..."
                />
              </Col>
              <Col span={12}>
                <ProFormDigit
                  label="Hiệu quả (%)"
                  name="efficacy"
                  min={0}
                  max={100}
                  rules={[{ required: true, message: 'Vui lòng không để trống' }]}
                  placeholder="Hiệu quả (%)..."
                  fieldProps={{
                    precision: 0,
                    formatter: (value) => `${value}%`,
                    parser: (value) => value.replace('%', ''),
                  }}
                />
              </Col>
              <Col span={12}>
                <ProFormText
                  label="Đối tượng"
                  name="target"
                  rules={[{ required: true, message: 'Vui lòng không để trống' }]}
                  placeholder="Đối tượng tiêm chủng..."
                />
              </Col>
              <Col span={12}>
                <ProFormText
                  label="Liều lượng"
                  name="dosage"
                  rules={[{ required: true, message: 'Vui lòng không để trống' }]}
                  placeholder="Liều lượng..."
                />
              </Col>
              <Col span={12}>
                <ProFormDigit
                  label="Giá (VNĐ)"
                  name="price"
                  rules={[{ required: true, message: 'Vui lòng không để trống' }]}
                  placeholder="Giá..."
                  fieldProps={{
                    formatter: (value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                    parser: (value) => value.replace(/\$\s?|(,*)/g, ''),
                  }}
                />
              </Col>
              <Col span={12}>
                <ProFormDigit
                  label="Số lượng tồn kho"
                  name="stockQuantity"
                  min={0}
                  rules={[{ required: true, message: 'Vui lòng không để trống' }]}
                  placeholder="Số lượng..."
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