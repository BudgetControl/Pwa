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
    const bctoken = LocalStorageService.getUserToken()
    config.headers['Authorization'] = `Bearer ${token}`;
    config.headers['X-BC-Token'] = `${bctoken}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

async function get(id) {
  const response = await instance.get(`/api/workspace/${id}`);
  return response.data;
}

async function list() {
  const response = await instance.get(`/api/workspace/list`);
  return response.data;
}

async function add(data) {
  const response = await instance.post(`/api/workspace/create`,data);
  return response.data;
}

async function activeWorkspace(id) {
  const response = await instance.patch(`/api/workspace/activate/${id}`);
  return response.data;

}


export default {
  get,
  list,
  add,
  activeWorkspace
}

</script>
