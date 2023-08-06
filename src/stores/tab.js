import { defineStore } from 'pinia';
import router from '../router';

export const useTabStore = defineStore('tab', {
  state: () => ({
    tabs: [],
    active: undefined
  }),
  actions: {
    push(raw) {
      const has = this.tabs.find(it => it.name === raw.name);
      if (has === undefined) {
        this.tabs.push({
          name: raw.name ,
          title: raw.meta?.title 
        });
      }

      this.active = raw.name ;
    },
    remove(name) {
      const { length } = this.tabs;
      const index = this.tabs.findIndex(it => it.name === name);
      const newTabs = this.tabs.filter(it => it.name !== name);
      let newIndex = index - 1;
      if (newIndex < 0) {
        newIndex = 0;
      }
      this.tabs = newTabs;
      if (length === 1 || name !== this.active) {
        // router.push({
        //   path: import.meta.env.VITE_ROUTE_HOME_PATH
        // });
        return;
      }

      const tab = this.tabs[newIndex];
      router.push({
        name: tab.name
      });
    }
  }
});
