import ApiService from './api.service';

class SearchService extends ApiService {

    async getAll(data,page) {
        const response = await this.instance.get(`/api/search/all?page=${page}`,data);
        return response.data;
      }
      
      async filter(data) {
        const response = await this.instance.post(`/api/find`,data);
        return response.data;
      }

}

export default SearchService;