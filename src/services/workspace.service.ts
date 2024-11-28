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