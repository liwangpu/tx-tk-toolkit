import { Button } from 'antd';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { UserRepository } from '../../repositories';
import styles from './index.module.less';

export const Component: React.FC = observer(() => {

  const handleTest = async () => {

    try {
      const profile = await UserRepository.getProfile();
      console.log(`profile:`, profile);
    } catch (error) {
      console.log(`has error:`,);
    }

  };

  return (
    <div className={styles['page']}>
      {/* <Button onClick={handleTest}>测试</Button> */}
    </div>
  );
});

Component.displayName = 'Setting';
