import { t, Instance } from "mobx-state-tree";
import { IAppPackage } from '../interfaces';

const packages: IAppPackage[] = [
  // {
  //   id: 'production-management',
  //   name: '产品库',
  //   applications: [

  //   ],
  // },
  {
    id: 'tools',
    name: '工具',
    applications: [
      {
        name: '用户管理',
        path: '/app/application/users'
      },
    ],
  }
];

const Package = t.model({
  id: t.string,
  name: t.string,
  icon: t.maybeNull(t.string),
});

const Application = t.model({
  name: t.string,
  packageId: t.string,
  path: t.string,
  order: t.number,
  icon: t.maybeNull(t.string),
});

const generateInitData = () => {
  const apps: Record<string, any> = {};
  const pcks = packages.reduce((pre: any, cur) => {
    pre[cur.id] = cur;
    if (cur.applications.length) {
      for (let index = 0; index < cur.applications.length; index++) {
        const app = cur.applications[index];
        apps[app.path] = { ...app, packageId: cur.id, order: index };
      }
    }
    return pre;
  }, {});

  return { packages: pcks, applications: apps };
};

export const PackageStore = t.optional(t.model({
  packages: t.map(Package),
  applications: t.map(Application),
  activedApplicationId: t.maybeNull(t.string),
  activedPackageId: t.maybeNull(t.string),
})
  .views(self => {
    const getApplications = (packageId: string) => {
      if (!packageId) return [];
      const apps = Array.from(self.applications.values());
      return apps.filter(app => app.packageId === packageId);
    }
    return {
      get activedPackage() {
        return self.packages.get(self.activedPackageId);
      },
      get activedPackageApps() {
        return getApplications(self.activedPackageId);
      },
      getApplications,
    };
  })
  .actions(self => {

    return {
      activePath(path?: string) {
        const app: ApplicationModel = path ? self.applications.get(path) : null;
        let pck: PackageModel;
        if (app) {
          pck = self.packages.get(app.packageId)
        }
        self.activedPackageId = pck?.id;
        self.activedApplicationId = app?.path;
      }
    };
  }),
  {
    ...generateInitData(),
  },
);

export type IPackageStore = Instance<typeof PackageStore>;
export type ApplicationModel = Instance<typeof Application>;
export type PackageModel = Instance<typeof Package>;