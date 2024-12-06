import ApiService from './api.service';

class ChartService extends ApiService {

    async expensesBarByCategory(data) {
        const config = {
            params: {
                date_time: data
            }
        }
        const response = await this.instance.get('/api/stats/chart/bar/expenses/category', config);
        return response.data;
    }

    async expensesBarByLabel(data) {
        const config = {
            params: {
                date_time: data
            }
        }
        const response = await this.instance.get('/api/stats/chart/bar/expenses/label', config);
        return response.data;
    }

    async incomingExpensesLine(data) {
        const config = {
            params: {
                date_time: data
            }
        }
        const response = await this.instance.get('/api//stats/chart/line/incoming-expenses', config);
        return response.data;
    }

    async expensesLabelApplePie(data) {
        const config = {
            params: {
                date_time: data
            }
        }
        const response = await this.instance.get('/api/stats/chart/apple-pie/expenses/label', config);
        return response.data;
    }

    async createBudget(data) {
        const response = await this.instance.post('/api/budget/create', data);
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

    async expensesLabelCategory(data) {
        const config = {
            params: {
                date_time: data
            }
        }
        const response = await this.instance.get('/api/stats/chart/table/expenses/category', config);
        return response.data;
    }
}

export default ChartService;