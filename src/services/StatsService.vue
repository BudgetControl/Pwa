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

async function incoming(params) {
  const response = await instance.get('/api/stats/incoming' + params);
  return response.data;
}

async function expenses() {
  const response = await instance.get('/api/stats/expenses');
  return response.data;
}

async function total() {
  const response = await instance.get('/api/stats/total');
  return response.data;
}

async function wallets() {
  const response = await instance.get('/api/stats/wallets');
  return response.data;
}

async function planned() {
  const response = await instance.get('/api/stats/total/planned');
  return response.data;
}

async function health() {
  const response = await instance.get('/api/stats/health');
  return response.data;
}

async function getStatsEntries(data) {
  const response = await instance.post('/api/stats/entries',data);
  return response.data;
}

async function getAverageExpenses() {
  const response = await instance.get('/api/stats/average-expenses');
  return response.data;
}

async function getAverageIncoming() {
  const response = await instance.get('/api/stats/average-incoming');
  return response.data;
}

async function getAverageSavings() {
  const response = await instance.get('/api/stats/average-savings');
  return response.data;
}

async function getPlannedExpenses() {
  const response = await instance.get('/api/stats/total-loan-installments');
  return response.data;
}

async function getEntryList(data) {
  const response = await instance.post('/api/stats/total/planned/monthly',data);
  return response.data;
}

export default {
  incoming,
  expenses,
  total,
  wallets,
  planned,
  health,
  getAverageExpenses,
  getAverageIncoming,
  getAverageSavings,
  getPlannedExpenses
}

</script>
