import ApiService from './api.service';

class BudgetService extends ApiService {

    async createBudget(data) {
        const response = await this.instance.post('/api/budget/create', data);
        return response.data;
    }
    
    async getBudget(id) {
    
        if (id !== undefined) {
            id = `/${id}`
        } else {
            id = ''
        }
        const response = await this.instance.get(`/api/budget/${id}`);
        return response.data;
    }
    
    async deleteBudget(id) {
        const response = await this.instance.delete(`/api/budget/${id}`);
        return response.data;
    }
    
    async updateBudget(data, id) {
        const response = await this.instance.put(`/api/budget/update/${id}`, data);
        return response.data;
    }
    
    async getBudgets() {
        const response = await this.instance.get('/api/budgets/stats');
        return response.data;
    }
    
    async getEntryList(uuid) {
        const response = await this.instance.get(`/api/budget/${uuid}/entry-list`);
        return response.data;
    }
    
    async getBudgetStats(id) {
        const response = await this.instance.get(`/api/budget/${id}/stats`);
        return response.data;
    }
}

export default BudgetService;