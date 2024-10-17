import { Instance, getSnapshot, t } from "mobx-state-tree";

const PREFERENCE_STORAGE_KEY = 'preferences';

export const PreferenceStore = t.optional(t.model({
  appSidebarFolded: t.maybeNull(t.boolean),
})
  .actions(self => {

    const submit = () => {
      const preferences = getSnapshot(self);
      // console.log(`preferences:`,preferences);
      localStorage.setItem(PREFERENCE_STORAGE_KEY, JSON.stringify(preferences));
    };

    return {
      initialize() {
        const preferenceStr = localStorage.getItem(PREFERENCE_STORAGE_KEY);
        const preferences: any = preferenceStr ? JSON.parse(preferenceStr) : null;
        if (preferences) {
          self.appSidebarFolded = preferences.appSidebarFolded;
        }
      },
      toggleAppSidebarFolded() {
        self.appSidebarFolded = !self.appSidebarFolded;
        submit();
      },
    };
  }),
  {},
);

export type IPreferenceStore = Instance<typeof PreferenceStore>;