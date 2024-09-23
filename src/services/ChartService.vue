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

async function expensesBarByCategory(data) {
  const config = {
    params: {
      date_time : data
    }
  }
  const response = await instance.get('/api/stats/chart/bar/expenses/category',config);
  return response.data;
}

async function incomingExpensesLine(data) {
  const config = {
    params: {
      date_time : data
    }
  }
  const response = await instance.get('/api//stats/chart/line/incoming-expenses',config);
  return response.data;
}

async function expensesLabelApplePie(data) {
  const config = {
    params: {
      date_time : data
    }
  }
  const response = await instance.get('/api/stats/chart/apple-pie/expenses/label',config);
  return response.data;
}


async function expensesLabelCategory(data) {
  const config = {
    params: {
      date_time : data
    }
  }
  const response = await instance.get('/api/stats/chart/table/expenses/category',config);
  return response.data;
}

export default {
  expensesBarByCategory,
  incomingExpensesLine,
  expensesLabelApplePie,
  expensesLabelCategory
}

</script>
