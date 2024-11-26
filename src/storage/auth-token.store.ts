import { defineStore } from 'pinia'

const STORE_NAME = 'auth-token'

export const useAuthStore = defineStore(STORE_NAME, {
  state: () => ({
    authToken: {} as { token: string, timestamp: string },
    bcAuthToken: {} as { token: string, timestamp: string }
  }),
  actions: {
    get(): { authToken: { token: string, timestamp: string }, bcAuthToken: { token: string, timestamp: string } } {
      return {
        authToken: this.authToken,
        bcAuthToken: this.bcAuthToken
      }
    },
    resetState() {
      this.$reset();
    }
  },
  persist: true,
})