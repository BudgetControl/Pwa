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
  const response = await instance.get('/api/stats/chart/bar/incoming/category',config); //FIXME:
  return response.data;
}

async function expensesLabelLine(data) {
  const config = {
    params: {
      date_time : data
    }
  }
  const response = await instance.get('/api/stats/chart/bar/expenses/label',config);
  return response.data;
}

async function createBudget(data) {
  const response = await instance.post('/api/budget/create',data);
  return response.data;
}

async function updateBudget(data,id) {
  const response = await instance.put(`/api/budget/update/${id}`,data);
  return response.data;
}

async function getBudgets() {
  const response = await instance.get('/api/budget/stats');
  return response.data;
}

async function getBudget(id) {

  if(id !== undefined) {
      id = `/${id}`
  } else {
    id = ''
  }
  const response = await instance.get(`/api/budget/stats${id}`);
  return response.data;
}

async function deleteBudget(id) {
  const response = await instance.delete(`/api/budget/${id}`);
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
  expensesLabelLine,
  expensesLabelCategory,
  getBudgets,
  getBudget,
  createBudget,
  deleteBudget,
  updateBudget
}

</script>
