import { defineStore } from 'pinia'
import { Workspace } from '../models/workspace.model'

const STORE_NAME = 'workspace'

export const useWorkspaceStore = defineStore(STORE_NAME, {
    state: () => ({
      workspace: null as Workspace | null
    }),
    actions: {
      set(workspace: Workspace) {
        this.workspace = workspace
      },
      get(): Workspace | null {
        return this.workspace
      },
      resetState() {
        this.$reset();
      }
    },
    persist: true
  })