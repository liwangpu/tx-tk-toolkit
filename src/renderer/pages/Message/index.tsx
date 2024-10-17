import { observer } from 'mobx-react-lite';
import React from 'react';
import styles from './index.module.less';

export const Component: React.FC = observer(() => {

  return (
    <div className={styles['page']}>

    </div>
  );
});

Component.displayName = 'Message';
