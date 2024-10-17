import axios from 'axios';
import { IAttachmentInfo } from '../../interfaces';
import { isArray, isFunction, xor } from 'lodash';
import type { UploadFile, UploadProps } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useEvent } from '../../utils';

interface IFile {
  uid: string,
  name: string;
  response?: { uid: string };
}

const getFirstItem = (attachs: string[]) => {
  if (!attachs) return null;
  return attachs.length ? attachs[0] : null;
}

export function useUploaderState(props: {
  attachmentType?: string,
  category?: string,
  multiple?: boolean;
  value?: any,
  onChange?: (val: any) => void,
}) {
  const { category, attachmentType, multiple, value, onChange } = props;
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const attachementRef = useRef<Set<string>>(new Set());

  const handleReportChange = useEvent(() => {
    const attachementSet = attachementRef.current || new Set();
    const attachements = [...attachementSet.values()];
    const val = multiple ? attachements : getFirstItem(attachements);
    console.log(`handleReportChange:`, val);
    if (isFunction(onChange)) {
      onChange(val);
    }
  });

  const handleUpload: UploadProps['customRequest'] = useEvent(async (options) => {
    const params = new FormData();
    if (category) {
      params.append('category', category);
    }
    params.append('type', attachmentType);
    params.append('file', options.file);
    try {
      const { data } = await axios.request({
        url: '/api/attachment/upload',
        method: 'POST',
        data: params,
      });

      options.onSuccess({ uid: data });
      const attachementSet = attachementRef.current;
      attachementSet.add(data);
      attachementRef.current = attachementSet;
      handleReportChange();
    } catch (error) {
      options.onError(error);
    }
  });

  const handleRemove: UploadProps['onRemove'] = useEvent(async (file: IFile) => {
    const uid = file.response?.uid || file.uid;
    try {
      await axios.request({
        url: `/api/attachment/${uid}`,
        method: 'DELETE',
      });

      const attachementSet = attachementRef.current;
      attachementSet.delete(uid);
      handleReportChange();
    } catch (error) {
      //
    }
  });

  const handleFileChange: UploadProps['onChange'] = useEvent(({ fileList: newFileList }) => {
    setFileList(newFileList)
  });

  const handleDownload = useEvent((file: IFile) => {
    const uid = file.response?.uid || file.uid;
    const link = document.createElement('a');
    link.href = `/api/attachment/view/${uid}`;
    link.setAttribute('download', file.name);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });

  useEffect(() => {
    (async () => {
      const files = [];
      if (value) {
        let attachmentIds: string[];
        if (isArray(value)) {
          attachmentIds = value;
        } else {
          attachmentIds = [value];
        }
        const atachementMap = attachementRef.current || new Set();
        const latestAttachemenIds = [...atachementMap.values()];
        if (!xor(latestAttachemenIds, attachmentIds).length) return;

        const { data } = await axios.request({
          url: '/api/attachment/infos',
          method: 'POST',
          data: {
            ids: attachmentIds
          },
        }) as { data: IAttachmentInfo[] };

        const attachmentMap = new Map(data.map(it => ([it.id, it])));
        attachmentIds.forEach(id => {
          const attach = attachmentMap.get(id);
          files.push({
            uid: id,
            name: attach.originalname,
            status: 'done',
          });
        });

        attachementRef.current = new Set(attachmentIds);
      } else {
        attachementRef.current?.clear();
      }

      setFileList(files);

    })();
  }, [value])

  return {
    fileList,
    handleFileChange,
    handleUpload,
    handleRemove,
    handleDownload,
  };
}