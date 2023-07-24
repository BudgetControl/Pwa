<script>
import axios from 'axios';

const DOMAIN = process.env.VUE_APP_API_PATH_V2;

const instance = axios.create({
  baseURL: DOMAIN
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth-token');
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
