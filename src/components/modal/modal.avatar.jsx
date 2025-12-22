import { useState } from 'react';
import { Modal, Upload, message, Spin } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import axios from '../../config/axios-customize';

const ModalAvatar = ({ open, setOpen, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  const beforeUpload = (file) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('Chỉ được upload file ảnh!');
      return false;
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('Kích thước ảnh phải nhỏ hơn 5MB!');
      return false;
    }
    return true;
  };

  const handleUpload = async ({ file, onSuccess: onUploadSuccess }) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('avatar', file);

    try {
      // Step 1: Upload to Cloudinary via backend
      const uploadRes = await axios.post('/files/upload-avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });

      const avatarUrl = uploadRes.url;
      setImageUrl(avatarUrl);

      // Step 2: Update user avatar in database (save original URL without timestamp)
      const updateRes = await axios.post(
        '/auth/update-avatar',
        { avatar: avatarUrl },
        { withCredentials: true }
      );

      if (updateRes.statusCode === 200) {
        message.success('Cập nhật ảnh đại diện thành công!');
        onUploadSuccess();

        // Call onSuccess callback to reload user data
        if (onSuccess) {
          onSuccess(avatarUrl);
        }

        setTimeout(() => {
          setOpen(false);
          setImageUrl('');
          // Force reload the page to clear image cache
          window.location.reload();
        }, 500);
      }
    } catch (error) {
      console.error('Upload avatar error:', error);
      message.error(
        error.response?.data?.message || 'Không thể cập nhật ảnh đại diện'
      );
    } finally {
      setLoading(false);
    }
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Tải ảnh lên</div>
    </div>
  );

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
            <PlusOutlined className="text-white" />
          </div>
          <span className="font-bold">Thay đổi ảnh đại diện</span>
        </div>
      }
      open={open}
      onCancel={() => {
        setOpen(false);
        setImageUrl('');
      }}
      footer={null}
      centered
      width={500}
    >
      <Spin spinning={loading} tip="Đang tải ảnh lên...">
        <div className="py-6">
          <Upload
            name="avatar"
            listType="picture-circle"
            className="avatar-uploader"
            showUploadList={false}
            beforeUpload={beforeUpload}
            customRequest={handleUpload}
            disabled={loading}
          >
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="avatar"
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  objectFit: 'cover',
                }}
              />
            ) : (
              uploadButton
            )}
          </Upload>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 mb-2">
              Click vào vòng tròn để chọn ảnh
            </p>
            <p className="text-xs text-gray-400">
              Hỗ trợ: JPG, PNG, WEBP (tối đa 5MB)
            </p>
          </div>
        </div>
      </Spin>

      <style jsx>{`
        .avatar-uploader {
          display: flex;
          justify-content: center;
        }
        .avatar-uploader :global(.ant-upload) {
          width: 150px;
          height: 150px;
          border-radius: 50%;
          border: 2px dashed #d9d9d9;
          transition: all 0.3s;
        }
        .avatar-uploader :global(.ant-upload:hover) {
          border-color: #1890ff;
        }
      `}</style>
    </Modal>
  );
};

export default ModalAvatar;
