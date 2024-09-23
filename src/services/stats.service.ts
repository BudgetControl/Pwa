import ApiService from './api.service';

class StatsService extends ApiService {

    async incoming(params) {
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

    async getStatsEntries(data) {
        const response = await this.instance.post('/api/stats/entries', data);
        return response.data;
    }

    async getAverageExpenses() {
        const response = await this.instance.get('/api/stats/average-expenses');
        return response.data;
    }

    async getAverageIncoming() {
        const response = await this.instance.get('/api/stats/average-incoming');
        return response.data;
    }

    async getAverageSavings() {
        const response = await this.instance.get('/api/stats/average-savings');
        return response.data;
    }

    async getPlannedExpenses() {
        const response = await this.instance.get('/api/stats/total/planned/remaining');
        return response.data;
    }

    async getEntryList(data) {
        const response = await this.instance.post('/api/stats/entries', data);
        return response.data;
    }
}

export default StatsService;