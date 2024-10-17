import { CopyOutlined, RobotOutlined } from '@ant-design/icons';
import { Button, Input, Space, Tooltip, message } from 'antd';
import { observer } from 'mobx-react-lite';
import { useEvent } from '../../utils';
import { isFunction } from 'lodash';
import { useState } from 'react';
import copy from 'copy-to-clipboard';

const STYLE = {
  width: '100%'
};

export interface INoInputProps {
  disabled?: boolean;
  readonly?: boolean;
  value?: string;
  onChange?: (val: string) => void;
  enableArrangeNo?: boolean;
  enableCopy?: boolean;
  arrangeNo?: (val?: string) => Promise<string>;
}

const NoInput: React.FC<INoInputProps> = observer(props => {

  const { value, onChange, disabled, readonly, enableArrangeNo, enableCopy, arrangeNo, } = props;
  const [loading, setLoading] = useState<boolean>(false)

  const handleArrangeNo = useEvent(async () => {
    if (!isFunction(arrangeNo)) return;
    if (!isFunction(onChange)) return;
    let val = value;
    if (val[val.length - 1] !== '-') {
      message.info('如果需要编排编号,那么输入框以"-"结尾!');
      return;
    }
    setLoading(true);
    try {
      val = await arrangeNo(value);
      onChange(val);
    } catch (error) {
      //
    }
    setLoading(false);
  });

  const handleChange = useEvent((e: any) => {
    const val = e.target.value;
    if (!isFunction(onChange)) return;
    onChange(val);
  });

  const handleCopy = useEvent(() => {
    copy(value);
    message.info('复制成功!');
  });

  const renderButtons = () => {
    return (
      <>
        {enableArrangeNo && (
          <Tooltip title='编排序号'>
            <Button loading={loading} disabled={!value} type='primary' icon={<RobotOutlined />} onClick={handleArrangeNo}></Button>
          </Tooltip>
        )}
        {enableCopy && (
          <Tooltip title='复制'>
            <Button disabled={!value} icon={<CopyOutlined />} onClick={handleCopy}></Button>
          </Tooltip>
        )}
      </>
    );
  };


  return (
    <Space.Compact style={STYLE}>
      <Input value={value} onChange={handleChange as any} disabled={disabled} readOnly={readonly} />
      {renderButtons()}
    </Space.Compact>
  );
});

NoInput.displayName = 'NoInput';

export default NoInput;