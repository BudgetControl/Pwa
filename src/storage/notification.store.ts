import { defineStore } from 'pinia';
const STORE_NAME = 'notification';

export const useNotificationStore = defineStore(STORE_NAME, {
  state: () => ({
    message: '',
    title: '',
    isNewMessage: false as boolean,
    token: null as string | null,
  }),
  actions: {
    set({ title, message }: { title: string; message: string }) {
      this.title = title
      this.message = message
      this.isNewMessage = true
    },
    get(): ({title: string, message: string}) {
      return {title: this.title, message: this.message}
    },
    getIsNewMessage(): boolean {
      return this.isNewMessage
    },
    clearNewMessage() {
      this.isNewMessage = false;
      this.message = '';
      this.title = '';
    },
    setToken(token: string) {
      this.token = token;
    }
  },
  persist: false,
})