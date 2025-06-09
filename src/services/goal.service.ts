import ApiService from './api.service';

class GoalService extends ApiService {

    async getAll() {
        const response = await this.instance.get(`/api/goals`);
        return response.data;
      }
      
      async get(id) {
        const response = await this.instance.get(`/api/goals/${id}`);
        return response.data;
      }

    async create(data) {
        const response = await this.instance.post('/api/goals', data);
        return response.data;
    }

    async update(id, data) {
        const response = await this.instance.put(`/api/goals/${id}`, data);
        return response.data;
    }

    async delete(id) {
        const response = await this.instance.delete(`/api/goals/${id}`);
        return response.data;
    }

}

export default GoalService;