<script>
import axios from 'axios';
import LocalStorageService from './LocalStorageService.vue';
const DOMAIN = process.env.VUE_APP_API_PATH_V2;

const instance = axios.create({
    baseURL: DOMAIN
});

instance.interceptors.request.use(
    (config) => {
        const token = LocalStorageService.getToken()
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
            config.headers['X-BC-Token'] = LocalStorageService.getUserToken()
            config.headers['X-BC-WS'] = LocalStorageService.getWorkspaceId()
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

instance.interceptors.response.use(
  (response) => {
    const newAuthToken = response.headers['authorization']?.replace('Bearer ', '');
    LocalStorageService.setToken(newAuthToken);
    return response;
  },
  (error) => {
    console.error('API Error:', error.response ? error.response.data : error.message);

    console.warn('An error occurred during the API request. Check the console for more details.');

    //if status code is 401 then logout
    if (error.response.status === 401) {
        LocalStorageService.clear();
        window.location.reload()
    }

    return Promise.reject(error);
  }
);

async function createBudget(data) {
    const response = await instance.post('/api/budget/create', data);
    return response.data;
}


async function getBudget(id) {

    if (id !== undefined) {
        id = `/${id}`
    } else {
        id = ''
    }
    const response = await instance.get(`/api/budget/${id}`);
    return response.data;
}

async function deleteBudget(id) {
    const response = await instance.delete(`/api/budget/${id}`);
    return response.data;
}

async function updateBudget(data, id) {
    const response = await instance.put(`/api/budget/update/${id}`, data);
    return response.data;
}

async function getBudgets() {
    const response = await instance.get('/api/budgets/stats');
    return response.data;
}

async function getEntryList(uuid) {
    // /api/budget/${uuid}/entry-list
    const response = await instance.get(`/api/budget/${uuid}/entry-list`);
    return response.data;
}

async function getBudgetStats(id) {
    const response = await instance.get(`/api/budget/${id}/stats`);
    return response.data;
}

export default {
    getEntryList,
    getBudgets,
    getBudget,
    createBudget,
    deleteBudget,
    updateBudget,
    getBudgetStats
}

</script>
