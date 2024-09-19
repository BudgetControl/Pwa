import ApiService from './api.service';
import type { WsConfiguration, Workspace } from '../models/workspace.model';

class WorkspaceService extends ApiService {

    async incoming(params: string) {
        const response = await this.instance.get('/api/stats/incoming' + params);
        return response.data;
    }

    async expenses() {
        const response = await this.instance.get('/api/stats/expenses');
        return response.data;
    }

    async total() {
        const response = await this.instance.get('/api/stats/total');
        return response.data;
    }

    async wallets() {
        const response = await this.instance.get('/api/stats/wallets');
        return response.data;
    }

    async planned() {
        const response = await this.instance.get('/api/stats/total/planned');
        return response.data;
    }

    async health() {
        const response = await this.instance.get('/api/stats/health');
        return response.data;
    }

    async getStatsEntries(data: any) { //FIXME:
        const response = await this.instance.post('/api/stats/entries', data);
        return response.data;
    }
}
