 
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
} from '@ant-design/icons';
import enUS from 'antd/es/calendar/locale/en_US';

import {
  callCreateCenter,
  callUpdateCenter,
} from '../../config/api.center';
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
        info?.file?.error?.event?.message ?? 'An error occurred while uploading the file.'
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
      console.log(dataInit)
      const res = await callUpdateCenter(
        dataInit.centerId,
        name,
        address,
        phoneNumber,
        capacity,
        workingHours,
        dataLogo[0].name
      );
      console.log(res)

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
              <>
                {dataInit?.centerId ? 'Update Center' : 'Create New Center'}
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
            }}
            scrollToFirstError={true}
            preserve={false}
            form={form}
            onFinish={submitCenter}
            initialValues={dataInit?.centerId ? dataInit : {}}
            submitter={{
              render: (_, dom) => <FooterToolbar>{dom}</FooterToolbar>,
              submitButtonProps: {
                icon: <CheckSquareOutlined />,
              },
              searchConfig: {
                resetText: 'Cancel',
                submitText: <>{dataInit?.centerId ? 'Update' : 'Create'}</>,
              },
            }}
          >
            <Row gutter={16}>
              <Col span={12}>
                <ProFormText
                  label='Center Name'
                  name='name'
                  rules={[{ required: true, message: 'Please do not leave blank' }]}
                  placeholder='Enter center name...'
                />
              </Col>
              <Col span={12}>
                <ProFormText
                  label='Phone Number'
                  name='phoneNumber'
                  rules={[{ required: true, message: 'Please do not leave blank' }]}
                  placeholder='Center phone number...'
                />
              </Col>
              <Col span={12}>
                <ProFormText
                  label='Capacity'
                  name='capacity'
                  rules={[{ required: true, message: 'Please do not leave blank' }]}
                  placeholder='Enter capacity...'
                />
              </Col>
              <Col span={12}>
                <ProFormText
                  label='Working Hours'
                  name='workingHours'
                  rules={[{ required: true, message: 'Please do not leave blank' }]}
                  placeholder='Center working hours...'
                />
              </Col>
              <Col span={8}>
                <Form.Item labelCol={{ span: 24 }} label='Logo Image' name='logo'>
                  <ConfigProvider locale={enUS}>
                    <Upload
                      name='logo'
                      listType='picture-card'
                      className='avatar-uploader'
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
                                url: `${'http://localhost:8080/'}storage/center/${dataInit?.image}`,
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
                  label='Address'
                  name='address'
                  rules={[{ required: true, message: 'Please do not leave blank' }]}
                  placeholder='Enter company address...'
                  fieldProps={{
                    autoSize: { minRows: 4 },
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
            <img alt='example' style={{ width: '100%' }} src={previewImage} />
          </Modal>
        </>
      )}
    </>
  );
};

export default ModalCenter;