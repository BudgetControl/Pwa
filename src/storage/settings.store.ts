import { defineStore } from 'pinia'

const STORE_NAME = 'eye-settings';

export const useEye = defineStore(STORE_NAME, {
    state: () => ({
      state: true as boolean
    }),
    actions: {
      set(value: boolean) {
          this.state = value
      },
      get(): boolean{
        return this.state
      },
      resetState() {
        this.$reset();
      }
    },
    persist: true
  })