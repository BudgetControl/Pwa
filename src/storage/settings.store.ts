import { defineStore } from 'pinia'
import { AppSettings } from '../types/app-settings.type';
import { User } from '../types/user.type';
import { Workspace } from '../types/workspace.type';

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
      setEye(value: boolean): void {
        this.settings.eye_settings = value
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
      },
      getWorkspace(): Workspace {
        return this.settings.current_ws
      }
    },
    persist: true
  })