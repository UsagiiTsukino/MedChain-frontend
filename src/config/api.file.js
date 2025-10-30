import axios from './axios-customize';

export const callUploadSingleFile = (file, folderType) => {
  const bodyFormData = new FormData();
  bodyFormData.append('file', file);
  bodyFormData.append('folder', folderType);

  return axios({
    method: 'post',
    url: '/files',
    data: bodyFormData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
