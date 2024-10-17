import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { appStore } from '../../stores';
import ListView from './ListView';
import Sidebar from './Sidebar';
import styles from './index.module.less';



export const Component: React.FC = observer(() => {

  const { packageStore } = appStore;
  const location = useLocation();


  useEffect(() => {
    packageStore.activePath(location.pathname);
    return () => {
      packageStore.activePath();
    };
  }, [location]);

  return (
    <div className={styles['page']}>
        <Sidebar />
        <ListView />
    </div>
  );
});

Component.displayName = 'Application';
