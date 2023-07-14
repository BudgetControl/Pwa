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

async function setEntry(type,data, isPlanned) {
  let url = `/api/${type}`
  if(isPlanned === true) {
    url = `/api/planning-recursively`
  }
  const response = await instance.post(url,data);
  return response.data;
}

async function getEntry(page) {
  const response = await instance.get(`/api/entry?page=${page}`);
  return response.data;
}

async function deleteEntry(id) {
  const response = await instance.delete('/api/entry/'+id);
  return response.data;
}

async function getEntryDetail(type,id) {
  const response = await instance.get('/api/'+type+'/'+id);
  return response.data;
}

async function getEntryFromAccount(id) {
  const response = await instance.get('/api/entry/account/'+id);
  return response.data;
}

async function debit() {
  const response = await instance.get('/api/debit');
  return response.data;
}

async function categories() {
  const response = await instance.get('/api/categories');
  return response.data;
}

async function paymentstype() {
  const response = await instance.get('/api/paymentstype');
  return response.data;
}

async function model() {
  const response = await instance.get('/api/model');
  return response.data;
}

async function setModel(data) {
  const response = await instance.post('/api/model',data);
  return response.data;
}

async function labels() {
  const response = await instance.get('/api/labels');
  return response.data;
}

async function currencies() {
  const response = await instance.get('/api/currencies');
  return response.data;
}

async function accounts() {
  const response = await instance.get('/api/accounts');
  return response.data;
}

async function importData(data) {
  const response = await instance.post('/api/entries/import',data);
  return response.data;
}

async function getPlannedEntry(page) {
  const response = await instance.get(`/api/planning-recursively?page=${page}`);
  return response.data;
}

async function setPlannedEntry(data) {
  const response = await instance.post('/api/planning-recursively',data);
  return response.data;
}

export default {
  setEntry,
  getEntry,
  deleteEntry,
  getEntryDetail,
  debit,
  categories,
  paymentstype,
  model,
  setModel,
  labels,
  currencies,
  accounts,
  importData,
  getEntryFromAccount,
  getPlannedEntry,
  setPlannedEntry,
}

</script>
