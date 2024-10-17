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
      <iframe className={styles['page__content']} src="https://whoer.net/zh" frameBorder="0" />
    </div>
  );
});

Component.displayName = 'Whoer';
