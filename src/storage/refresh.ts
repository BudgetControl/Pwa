import { defineStore } from 'pinia'

const STORE_NAME = 'refresh'

export const useRefreshStore = defineStore(STORE_NAME, {
  state: () => ({
    state: false as boolean
  }),
  actions: {
    set(value: boolean) {
      this.state = value
    },
    get(): boolean {
      return this.state
    },
  },
  persist: false,
})