import { storeToRefs } from 'pinia';
import { useAuthStore } from '../storage/auth-token.store';
import { useWorkspaceStore } from '../storage/workspace.store';
import { useEye } from '../storage/settings.store';

export function resetAllStores() {
  const authStore = useAuthStore();
  const workspaceStore = useWorkspaceStore();
  const eyeStore = useEye();
  
  authStore.$reset();
  workspaceStore.$reset();
  eyeStore.$reset();

  localStorage.clear();
}