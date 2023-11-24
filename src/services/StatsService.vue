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
      config.headers['X-ACCESS-TOKEN'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

async function incoming() {
  const response = await instance.get('/api/stats/incoming');
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


export default {
  incoming,
  expenses,
  total,
  wallets,
  planned,
  health
}

</script>
