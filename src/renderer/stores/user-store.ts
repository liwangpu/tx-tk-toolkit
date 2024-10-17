import { t, flow, Instance } from "mobx-state-tree";
import { UserRepository } from '../repositories';
import { IPaginationParams, ISortParams } from '../interfaces';
import axios from 'axios';
import { isNil } from 'lodash';
import { UITools } from '../utils';

export const CurrentUser = t.model({
  id: t.number,
  name: t.string,
  tenantId: t.maybeNull(t.string),
  tenantName: t.maybeNull(t.string),
  email: t.maybeNull(t.string),
  phone: t.maybeNull(t.string),
  type: t.maybeNull(t.string),
  status: t.maybeNull(t.boolean),
  remark: t.maybeNull(t.string),
});

export const UserStore = t.optional(t.model({
  users: t.map(t.frozen()),
  currentUser: t.maybeNull(CurrentUser),
})
  .actions(self => {

    const refreshProfile = flow(function* () {
      const profile = yield UserRepository.getProfile();

      self.currentUser = profile;
    });

    const query = flow(function* (props: { pagination?: IPaginationParams, sort?: ISortParams, filter?: any } = {}) {
      const { pagination, sort, filter: filterParms } = props;
      // console.log(`filterParms:`, filterParms);
      const { name, status, email, phone } = filterParms;

      const filter: Record<string, any> = {};

      const andFilter: any[] = [];
      if (!isNil(name)) {
        andFilter.push(UITools.genCommonFilter({ property: 'name', value: name }));
      }

      if (!isNil(email)) {
        andFilter.push(UITools.genCommonFilter({ property: 'email', value: email }));
      }

      if (!isNil(phone)) {
        andFilter.push(UITools.genCommonFilter({ property: 'phone', value: phone }));
      }

      if (!isNil(status)) {
        const _status = status === 'true';
        andFilter.push(UITools.genCommonFilter({ property: 'status', value: _status, operator: '$eq' }));
      }

      if (andFilter.length) {
        filter['$and'] = andFilter;
      }
      const { data } = yield axios.request({
        url: '/api/user/query',
        method: 'POST',
        data: {
          pagination,
          sort,
          filter,
        },
      });
      const { content = [], count } = data;
      self.users.clear();
      for (const item of content) {
        self.users.set(item.id, item);
      }
      return {
        data: content,
        total: count,
      };
    });

    const getById = flow(function* (id: string) {
      const { data: item } = yield axios.request({
        url: `/api/user/${id}`,
        method: 'GET',
      });
      // self.suppliers.set(id, item);
      return item;
    });

    const create = flow(function* (data: any) {
      const { data: item } = yield axios.request({
        url: '/api/user',
        method: 'POST',
        data,
      });
      self.users.set(data.id, item);
      return item;
    });

    const update = flow(function* (data: any) {
      const { data: item } = yield axios.request({
        url: '/api/user',
        method: 'PUT',
        data,
      });
      self.users.set(item.id, item);
      return item;
    });

    return {
      refreshProfile,
      query,
      getById,
      create,
      update,
    };
  }),
  {},
);

export type IUserStore = Instance<typeof UserStore>;