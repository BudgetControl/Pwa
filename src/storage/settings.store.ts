import { defineStore } from 'pinia'
import { AppSettings } from '../types/app-settings.type';
import { User } from '../types/user.type';

const STORE_NAME = 'app-settings';

export const useAppSettings = defineStore(STORE_NAME, {
    state: () => ({
      settings: {} as AppSettings
    }),
    actions: {
      get(): AppSettings {
        return this.settings
      },
      getEye(): boolean{
        return this.settings.eye_settings
      },
      getCurrency(): number {
        return this.settings.user.workspace_settings.data.currency_id
      },
      getPaymentType(): number {
        return this.settings.user.workspace_settings.data.payment_type_id
      },
      getUser(): User {
        return this.settings.user
      },
      resetState() {
        this.$reset();
      }
    },
    persist: true
  })