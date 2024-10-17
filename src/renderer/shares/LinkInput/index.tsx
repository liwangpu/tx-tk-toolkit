import { ChromeOutlined, CopyOutlined } from '@ant-design/icons';
import { Button, Input, Space, Tooltip, message } from 'antd';
import { useEvent } from '../../utils';
import copy from 'copy-to-clipboard';
import styles from './index.module.less';

const LinkInput: React.FC<{
  value?: string;
  onChange?: (value?: any) => void;
  disabled?: boolean;
  readonly?: boolean;
}> = (props) => {
  const { value, onChange, disabled, readonly } = props;
  const handleOpen = useEvent(() => {
    window.open(value);
  });

  const handleCopy = useEvent(() => {
    copy(value);
    message.info('复制成功!');
  });

  const renderButtons = () => {
    if (readonly && !value) {
      return;
    }
    return (
      <>
        <Tooltip title='复制'>
          <Button disabled={!value} icon={<CopyOutlined />} onClick={handleCopy}></Button>
        </Tooltip>
        <Tooltip title='浏览器打开'>
          <Button disabled={!value} type='primary' icon={<ChromeOutlined />} onClick={handleOpen}></Button>
        </Tooltip>
      </>
    );
  };

  return (
    <Space.Compact className={styles['link-container']}>
      {readonly ? (
        <div className={styles['link-text']}>
          <p title={value}>{value}</p>
        </div>
      ) : (
        <Input value={value} onChange={onChange} disabled={disabled} readOnly={readonly} />
      )}
      {renderButtons()}
    </Space.Compact>
  );
};

export default LinkInput;