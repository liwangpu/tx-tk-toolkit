import { observer } from 'mobx-react-lite';
import React, { useCallback } from 'react';
import styles from './index.module.less';
import classNames from 'classnames';
import { IAppPackage } from '../../interfaces';
import { appStore } from '../../stores';
import { values } from 'mobx';
import { ApplicationModel } from '../../stores/package-store';
import { useNavigate } from 'react-router-dom';

const AppPackageSelector: React.FC<{ close: (data?: any) => void }> = observer(({ close }) => {

  const navigate = useNavigate();
  const { packageStore } = appStore;
  const packages = values<any, IAppPackage>(packageStore.packages as any);
  const activedPackageId = packageStore.activedPackageId;
  const handleActivePackage = useCallback((pck: IAppPackage) => {
    close();
    const applications = values<any, ApplicationModel>(packageStore.applications as any);
    const firstApp = applications.find(app => app.packageId === pck.id && app.order === 0);
    if (firstApp) {
      navigate(firstApp.path);
    }
  }, []);

  const renderPackages = () => {
    return packages.map(p => {
      return (
        <div className={classNames(
          styles['package'],
          {
            [styles['package--actived']]: activedPackageId === p.id,
          }
        )} key={p.id} onClick={() => handleActivePackage(p)}>
          <p className={styles['package__title']}>{p.name}</p>
        </div>
      );
    });
  };

  return (
    <div className={styles['selector']}>
      <div className={styles['selector__header']}>
        <p className={styles['selector__title']}>选择应用包</p>
        {/* <Button className={styles['selector__button']} size='small' shape="circle" type="primary" icon={<PlusOutlined className={styles['selector-button-icon']} />} /> */}
      </div>
      <div className={styles['selector__content']}>
        {renderPackages()}
      </div>
    </div>
  );
});

AppPackageSelector.displayName = 'AppPackageSelector';

export default AppPackageSelector;