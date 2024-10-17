import { PlusOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd';
import { Image, Upload } from 'antd';
import axios from 'axios';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useRef, useState } from 'react';
import { getAttachmentUrl, useEvent } from '../../utils';
import { isFunction } from 'lodash';

export interface IAvatarProps {
  category?: string;
  value?: string;
  onChange?: (val: string) => void;
}

export const Avatar: React.FC<IAvatarProps> = observer(props => {

  const { category, value, onChange } = props;
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string>();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const latestValueRef = useRef<string>();

  const handleChange = useEvent((val?: string) => {
    if (isFunction(onChange)) {
      onChange(val);
      latestValueRef.current = val;
    }
  });

  const handlePreview = useEvent(() => {
    setPreviewOpen(true);
  });

  const handleUploadAvatar: UploadProps['customRequest'] = useEvent(async (options) => {
    const params = new FormData();
    if (category) {
      params.append('category', category);
    }
    params.append('type', 'avatar');
    params.append('file', options.file);
    console.log(`options:`,options);
    try {
      const { data } = await axios.request({
        url: '/api/attachment/upload',
        method: 'POST',
        data: params,
      });

      options.onSuccess({ uid: data });
      handleChange(data);
      setPreviewImage(getAttachmentUrl({ id: data }));
    } catch (error) {
      options.onError(error);
    }
  });

  const handleRemoveAvatar: UploadProps['onRemove'] = useEvent(async (options) => {
    try {
      await axios.request({
        url: `/api/attachment/${value}`,
        method: 'DELETE',
      });

      handleChange(null);
      setPreviewImage(null);
    } catch (error) {
      //
    }
  });

  const handleFileChange: UploadProps['onChange'] = useEvent(({ fileList: newFileList }) => {
    setFileList(newFileList)
  });

  useEffect(() => {
    if (value === latestValueRef.current) return;
    const files = [];
    if (value) {
      files.push({
        uid: value,
        name: value,
        status: 'done',
        url: getAttachmentUrl({ id: value, isAvatar: true }),
      });
    }
    setPreviewImage(value ? getAttachmentUrl({ id: value }) : null);
    setFileList(files);
  }, [value])


  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>点击上传</div>
    </button>
  );

  return (
    <>
      <Upload
        customRequest={handleUploadAvatar}
        accept='image/*'
        listType="picture-card"
        maxCount={1}
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleFileChange}
        onRemove={handleRemoveAvatar}
      >
        {fileList.length < 1 ? uploadButton : null}
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

Avatar.displayName = 'Avatar';
