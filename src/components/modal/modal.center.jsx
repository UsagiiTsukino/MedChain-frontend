import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  FooterToolbar,
  ModalForm,
  ProFormText,
  ProFormTextArea,
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
} from 'antd';
import {
  CheckSquareOutlined,
  LoadingOutlined,
  PlusOutlined,
  HomeOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import enUS from 'antd/es/calendar/locale/en_US';

import { callCreateCenter, callUpdateCenter } from '../../config/api.center';
import { callUploadSingleFile } from '../../config/api.file';

import '../../styles/reset.scss';

const ModalCenter = (props) => {
  const { openModal, setOpenModal, reloadTable, dataInit, setDataInit } = props;
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [animation, setAnimation] = useState('open');
  const [form] = Form.useForm();
  const [dataLogo, setDataLogo] = useState([]);

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

  const handleRemoveFile = () => {
    setDataLogo([]);
  };

  const handleChange = (info) => {
    if (info.file.status === 'uploading') {
      setLoadingUpload(true);
    }
    if (info.file.status === 'done') {
      setLoadingUpload(false);
    }
    if (info.file.status === 'error') {
      setLoadingUpload(false);
      message.error(
        info?.file?.error?.event?.message ??
          'An error occurred while uploading the file.'
      );
    }
  };

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG files!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must be smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  };

  const handleUploadFileLogo = async ({ file, onSuccess, onError }) => {
    const res = await callUploadSingleFile(file, 'center');
    if (res && res.data) {
      setDataLogo([
        {
          name: res.data.fileName,
          uid: uuidv4(),
        },
      ]);
      if (onSuccess) onSuccess('ok');
    } else {
      if (onError) {
        setDataLogo([]);
        const error = new Error(res.message);
        onError({ event: error });
      }
    }
  };

  const handleReset = async () => {
    form.resetFields();
    setDataInit(null);

    setAnimation('close');
    await new Promise((r) => setTimeout(r, 400));
    setOpenModal(false);
    setAnimation('open');
  };

  const submitCenter = async (valuesForm) => {
    const { name, address, phoneNumber, capacity, workingHours } = valuesForm;

    if (dataLogo.length === 0) {
      message.error('Please upload a Logo image');
      return;
    }

    if (dataInit?.centerId) {
      console.log(dataInit);
      const res = await callUpdateCenter(
        dataInit.centerId,
        name,
        address,
        phoneNumber,
        capacity,
        workingHours,
        dataLogo[0].name
      );
      console.log(res);

      if (res.data) {
        message.success('Center updated successfully');
        handleReset();
        reloadTable();
      } else {
        notification.error({
          message: 'An error occurred',
          description: res.message,
        });
      }
    } else {
      const res = await callCreateCenter(
        name,
        address,
        phoneNumber,
        capacity,
        workingHours,
        dataLogo[0].name
      );
      if (res.data) {
        message.success('Center created successfully');
        handleReset();
        reloadTable();
      } else {
        notification.error({
          message: 'An error occurred',
          description: res.message,
        });
      }
    }
  };

  return (
    <>
      {openModal && (
        <>
          <ModalForm
            title={
              <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                  <HomeOutlined className="text-white text-lg" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 m-0">
                    {dataInit?.centerId
                      ? 'Cập nhật Trung tâm'
                      : 'Tạo mới Trung tâm'}
                  </h3>
                  <p className="text-sm text-gray-500 m-0">
                    {dataInit?.centerId
                      ? 'Chỉnh sửa thông tin trung tâm'
                      : 'Thêm trung tâm tiêm chủng mới'}
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
            onFinish={submitCenter}
            initialValues={dataInit?.centerId ? dataInit : {}}
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
                submitText: dataInit?.centerId ? 'Cập nhật' : 'Tạo mới',
              },
            }}
          >
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <ProFormText
                  label={
                    <span className="font-semibold text-gray-700">
                      Tên trung tâm
                    </span>
                  }
                  name="name"
                  rules={[
                    { required: true, message: 'Vui lòng nhập tên trung tâm' },
                  ]}
                  placeholder="Nhập tên trung tâm..."
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
                  placeholder="Nhập số điện thoại liên hệ..."
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
                      Sức chứa
                    </span>
                  }
                  name="capacity"
                  rules={[
                    { required: true, message: 'Vui lòng nhập sức chứa' },
                  ]}
                  placeholder="Ví dụ: 100 người/ngày..."
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
                      Giờ làm việc
                    </span>
                  }
                  name="workingHours"
                  rules={[
                    { required: true, message: 'Vui lòng nhập giờ làm việc' },
                  ]}
                  placeholder="Ví dụ: 8:00 - 17:00..."
                  fieldProps={{
                    size: 'large',
                    className: 'rounded-lg',
                  }}
                />
              </Col>
              <Col span={8}>
                <Form.Item
                  labelCol={{ span: 24 }}
                  label={
                    <span className="font-semibold text-gray-700">
                      Hình ảnh Logo
                    </span>
                  }
                  name="logo"
                >
                  <ConfigProvider locale={enUS}>
                    <Upload
                      name="logo"
                      listType="picture-card"
                      className="avatar-uploader"
                      maxCount={1}
                      multiple={false}
                      customRequest={handleUploadFileLogo}
                      beforeUpload={beforeUpload}
                      onChange={handleChange}
                      onRemove={(file) => handleRemoveFile(file)}
                      onPreview={handlePreview}
                      defaultFileList={
                        dataInit?.centerId
                          ? [
                              {
                                uid: uuidv4(),
                                name: dataInit?.image ?? '',
                                status: 'done',
                                url: `${'http://localhost:8080/'}storage/center/${
                                  dataInit?.image
                                }`,
                              },
                            ]
                          : []
                      }
                    >
                      <div>
                        {loadingUpload ? <LoadingOutlined /> : <PlusOutlined />}
                        <div style={{ marginTop: 8 }}>Upload</div>
                      </div>
                    </Upload>
                  </ConfigProvider>
                </Form.Item>
              </Col>

              <Col span={16}>
                <ProFormTextArea
                  label={
                    <span className="font-semibold text-gray-700">Địa chỉ</span>
                  }
                  name="address"
                  rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
                  placeholder="Nhập địa chỉ chi tiết của trung tâm..."
                  fieldProps={{
                    autoSize: { minRows: 4 },
                    size: 'large',
                    className: 'rounded-lg',
                  }}
                />
              </Col>
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

export default ModalCenter;
