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
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

async function list() {
  const response = await instance.get(`/api/workspace/list`);
  return response.data;
}

async function add(data) {
  const response = await instance.post(`/api/workspace/add`,data);
  return response.data;
}

export default {
  list,
  add
}

</script>
