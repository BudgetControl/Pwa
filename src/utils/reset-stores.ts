import { useAuthStore } from '../storage/auth-token.store';
import { useWorkspaceStore } from '../storage/workspace.store';
import { useAppSettings } from '../storage/settings.store';

export function resetAllStores() {
  const authStore = useAuthStore();
  const workspaceStore = useWorkspaceStore();
  const appSettings = useAppSettings();
  
  authStore.$reset();
  workspaceStore.$reset();
  appSettings.$reset();

  localStorage.clear();
}