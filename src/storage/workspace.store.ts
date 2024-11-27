import { defineStore } from 'pinia'
import { Workspace } from '../types/workspace.type'

const STORE_NAME = 'workspace'

export const useWorkspaceStore = defineStore(STORE_NAME, {
    state: () => ({
      workspace: {} as Workspace
    }),
    actions: {
      set(workspace: Workspace) {
        this.workspace = workspace
      },
      get(): Workspace {
        return this.workspace
      },
      resetState() {
        this.$reset();
      }
    },
    persist: true
  })