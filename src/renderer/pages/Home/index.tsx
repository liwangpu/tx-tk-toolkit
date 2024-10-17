import { BarsOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { observer } from 'mobx-react-lite';
import { ITabDefinition, TabsLayoutPage, useTabsLayoutPageModel } from '../../shares';
import { GenerateShortId, useEvent } from '../../utils';
import ListView from './List';
// import EditShop from './Edit';

const LIST_VIEW: ITabDefinition = {
  key: 'list-shop',
  name: '所有账号',
  icon: (<BarsOutlined />),
  children: ({ tabs }) => (<ListView tabs={tabs} />),
};

// export const EDIT_VIEW: ITabDefinition = {
//   key: 'edit-shop',
//   name: '新建店铺',
//   children: ({ tab, dataId }) => (<EditShop tab={tab} id={dataId} />),
//   closable: true,
// };

export const Component = observer(() => {

  const tabsModel = useTabsLayoutPageModel({
    pageName: 'TK账号',
    tabs: [
      // EDIT_VIEW,
      LIST_VIEW,
    ],
  });

  const handleAdd = useEvent(() => {
    // tabsModel.addTab({ ...EDIT_VIEW, key: GenerateShortId('tab') });
  });

  const headerButtonArea = () => {
    return (
      <Button type='primary' onClick={handleAdd}>新建</Button>
    );
  };

  return (
    <TabsLayoutPage model={tabsModel} appHeader={headerButtonArea()} />
  );
});

Component.displayName = 'Home';
