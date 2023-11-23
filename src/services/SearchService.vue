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

async function getAll(data,page) {
  const response = await instance.get(`/search/all?page=${page}`,data);
  return response.data;
}

async function filter(data,page) {
  const response = await instance.post(`/search/filter?page=${page}`,data);
  return response.data;
}

export default {
  getAll,
  filter,
}

</script>
