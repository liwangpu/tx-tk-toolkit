import { UploadOutlined } from '@ant-design/icons';
import { Button, Upload } from 'antd';
import { observer } from 'mobx-react-lite';
import { useUploaderState } from './common';

export interface IFileUploaderProps {
  accept?: string;
  multiple?: boolean;
  readonly?: boolean;
  value?: any;
  onChange?: (val: any) => void;
}



const FileUploader: React.FC<IFileUploaderProps> = observer(props => {
  const { readonly } = props;
  const showUploadList = {
    showPreviewIcon: false,
    showRemoveIcon: readonly ? false : true,
    showDownloadIcon: true,
  };
  const {
    fileList,
    handleFileChange,
    handleUpload,
    handleRemove,
    handleDownload,
  } = useUploaderState(props);

  // const handleDownload = (f: any) => {
  //   console.log(`download:`, f);
  //   return null;
  // };

  const renderButtons = () => {
    if (readonly) return;

    return (
      <>
        <Button icon={<UploadOutlined />}>上传</Button>
      </>
    );
  };

  return (
    <Upload
      {...props}
      showUploadList={showUploadList}
      // listType="picture"
      fileList={fileList}
      onChange={handleFileChange}
      customRequest={handleUpload}
      onRemove={handleRemove}
      onDownload={handleDownload}
    >
      {renderButtons()}
    </Upload>

  );
});

FileUploader.displayName = 'FileUploader';

export default FileUploader;