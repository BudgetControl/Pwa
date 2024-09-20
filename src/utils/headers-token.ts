import { useAuthStore } from "../storage/auth-token.store";
import { useWorkspaceStore } from "../storage/workspace.store";
import { Workspace } from "../types/workspace.type";

export function getHeaderTokens(): { auth: { token: string, timestamp: string }, workspace: Workspace, bcAuth : { token : string, timestamp: string} } {
  const authStore = useAuthStore();
  const workspaceStore = useWorkspaceStore();
  authStore.authToken = authStore.get() 
  workspaceStore.workspace = workspaceStore.get()

  return {
    auth : authStore.authToken,
    workspace : workspaceStore.workspace,
    bcAuth : authStore.authToken
  }
}