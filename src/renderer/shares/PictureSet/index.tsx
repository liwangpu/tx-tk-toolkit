import { PlusOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd';
import { Image, Upload } from 'antd';
import axios from 'axios';
import { observer } from 'mobx-react-lite';
import React, { useRef, useState } from 'react';
import { getAttachmentUrl, useEvent } from '../../utils';
import { isFunction } from 'lodash';

export interface IPictureSetProps {
  category?: string;
  value?: string[];
  onChange?: (val: string[]) => void;
}

const transferFileList = (ids?: string[]) => {
  if (!ids || !ids.length) return [];
  return ids.map(id => ({
    uid: id,
    name: id,
    status: 'done',
    url: getAttachmentUrl({ id, isAvatar: true }),
  })) as any;
};

export const PictureSet: React.FC<IPictureSetProps> = observer(props => {

  const { category, value, onChange } = props;
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>(transferFileList(value));
  const imageRef = useRef<string[]>(value);

  const handleUploadAvatar: UploadProps['customRequest'] = useEvent(async (options) => {
    const params = new FormData();
    if (category) {
      params.append('category', category);
    }
    params.append('type', 'avatar');
    params.append('file', options.file);
    try {
      const { data } = await axios.request({
        url: '/api/attachment/upload',
        method: 'POST',
        data: params,
      });

      options.onSuccess({ uid: data });
      if (isFunction(onChange)) {
        const images = imageRef.current || [];
        if (!images.some(v => v === data)) {
          images.push(data);
        }
        imageRef.current = images;
        onChange(images);
      }
      setPreviewImage(getAttachmentUrl({ id: data }));
    } catch (error) {
      options.onError(error);
    }
  });

  const handleRemoveAvatar: UploadProps['onRemove'] = useEvent(async (options) => {
    try {
      const uid = options.response?.uid || options.uid;
      await axios.request({
        url: `/api/attachment/${uid}`,
        method: 'DELETE',
      });

      if (isFunction(onChange)) {
        let images = imageRef.current || [];
        images = images.filter(x => x !== uid);
        imageRef.current = images;
        onChange(images);
      }
      setPreviewImage(null);
    } catch (error) {
      //
    }
  });

  const handlePreview = useEvent(() => {
    setPreviewOpen(true);
  });

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) =>
    setFileList(newFileList);

  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>点击上传</div>
    </button>
  );

  return (
    <>
      <Upload
        multiple={true}
        customRequest={handleUploadAvatar}
        accept='image/*'
        listType="picture-card"
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}
        onRemove={handleRemoveAvatar}
      >
        {uploadButton}
      </Upload>
      {previewImage && previewOpen && (
        <Image
          wrapperStyle={{ display: 'none' }}
          width={100}
          height={100}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
          }}
          src={previewImage}
        />
      )}
    </>
  );
});

PictureSet.displayName = 'PictureSet';
