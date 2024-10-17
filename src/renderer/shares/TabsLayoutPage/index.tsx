import { CaretDownOutlined, CloseOutlined, HeartOutlined } from '@ant-design/icons';
import { Button, Dropdown, MenuProps, Tabs } from 'antd';
import { isFunction } from 'lodash';
import { observer } from 'mobx-react-lite';
import { Instance, getParent, t } from 'mobx-state-tree';
import { useEffect, useMemo } from 'react';
import styles from './index.module.less';
import { useEvent } from '../../utils';

const TAB_NAV_STYLE = {
  backgroundColor: '#FFF',
  padding: '0 16px',
};
const TAB_ADVANCE_MENU_TRIGGER = ['click'];

interface ITabChildren {
  (props: { tabs: any, tab: any, dataId?: string }): React.ReactNode;
}

const TabContainer = (children: React.ReactNode) => {
  return (
    <div className={styles['tab-container']}>
      {children}
    </div>
  );
};

export interface ITabDefinition {
  key: string;
  name: string;
  closable?: boolean;
  icon?: React.ReactNode;
  dataId?: string;
  children?: ITabChildren;
  advanceMenus?: MenuProps['items'];
}

export interface ITabsLayoutPageProps {
  title: string;
  tabs: ITabDefinition[];
  headerButtonArea?: React.ReactNode;
}

const TabModel = t.model({
  key: t.string,
  name: t.string,
  closable: t.maybeNull(t.boolean),
  icon: t.maybeNull(t.frozen()),
  dataId: t.maybeNull(t.string)
})
  .volatile(() => {
    let _children: ITabChildren;
    return {
      setChildren(children: ITabChildren) {
        _children = children;
      },
      getChildren() {
        return _children;
      }
    };
  })
  .views(self => {

    return {
      toView() {
        const children = self.getChildren();
        const tabs = getParent(getParent(self));
        return {
          key: self.key,
          label: (<TabNav tab={self as any} />),
          children: isFunction(children) ? TabContainer(children({ tabs, tab: self as any, dataId: self.dataId })) : null,
        };
      },
    };
  })
  .actions(self => {

    const getTabs = (): ITabsLayoutPageModel => {
      return getParent(getParent(self));
    };
    const close = () => {
      const tabs = getTabs();
      tabs.closeTab(self.key);
    };
    const closeRightTab = () => {
      const tabs = getTabs();
      tabs.closeRightTab(self.key);
    };
    const closeOtherTab = () => {
      const tabs = getTabs();
      tabs.closeOtherTab(self.key);
    };
    return {
      close,
      closeRightTab,
      closeOtherTab,
      update(props: { name?: string, dataId?: string } = {}) {
        const { name, dataId } = props;
        if (name) {
          self.name = name;
        }

        if (dataId) {
          self.dataId = dataId;
        }
      }
    };
  });

const TabsLayoutPageModel = t.model({
  pageName: t.string,
  tabs: t.array(TabModel),
  activedTab: t.maybeNull(t.string),
})
  .views(self => {
    return {
      get tabViews() {
        return self.tabs.map(tab => tab.toView());
      }
    };
  })
  .actions(self => {

    const addTab = (def: ITabDefinition) => {
      if (self.tabs.some(t => t.key === def.key)) {
        self.activedTab = def.key;
        return;
      };
      const tab = TabModel.create({
        key: def.key,
        name: def.name,
        closable: def.closable,
        dataId: def.dataId,
        // icon: def.icon,
      });
      tab.setChildren(def.children);
      self.tabs.push(tab);
      self.activedTab = tab.key;
    };

    const closeTab = (tabKey: string) => {
      if (!tabKey) return;
      const tabIndex = self.tabs.findIndex(t => t.key === tabKey);
      if (tabIndex < 0) return;
      const tab = self.tabs.at(tabIndex);
      if (!tab.closable) return;
      const preTab = self.tabs.at(tabIndex - 1);
      self.activedTab = preTab.key;
      self.tabs.remove(tab);
    };

    const closeRightTab = (tabKey: string) => {
      if (!tabKey) return;
      const tabIndex = self.tabs.findIndex(t => t.key === tabKey);
      if (tabIndex < 0) return;
      const items = self.tabs.slice(tabIndex + 1);
      for (const tab of items) {
        if (tab.closable) {
          self.tabs.remove(tab);
        }
      }
    };

    const closeOtherTab = (tabKey: string) => {
      if (!tabKey) return;

      const needCloseTab = [];
      for (const tab of self.tabs) {
        if (tab.closable && tab.key !== tabKey) {
          needCloseTab.push(tab);
        }
      }

      for (const tab of needCloseTab) {
        self.tabs.remove(tab);
      }
    };

    return {
      addTab,
      activeTab(tabKey: string) {
        self.activedTab = tabKey;
      },
      closeTab,
      closeRightTab,
      closeOtherTab,
    };
  });

export type ITabModel = Instance<typeof TabModel>;
export type ITabsLayoutPageModel = Instance<typeof TabsLayoutPageModel>;

export interface IUseTabsLayoutPageModelProps {
  pageName: string;
  tabs: ITabDefinition[];
}

export function useTabsLayoutPageModel(props: IUseTabsLayoutPageModelProps): ITabsLayoutPageModel {

  const { pageName, tabs } = props;
  const model = useMemo<ITabsLayoutPageModel>(() => {
    const m = TabsLayoutPageModel.create({
      pageName,
    });

    if (tabs && tabs.length) {
      tabs.forEach(tab => m.addTab(tab));
      m.activeTab(tabs[0].key);
    }

    return m;
  }, []);

  return model;
}

const TabNav: React.FC<{ tab: ITabModel }> = observer(props => {

  const { tab } = props;

  const menu = useMemo<MenuProps>(() => {
    let items: MenuProps['items'] = [
      (tab.closable &&
      {
        key: 'close',
        label: (
          <span>关闭</span>
        ),
        onClick(e) {
          e.domEvent.stopPropagation();
          tab.close();
        },
      }),
      {
        key: 'close-right-tab',
        label: (
          <span>关闭右侧标签</span>
        ),
        onClick(e) {
          e.domEvent.stopPropagation();
          tab.closeRightTab();
        },
      },
      {
        key: 'close-other-tab',
        label: (
          <span>关闭其他标签</span>
        ),
        onClick(e) {
          e.domEvent.stopPropagation();
          tab.closeOtherTab();
        },
      },
    ];

    return { items: items.filter(m => !!m) };
  }, []);

  return (
    <div className={styles['tab-info']}>
      <p>{tab.name}</p>

      {!!menu.items.length && (
        <Dropdown menu={menu} trigger={TAB_ADVANCE_MENU_TRIGGER as any}>
          <div className={styles['tab-info-menu']}>
            <CaretDownOutlined />
          </div>
        </Dropdown>
      )}

    </div>
  );
});

export const TabsLayoutPage: React.FC<{ model: ITabsLayoutPageModel, appHeader?: React.ReactNode }> = observer(props => {

  const { model, appHeader } = props;
  // console.log(`model:`,model);
  // const toggleFavar = useEvent(() => { });

  return (
    <div className={styles['tabs-layout']}>
      <div className={styles['tabs-layout__header']}>
        <div className={styles['app-info']}>
          <p className={styles['app-title']}>{model.pageName}</p>
          <Button className={styles['app-info__button']} type='text' size='small' icon={<HeartOutlined />} />
        </div>
        <div className={styles['app-header']}>
          {appHeader}
        </div>
      </div>
      <div className={styles['tabs-layout__content']}>
        <Tabs
          className={styles['tabs-layout__tabs']}
          type="card"
          items={model.tabViews as any}
          activeKey={model.activedTab}
          size='small'
          tabBarStyle={TAB_NAV_STYLE}
          onTabClick={model.activeTab}
        />
      </div>
    </div>
  );
});

TabsLayoutPage.displayName = 'TabsLayoutPage';
