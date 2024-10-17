import axios from 'axios';
import { Instance, flow, t } from "mobx-state-tree";
import { IPaginationParams, ISortParams } from '../interfaces';
import { isNil } from 'lodash';
import { UITools } from '../utils';

export const TKAccountStore = t.optional(t.model({
  accounts: t.map(t.frozen()),
  total: t.number,
})
  .actions(self => {

    const transferSearchFormToFilter = async (props: { searchForm: Record<string, any> }) => {
      const { searchForm } = props;

      const { is_register, email } = searchForm;

      const filter: Record<string, any> = {};

      const andFilter: any[] = [];

      if (!isNil(email)) {
        andFilter.push(UITools.genCommonFilter({ property: 'email', value: email }));
      }

      if (!isNil(is_register)) {
        const isRegister = is_register === 'true';
        andFilter.push(UITools.genCommonFilter({ property: 'is_register', value: true, operator: isRegister ? UITools.FilterOperator.isTruly : UITools.FilterOperator.isFalsy }));
      }


      if (andFilter.length) {
        filter['$and'] = andFilter;
      }

      return filter;
    };

    const query = flow(function* (props: { pagination?: IPaginationParams, sort?: ISortParams, filter?: { [key: string]: any } } = {}) {
      const { pagination, sort: _sort, filter: searchForm } = props;

      const filter = yield transferSearchFormToFilter({ searchForm });

      const sort: string[] = [];

      const sortKeys = _sort ? Object.keys(_sort) : [];
      sortKeys.forEach(sk => {
        const isAsc = _sort[sk] === 'asc';
        sort.push(isAsc ? sk : `-${sk}`);
      });

      const requestParams = {
        ...pagination,
        appends: ['language', 'country'],
      };

      if (sort.length) {
        requestParams['sort'] = sort;
      }

      if (filter) {
        requestParams['filter'] = filter;
      }

      const { data } = yield axios.request({
        url: '/api/tk_account:list',
        method: 'Get',
        params: requestParams,
      });
      const { data: accounts, meta: { count } } = data;
      console.log(`accounts:`, accounts);

      self.accounts.clear();
      for (const item of accounts) {
        self.accounts.set(item.id, item);
      }
      self.total = count;
      return {
        data: accounts,
        total: count,
      };
    });

    const getById = flow(function* (id: string) {
      const { data: item } = yield axios.request({
        url: `/api/store/${id}`,
        method: 'GET',
      });
      self.accounts.set(id, item);
      return item;
    });

    const create = flow(function* (data: any) {
      const { data: item } = yield axios.request({
        url: '/api/store',
        method: 'POST',
        data,
      });
      self.accounts.set(item.id, item);
      // self.allShops.set(data.id, omit(item, ['productions']));
      return item;
    });

    const update = flow(function* (data: any) {
      const { data: item } = yield axios.request({
        url: '/api/store',
        method: 'PUT',
        data,
      });
      self.accounts.set(item.id, item);
      // self.allShops.set(data.id, omit(item, ['productions']));
      return item;
    });

    return {
      query,
      create,
      update,
      getById,
    };
  }),
  {
    accounts: {},
    total: 0,
  },
);

export type ITKAccountStore = Instance<typeof TKAccountStore>;