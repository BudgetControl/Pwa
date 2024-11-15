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

async function get(id) {
  const response = await instance.get(`/api/workspace/${id}`);
  return response.data;
}

async function list() {
  const response = await instance.get(`/api/workspace/list`);
  return response.data;
}

async function listByUser() {
  const response = await instance.get(`/api/workspace/by-user/list`);
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

async function update(id, data) {
  const response = await instance.put(`/api/workspace/update/${id}`, data);
  return response.data;
}


export default {
  get,
  list,
  add,
  activeWorkspace,
  update,
  listByUser
}

</script>
