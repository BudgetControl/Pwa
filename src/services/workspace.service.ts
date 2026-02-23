import ApiService from './api.service';
import { Workspace } from '../types/workspace.type';

class WorkspaceService extends ApiService {

    async get(id: string) {
        const response = await this.instance.get(`/api/workspace/${id}`);
        return response.data;
    }

    async list(): Promise<Array<Workspace>> {
        const response = await this.instance.get(`/api/workspace/list`);
        return response.data;
    }

    async listByUser() {
        const response = await this.instance.get(`/api/workspace/by-user/list`);
        return response.data;
    }

    async add(data: {}) {
        const response = await this.instance.post(`/api/workspace/create`, data);
        return response.data;
    }

    async activeWorkspace(id: string) {
        const response = await this.instance.patch(`/api/workspace/activate/${id}`);
        return response.data;
    }

    /**
     * Share a workspace with a user
     * @param workspaceId The ID of the workspace to share
     * @param user The email or UUID of the user to share the workspace with
     * @returns The response from the API
     */
    async share(workspaceId: string, user: string) {
        const response = await this.instance.post(`/api/workspace/${workspaceId}/share`, { "user_to_share": user });
        return response.data;
    }

    async unshare(workspaceId: string, userId: string) {
        const response = await this.instance.delete(`/api/workspace/${workspaceId}/unshare/${userId}`);
        return response.data;
    }

    async update(workspace: {
        id: string,
        data: {}
    }) {
        const response = await this.instance.put(`/api/workspace/update/${workspace.id}`, workspace.data);
        return response.data;
    }

    async delete(id: string) {
        const response = await this.instance.delete(`/api/workspace/${id}`);
        return response.data;
    }
}

export default  WorkspaceService;
