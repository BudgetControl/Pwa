<script>
import axios from 'axios';
import { useAppSettings } from '../storage/settings.store';

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

export default {
    getEntryList,
    getBudgets,
    getBudget,
    createBudget,
    deleteBudget,
    updateBudget
}

</script>
