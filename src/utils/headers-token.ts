import { useAuthStore } from "../storage/auth-token.store";
import { Workspace } from "../types/workspace.type";
import { useAppSettings } from "../storage/settings.store";

export function getHeaderTokens(): { auth: { token: string, timestamp: string }, workspace: Workspace, bcAuth : { token : string, timestamp: string} } {
  const authStore = useAuthStore();
  const appSettingsStore = useAppSettings();
  authStore.authToken = authStore.get() 
  appSettingsStore.settings = appSettingsStore.get()

  return {
    auth : authStore.authToken,
    workspace : appSettingsStore.settings.current_ws,
    bcAuth : authStore.authToken
  }
}