import { defineStore } from 'pinia'

const STORE_NAME = 'auth-token'

export const useAuthStore = defineStore(STORE_NAME, {
  state: () => ({
    authToken: {} as { token: string, timestamp: string }
  }),
  actions: {
    set(value: string) {
      this.authToken = {
        token: value,
        timestamp: new Date().toISOString()
      }
    },
    get(): { token: string, timestamp: string } {
      return this.authToken
    },
    resetState() {
      this.$reset();
    }
  },
  persist: true,
})