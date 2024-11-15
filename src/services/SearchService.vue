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
       config.headers['X-BC-Token']= LocalStorageService.getUserToken()
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

async function getAll(data,page) {
  const response = await instance.get(`/api/search/all?page=${page}`,data);
  return response.data;
}

async function filter(data) {
  const response = await instance.post(`/api/find`,data);
  return response.data;
}

export default {
  getAll,
  filter,
}

</script>
