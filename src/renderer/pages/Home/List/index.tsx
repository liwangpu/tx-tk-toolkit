import { ActionType, ProColumns, ProTable, ProTableProps } from '@ant-design/pro-components';
import { observer } from 'mobx-react-lite';
import { useRef } from 'react';
import { values } from 'mobx';
// import { EDIT_VIEW } from '..';
import { CopyText, ITabsLayoutPageModel } from '../../../shares';
import { appStore } from '../../../stores';
import { GenerateShortId, UITools, useEvent } from '../../../utils';
import { Button, Space, Table, message } from 'antd';
import axios from 'axios';
import * as dayjs from 'dayjs';
import { useMessageCenter } from '../../../hooks';

type ShopItem = {
  id: number;
  name: string;
  companySKU: string;
  price: number;
};

type ITableStartupProps = Partial<ProTableProps<ShopItem, any>>;

export interface IShopListProps {
  tabs: ITabsLayoutPageModel;
}

const ShopList: React.FC<IShopListProps> = observer(props => {

  const { tabs } = props;
  const { TKAccountStore } = appStore;
  const actionRef = useRef<ActionType>();

  const messsageCenter = useMessageCenter();

  const handleBatchOpen = useEvent(async (ids: any[]) => {
    // message.info('开始下载,请稍后!');
    // // @ts-ignore
    // const fileName = `店铺导出-${dayjs(+new Date()).format(
    //   'YYYYMMDD',
    // )}.xlsx`;
    // axios({
    //   url: `/api/store/export`,
    //   data: {
    //     ids,
    //   },
    //   method: 'POST',
    //   responseType: 'blob',
    // }).then((response) => {
    //   const href = URL.createObjectURL(response.data);
    //   const link = document.createElement('a');
    //   link.href = href;
    //   link.setAttribute('download', fileName);
    //   document.body.appendChild(link);
    //   link.click();
    //   document.body.removeChild(link);
    //   URL.revokeObjectURL(href);
    // });
  });

  const handleCancelSelect = useEvent(() => {
    // actionRef.current.reload();
    console.log(`actionRef.current.:`, actionRef.current);
    actionRef.current.clearSelected();
  });

  const tableStartupProps: ITableStartupProps = {
    rowKey: "id",
    // options: {
    //   setting: {
    //     listsHeight: 400,
    //   },
    // },
    rowSelection: {
      selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT],
      // defaultSelectedRowKeys: [1],
    },
    tableAlertOptionRender: ({
      selectedRowKeys,
      selectedRows,
      onCleanSelected,
    }) => {
      return (
        <Space size={16}>
          <a color="danger" onClick={handleCancelSelect}>取消</a>
          <a onClick={() => handleBatchOpen(selectedRowKeys)}>批量打开</a>
        </Space>
      );
    },
    pagination: {
      defaultPageSize: 10,
    },
    request: async (params, sort) => {
      await TKAccountStore.query({ pagination: UITools.transferPagination(params), sort: UITools.transferSort(sort), filter: UITools.transferFilter(params) });
      return { data: values(TKAccountStore.accounts) as any[], total: TKAccountStore.total };
    },
  };

  const columns: ProColumns<ShopItem>[] = [
    {
      key: 'email',
      title: '邮箱',
      dataIndex: 'email',
      sorter: true,
      ellipsis: true,
      render(_, entity) {
        return (<CopyText content={entity['email']} />);
      }
    },
    {
      key: 'name',
      title: '昵称',
      dataIndex: 'name',
      sorter: true,
      ellipsis: true,
    },
    {
      key: 'is_register',
      title: '是否注册',
      dataIndex: 'is_register',
      sorter: true,
      width: 100,
      valueType: 'select',
      valueEnum: {
        true: { text: '是' },
        false: { text: '否' },
      },
    },
    {
      key: 'country',
      title: '国家',
      dataIndex: 'country',
      width: 100,
      render(_, entity) {
        const country = entity['country'];
        const countryName = country?.name;
        return (<span>{countryName}</span>);
      }
    },
    {
      key: 'remark',
      title: '备注',
      dataIndex: 'remark',
      hideInSearch: true,
      ellipsis: true,
      width: 180,
    },
    {
      key: 'option',
      title: '操作',
      valueType: 'option',
      width: 140,
      render: (text, record, _, action) => {
        // console.log(`record:`, record);
        return [
          <a
            key="editable"
            onClick={async () => {
              // const dataId = record.id as any;
              // await TKAccountStore.getById(dataId);
              // tabs.addTab({ ...EDIT_VIEW, key: GenerateShortId('tab'), dataId, name: `编辑-${record.name}` });
            }}
          >
            打开
          </a>,
        ];
      }
    },
  ];

  return (
    <ProTable<ShopItem>
      {...tableStartupProps}
      columns={columns}
      actionRef={actionRef}
    />
  );
});

ShopList.displayName = 'ShopList';

export default ShopList;

