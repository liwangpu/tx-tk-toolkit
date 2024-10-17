import { IPaginationParams } from '../interfaces';
import { cloneDeep, isNil, omit } from 'lodash';
import { GenerateShortId } from './id-generator';
import { ProFormInstance } from '@ant-design/pro-components';
import { Empty, Image, notification } from 'antd';
import { getAttachmentUrl } from './common';
import dayjs from 'dayjs';
import escapeStringRegexp from 'escape-string-regexp';

export function transferPagination(params?: { current?: number, pageSize?: number }): IPaginationParams {
  const { current, pageSize } = params;

  return { page: current || 1, pageSize: pageSize || 15 };
}

export function transferSort(sort?: { [key: string]: string }) {
  const _sort = {};
  if (sort) {
    const fields = Object.keys(sort);
    fields.forEach(f => {
      _sort[f] = sort[f] === 'descend' ? 'desc' : 'asc';
    });
  }
  return _sort;
}

export function transferFilter(params?: Record<string, any>) {
  return omit(params, ['current', 'pageSize']);
}

const MOCK_ID_PREFIX = 'mock';

export function generateMockDataId() {
  return GenerateShortId(MOCK_ID_PREFIX);
}

export function emptyTableResult() {
  return { data: [], total: 0 };
}

export function checkMockId(id: string) {
  return id && id.startsWith(MOCK_ID_PREFIX);
};

export function removeMocekIds(datas: any[]) {
  if (!datas || !datas.length) return [];
  datas = cloneDeep(datas);
  for (const d of datas) {
    if (checkMockId(d.id)) {
      delete d.id;
    }
  }
  return datas;
}

export enum FilterOperator {
  includes = '$includes',
  isTruly = '$isTruly',
  isFalsy = '$isFalsy',
}

export function genCommonFilter(props: { property: string, value?: any, operator?: FilterOperator }) {
  let { property, value, operator = FilterOperator.includes } = props;
  if (value && operator === FilterOperator.includes) {
    value = escapeStringRegexp(value);
  }
  return {
    [property]: {
      [operator]: value,
    }
  };
}

export async function checkFormValidate(form: ProFormInstance) {
  let result = false;
  try {
    result = await form.validateFields();
  } catch (error) {
    result = false;
  }
  return result;
}

export function showSuccessMessage(message?: string) {
  const description = message ? message : '操作成功!';
  notification.open({
    message: '温馨提示',
    duration: 2,
    description,
  });
}

export function showErrorMessage(message?: any) {
  console.log(`error message:`, message);
  const description = message ? `操作过程出现异常,异常信息如下:${JSON.stringify(message)}` : '操作失败!';
  notification.open({
    message: '温馨提示',
    duration: 2,
    description,
  });
}

const imageStyle = {
  width: '60px',
  height: '60px',
  margin: '8px',
};

export function renderAvatarImage(props: { id: string, size?: number }) {
  const { id, size = 60 } = props;
  if (!id) {
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='待上传' style={imageStyle} />;
  }
  return (
    <Image
      width={size}
      height={size}
      preview={{
        destroyOnClose: true,
        imageRender: () => (
          <Image
            preview={false}
            src={getAttachmentUrl({ id })}
          />
        ),
        toolbarRender: () => null,
      }}
      src={getAttachmentUrl({ id, isAvatar: true })}
    />
  );
}

export function renderPictureSet(props: { ids: string[] }) {
  const { ids } = props;
  if (!ids || !ids.length) {
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='待上传' style={imageStyle} />;
  }
  return ids.map(id => (
    <Image
      key={id}
      width={100}
      height={100}
      preview={{
        destroyOnClose: true,
        imageRender: () => (
          <Image
            preview={false}
            src={getAttachmentUrl({ id })}
          />
        ),
        toolbarRender: () => null,
      }}
      src={getAttachmentUrl({ id, isAvatar: true })}
    />
  ));
}

export function dateTimeToUnixTimestamp(date: any) {
  if (!date) return date;
  return dayjs(date).valueOf();
}

export function formatDateProperties(obj: any, dateProperties: string[]) {
  if (!obj || !dateProperties.length) return;
  for (const p of dateProperties) {
    const date = obj[p];
    if (!isNil(date)) {
      obj[p] = dayjs(date).valueOf();
    }
  }
}