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
      config.headers['access_token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

async function incomingLineYear(data) {
  const config = {
    params: {
      date_time : data
    }
  }
  const response = await instance.get('/api/chart/line/incoming/year',config);
  return response.data;
}

async function incomingBarByCategory(data) {
  const config = {
    params: {
      date_time : data
    }
  }
  const response = await instance.get('/api/chart/bar/incoming/category',config);
  return response.data;
}

async function expensesBarByCategory(data) {
  const config = {
    params: {
      date_time : data
    }
  }
  const response = await instance.get('/api/chart/bar/expenses/category',config);
  return response.data;
}

async function incomingExpensesLine(data) {
  const config = {
    params: {
      date_time : data
    }
  }
  const response = await instance.get('/api/chart/line/incoming-expenses',config);
  return response.data;
}

async function expensesLabelLine(data) {
  const config = {
    params: {
      date_time : data
    }
  }
  const response = await instance.get('/api/chart/bar/expenses/label',config);
  return response.data;
}

async function expensesLabelTable(data) {
  const config = {
    params: {
      date_time : data
    }
  }
  const response = await instance.get('/api/chart/table/expenses/label',config);
  return response.data;
}

async function expensesLabelCategory(data) {
  const config = {
    params: {
      date_time : data
    }
  }
  const response = await instance.get('/api/chart/table/expenses/category',config);
  return response.data;
}

export default {
  incomingLineYear,
  incomingBarByCategory,
  expensesBarByCategory,
  incomingExpensesLine,
  expensesLabelLine,
  expensesLabelCategory,
  expensesLabelTable
}

</script>