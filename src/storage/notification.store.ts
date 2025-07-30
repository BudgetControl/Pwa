import { defineStore } from 'pinia';
const STORE_NAME = 'notification';

export const useNotificationStore = defineStore(STORE_NAME, {
  state: () => ({
    state: false as boolean,
    token: null as string | null,
  }),
  actions: {
    set(value: boolean) {
      this.state = value
    },
    get(): boolean {
      return this.state
    },
    setToken(token: string) {
      this.token = token;
    }
  },
  persist: false,
})