<script>
import axios from 'axios';
import LocalStorageService from './LocalStorageService.vue';

const DOMAIN = process.env.VUE_APP_API_PATH_V2;

const instance = axios.create({
  baseURL: DOMAIN,
});

instance.interceptors.request.use(
  (config) => {
    const token = LocalStorageService.getToken()
    config.headers['Authorization'] = `Bearer ${token}`;
    config.headers['X-BC-Token'] = LocalStorageService.getUserToken()
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response ? error.response.data : error.message);

    console.warn('An error occurred during the API request. Check the console for more details.');
    return Promise.reject(error);
  }
);

async function setPlannedEntry(data, uuid) {
  let url = `/api/entry/planned`

  let response
  if (uuid !== null && uuid !== undefined) {
    url = `${url}/${uuid}`
    response = await instance.put(url, data);
  } else {
    response = await instance.post(url, data);
  }

  return response.data;
}

async function setEntry(type, data, isPlanned, uuid) {
  let url = `/api/entry/${type}`
  if (isPlanned == true || isPlanned == 'true') {
    url = `/api/entry/planned`
  }

  let response
  if (uuid !== null && uuid !== undefined) {
    url = `${url}/${uuid}`
    response = await instance.put(url, data);
  } else {
    response = await instance.post(url, data);
  }

  return response.data;
}

async function getEntry(page, filter) {
  const response = await instance.get(`/api/entry?per_page=20&page=${page}${filter}`);
  return response.data;
}

async function deleteEntry(id, isPlanned) {
  let url = `/api/entry/${id}`
  if (isPlanned == true || isPlanned == 'true') {
    url = `/api/entry/planned/${id}`
  }

  const response = await instance.delete(url);
  return response.data;
}

async function getEntryDetail(id, isPlanned) {
  let url = `/api/entry/${id}`
  if (isPlanned == true || isPlanned == 'true') {
    url = `/api/entry/planned/${id}`
  }
  const response = await instance.get(url);
  return response.data;
}

async function getEntryFromAccount(id) {
  const response = await instance.get('/api/entry?filters[wallet_id]=' + id);
  return response.data;
}

async function debit(page) {
  let params = ''
  if (page !== undefined) {
    params = `?page=${page}`
  }

  const response = await instance.get(`/api/debit${params}`);
  return response.data;
}

async function debt() {
  const response = await instance.get(`/api/payees`);
  return response.data;
}

async function deleteDebt(id) {
  const response = await instance.delete(`/api/debt/${id}`);
  return response.data;
}

async function subCategories() {
  const response = await instance.get('/api/categories');
  return response.data

}

async function categories() {
  const response = await instance.get('/api/categories-subcategories');
  return response.data

}

async function category(id) {
  const response = await instance.get(`/api/categories/${id}`);
  return response.data;
}

async function paymentstype() {
  const response = await instance.get('/api/payment-types');
  return response.data;
}

async function model() {
  const response = await instance.get('/api/entry/model?order[name]=asc');
  return response.data;
}

async function getModel(id) {
  const response = await instance.get(`/api/entry/model/${id}`);
  return response.data;
}

async function setModel(data, id) {
  if (id != null) {
    const response = await instance.put(`/api/entry/model/${id}`, data);
    return response.data;
  } else {
    const response = await instance.post('/api/entry/model', data);
    return response.data;
  }

}

async function labels(queryParams) {
  if (queryParams === undefined) {
    queryParams = '?order[name]=asc';
  }

  const response = await instance.get(`/api/label/list${queryParams}`);
  return response.data;
}

async function label(id) {
  const response = await instance.get(`/api/label/${id}`);
  return response.data;
}

async function setLabel(id, data) {
  const response = await instance.put(`/api/label/${id}`, data);
  return response.data;
}

async function currencies() {
  const response = await instance.get('/api/currencies');
  return response.data;
}

async function setDefaultCurrency(id) {
  const response = await instance.post('/api/user/currency', { currency: id });
  return response.data;
}

async function accounts(queryParams = '') {
  const response = await instance.get(`/api/wallet/list${queryParams}`);
  return response.data;
}

async function deleteWallet(uuid) {
  const response = await instance.delete(`/api/wallet/${uuid}`);
  return response.data;
}

async function restoreWallet(uuid) {
  const response = await instance.patch(`/api/wallet/restore/${uuid}`);
  return response.data;
}

async function account(uuid) {
  const response = await instance.get(`/api/wallet/show/${uuid}`);
  return response.data;
}

async function setAccount(data, uuid) {
  if (uuid != null) {
    const response = await instance.put(`/api/wallet/update/${uuid}`, data);
    return response.data;
  } else {
    const response = await instance.post('/api/wallet/create', data);
    return response.data;
  }
}

async function setCategories(data, id) {
  if (id != null) {
    const response = await instance.put(`/api/categories/${id}`, data);
    return response.data;
  } else {
    const response = await instance.post('/api/categories', data);
    return response.data;

  }
}

async function setAccountSorting(uuid, sorting) {
  const response = await instance.patch(`/api/wallet/sorting/${uuid}`, { 'sorting': sorting });
  return response.data;
}

async function importData(data) {
  const response = await instance.post('/api/entries/import', data);
  return response.data;
}

async function getPlannedEntry(page) {
  const response = await instance.get(`/api/entry/planned?page=${page}`);
  return response.data;
}

async function deleteModel(id) {
  let url = `/api/model/${id}`
  const response = await instance.delete(url);
  return response.data;
}

async function assistance(data) {
  let url = `/api/mailer/assistance`
  const response = await instance.post(url, data);
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
  label,
  currencies,
  accounts,
  importData,
  getEntryFromAccount,
  getPlannedEntry,
  setPlannedEntry,
  debt,
  deleteDebt,
  setAccount,
  setAccountSorting,
  setCategories,
  account,
  category,
  subCategories,
  setLabel,
  setDefaultCurrency,
  getModel,
  deleteModel,
  assistance,
  deleteWallet,
  restoreWallet
}

</script>
