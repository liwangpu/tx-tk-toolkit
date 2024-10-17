import { observer } from 'mobx-react-lite';
import React from 'react';
import styles from './index.module.less';

const Page: React.FC = observer(() => {

  return (
    <div className={styles['page']}>

    </div>
  );
});

Page.displayName = 'Adding';

export default Page;