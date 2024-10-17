import { t, flow, Instance } from "mobx-state-tree";
import { UserRepository } from '../repositories';

export const PaginationModel = t.model({
  current: t.number,
  pageSize: t.number,
});

