import type { Instance } from "mobx-state-tree";
import { t } from "mobx-state-tree";
import { UserStore } from './user-store';
import { PackageStore } from './package-store';
import { PreferenceStore } from './preference-store';
import { TKAccountStore } from './tk-account-store';

export const AppStore = t.model({
  userStore: UserStore,
  packageStore: PackageStore,
  preferenceStore: PreferenceStore,
  TKAccountStore: TKAccountStore,
});

export const appStore = AppStore.create({});

export type IAppStore = Instance<typeof AppStore>;
