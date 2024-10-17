import { Empty } from 'antd';
import { observer } from 'mobx-react-lite';
import React from 'react';
import styles from './index.module.less';

export const Component: React.FC = observer(() => {

  return (
    <div className={styles['page']}>
      <Empty description='哦吼，没有找到该页面，请检查页面路由是否输入正确！' />
    </div>
  );
});

Component.displayName = 'NotFound';
