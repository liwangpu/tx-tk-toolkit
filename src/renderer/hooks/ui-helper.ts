import { EditableFormInstance } from '@ant-design/pro-components';
import { useCallback, useRef, useState } from 'react';
import { isFunction, isNil } from 'lodash';
import { useEvent } from '../utils';

type AsyncFunction = (...args: any[]) => Promise<any>;

export default function debounceAsync(fn: AsyncFunction, wait: number) {
  let timeoutId: NodeJS.Timeout | undefined;

  return function (...args) {
    clearTimeout(timeoutId);

    return new Promise((resolve, reject) => {
      timeoutId = setTimeout(() => {
        fn(...args)
          .then(resolve)
          .catch(reject);
      }, wait);
    });
  };
}

export function useUniqueCheckRule(props: {
  message: string,
  check: (val: any) => Promise<boolean>,
}) {
  const { message, check } = props;

  const validator = useEvent(debounceAsync(async (rule: any, value: any) => {
    if (!isFunction(check)) return;
    if (isNil(value)) return;
    try {
      const existed = await check(value);
      if (existed) {
        return Promise.reject(message);
      } else {
        return Promise.resolve();
      }
    } catch (error) {
      return Promise.reject(`请求过程出现异常!`);
    }
  }, 120));

  return { validator };
}

export function useEditorListTable(props: { defaultEditableKeys?: string[] }) {

  const { defaultEditableKeys = [] } = props;
  const listTableRef = useRef<EditableFormInstance<any>>();
  const [editableKeys, setEditableRowKeys] = useState<any[]>(defaultEditableKeys);

  return {
    listTableRef,
    editableKeys,
    setEditableRowKeys,
    updateRowDatas(datas: any[]) {
      const table = listTableRef.current;
      const ids: string[] = [];
      for (let idx = 0; idx < datas.length; idx++) {
        const data = datas[idx];
        const newId = data.id;
        table.setRowData(idx, data);
        ids.push(newId);
      }
      setEditableRowKeys(ids);
    },
  };
}

