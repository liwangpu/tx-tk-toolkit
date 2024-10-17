import React, { useMemo, useState } from 'react';
import styles from './index.module.less';
import { NavLink } from 'react-router-dom';
import classnames from 'classnames';
import { AppstoreOutlined, HomeOutlined, HomeFilled, AppstoreFilled, MenuFoldOutlined, BellOutlined, SettingOutlined, SettingFilled, BellFilled, SpotifyOutlined, DribbbleCircleFilled, SpotifyFilled } from '@ant-design/icons';
import { Popover, Tooltip, TooltipProps } from 'antd';
import { observer } from 'mobx-react-lite';
import UserInfo, { UserAvator } from '../UserInfo';
import { appStore } from '../../stores';
import AppPackageSelector from '../AppPackageSelector';
import logoImg from '../../images/lc-logo.png';

interface IMenu {
  key: string;
  title: string;
  url?: string;
  icon: React.ReactNode;
  activedIcon?: React.ReactNode;
  popoverCard?: {
    component: React.FC<{ close: (data?: any) => void }>;
    option?: TooltipProps;
  };
}

// 固有静态按钮
const APP_MENUS: Array<IMenu> = [
  {
    key: 'home',
    title: '首页',
    url: '/app/home',
    icon: (<HomeOutlined />),
    activedIcon: (<HomeFilled />),
  },
  {
    key: 'app',
    title: '应用',
    url: '/app/application',
    icon: (<AppstoreOutlined />),
    activedIcon: (<AppstoreFilled />),
    popoverCard: {
      component: AppPackageSelector,
    },
  },
];

const AppSidebar: React.FC = observer(() => {

  const { userStore, preferenceStore } = appStore;
  const sidebarFolded = preferenceStore.appSidebarFolded;
  const [staticMenuPopoverCardOpen, setStaticMenuPopoverCardOpen] = useState<{ [menuKey: string]: boolean }>({});
  // // tab热键切换左边菜单栏折叠状态
  // useHotkeys('alt+tab', (evt) => {
  //   setSidebarFolded(!sidebarFolded);
  //   evt.preventDefault();
  // }, [sidebarFolded])
  const USER_MENUS = useMemo<Array<IMenu>>(() => {
    return [
      // {
      //   key: 'create',
      //   title: '创建',
      //   url: '/app/adding',
      //   icon: (<PlusCircleOutlined />),
      //   activedIcon: (<PlusCircleFilled />),
      // },
      {
        key: 'dns-check',
        title: 'Whoer',
        url: '/app/whoer',
        icon: (<SpotifyOutlined />),
        activedIcon: (<SpotifyFilled />),
      },
      {
        key: 'message',
        title: '消息',
        url: '/app/message',
        icon: (<BellOutlined />),
        activedIcon: (<BellFilled />),
      },
      {
        key: 'setting',
        title: '设置',
        url: '/app/setting',
        icon: (<SettingOutlined />),
        activedIcon: (<SettingFilled />),
      },
      {
        key: 'user',
        title: userStore.currentUser?.name || '用户',
        icon: (<UserAvator />),
        popoverCard: {
          component: UserInfo,
          option: {
            placement: "rightBottom",
          },
        },
      },
    ];
  }, [userStore.currentUser?.name]);

  const renderMenus = (menus: Array<IMenu>) => {

    const handleMenuClick = (menu: IMenu, evt: React.MouseEvent) => {
      if (!menu.popoverCard) { return; }
      evt.preventDefault();
    };

    const generatePopoverCardWrapper = (menu: IMenu, children: React.ReactNode) => {

      if (!menu.popoverCard) {
        return (
          <React.Fragment key={menu.key}>
            {children}
          </React.Fragment>
        );
      }

      const { component: PopoverCard, option = { placement: 'right' } } = menu.popoverCard;
      const isOpen = !!staticMenuPopoverCardOpen[menu.key];

      const onClose = () => {
        onOpenChange(false);
      };

      const onOpenChange = (open: boolean) => {
        setStaticMenuPopoverCardOpen((pre) => ({ ...pre, [menu.key]: open }));
      };

      return (
        <Popover {...option} open={isOpen} overlayInnerStyle={{ padding: '0 0 0 16px', backgroundColor: 'transparent', boxShadow: 'none' }} arrow={false} content={<PopoverCard close={onClose} />} trigger="click" key={menu.key} onOpenChange={open => onOpenChange(open)}>
          {/* 之所以要使用这个div,是因为Popover判断children如果是a标签,它会替换掉a标签上的classname而不是补充添加的形式,照成a标签样式不正确 */}
          <div className={styles['nav-wrapper']}>
            {children}
          </div>
        </Popover>
      );
    };

    const generateToolTipWrapper = (navLink: React.ReactNode, title: string) => {
      return (
        sidebarFolded ? (
          <Tooltip placement="right" title={title}>
            {navLink}
          </Tooltip>
        ) : navLink
      );
    };

    const generateNavLink = (menu: IMenu) => {
      const childrenFn = (state?: { isActive?: boolean }) => {
        return (
          <>
            {menu.icon && (
              <div className={styles['nav__icon']}>
                {state?.isActive ? (menu.activedIcon || menu.icon) : menu.icon}
              </div>
            )}
            <div className={styles['title-wrapper']}>
              <p className={styles['nav__title']}>{menu.title}</p>
            </div>
          </>
        );
      };

      if (menu.url) {
        return (
          <NavLink
            key={menu.key}
            to={menu.url as any}
            className={({ isActive }) => classnames(
              styles['nav'],
              {
                [styles['nav--actived']]: isActive ? "active" : "",
              }
            )}
            onClick={(e) => handleMenuClick(menu, e)}
          >
            {childrenFn}
          </NavLink>
        );
      }

      return (
        <div className={styles['nav']} key={menu.key}>
          {childrenFn()}
        </div>
      );
    };

    return menus.map(menu => generatePopoverCardWrapper(
      menu,
      generateToolTipWrapper(
        generateNavLink(menu),
        menu.title
      )
    ));
  };

  return (
    <div className={classnames(
      styles['app-sidebar'],
      {
        [styles['app-sidebar--folded']]: sidebarFolded
      }
    )}>

      <div className={styles['app-sidebar__header']}>
        <div className={styles['logo']}>
          <img className={styles['logo__icon']} src={logoImg} />
          <p className={styles['logo__title']}>TK助手</p>
        </div>
      </div>

      <div className={styles['app-sidebar__app-menus']}>
        <div className={styles['menu-container']}>
          {renderMenus(APP_MENUS)}
        </div>
      </div>

      <div className={styles['app-sidebar__favorate-menus']}>
        <div className={styles['menu-container']}>
          {/* {renderMenus(APP_MENUS)} */}
        </div>
      </div>

      <div className={styles['app-sidebar__user-menus']}>
        <div className={styles['menu-container']}>
          {renderMenus(USER_MENUS)}
        </div>
      </div>
      <div className={styles['app-sidebar__footer']}>
        <div className={styles['sidebar-shortcut']}>
          <div className={
            classnames(
              styles['nav'],
              styles['sidebar-shortcut__button'],
              {
                [styles['sidebar-shortcut__button--folded']]: sidebarFolded
              }
            )} onClick={() => preferenceStore.toggleAppSidebarFolded()}>
            <MenuFoldOutlined className={classnames(
              styles['nav-icon'],
              'button-icon',
            )} />
          </div>
        </div>
      </div>

    </div>
  );
});

AppSidebar.displayName = 'AppSidebar';

export default AppSidebar;
