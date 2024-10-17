import { LeftOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IApplication } from '../../../interfaces';
import { appStore } from '../../../stores';
import styles from './index.module.less';

const Sidebar: React.FC = observer(() => {

  const [sidebarFolded, setSidebarFolded] = useState<boolean>();
  const { packageStore } = appStore;
  const navigate = useNavigate();
  const activedPackage = packageStore.activedPackage;
  const apps: Array<IApplication> = packageStore.activedPackageApps;
  const activedApplicationId: string = packageStore.activedApplicationId;

  const toggleSidebarFolded = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setSidebarFolded(pre => !pre);
  }, []);

  const handleActiveApplication = useCallback((id: string) => {
    navigate(id);
  }, []);


  const renderPackageHeader = () => {
    return (
      <div className={styles['package']}>
        <div className={styles['package__title']}>
          {activedPackage?.name}
        </div>

        <div className={styles['package__toolbar']}>
          {/* <Button className={classNames(styles['package-button'], styles['package-button__add'])} size='small' shape="circle" type="primary" icon={<PlusOutlined className={styles['package-button__icon']} />} onClick={handleCreateApp} /> */}
        </div>
      </div>
    );
  };

  const renderAppNavs = () => {


    return (
      <div className={styles['app-nav-container']}>
        {apps.map(app => (
          <div className={classNames(
            styles['app-nav'],
            {
              [styles['app-nav--actived']]: activedApplicationId === app.path,
            }
          )} key={app.path} onClick={() => handleActiveApplication(app.path)}>
            <p className={styles['app-nav__title']}>{app.name}</p>

            <div className={styles['app-nav__toolbar']}>
              {/* <Button className={classNames(styles['app-nav-button'])} type='link' size='small' icon={<EditOutlined />} onClick={e => handleEditApplication(p.id, e)} /> */}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={classNames(
      styles['sidebar'],
      {
        [styles['sidebar--folded']]: sidebarFolded,
      }
    )}>
      <div className={styles['sidebar__content']}>
        {renderPackageHeader()}
        {renderAppNavs()}
      </div>
      <div className={styles['sidebar__toolbar']}>
        <div className={styles['toolbar-button']} onClick={toggleSidebarFolded}>
          <LeftOutlined className={classNames(
            styles['toolbar-button__icon'],
            {
              [styles['toolbar-button__icon--folded']]: sidebarFolded,
            }
          )} />
        </div>
      </div>
    </div>
  );
});

Sidebar.displayName = 'Sidebar';

export default Sidebar;