import { message } from 'antd';
import { useEvent } from '../../utils';
import styles from './index.module.less';
import copy from 'copy-to-clipboard';
import { isEmpty } from 'lodash';

const CopyText: React.FC<{ content: string }> = props => {
  const { content } = props;

  const handleCopy = useEvent(() => {
    if (isEmpty(content)) return;
    copy(content.trim());
    message.info('复制成功!');
  });

  return (
    <>
      {content ? <span className={styles['copy-text']} onClick={handleCopy}>{content}</span> : null}
    </>
  );
}

CopyText.displayName = 'CopyText';

export default CopyText;