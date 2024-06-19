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

async function setEntry(type, data, isPlanned, uuid) {
  let url = `/api/${type}`
  if (isPlanned == true || isPlanned == 'true') {
    url = `/api/planning-recursively`
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
  const response = await instance.get(`/api/entry?page=${page}${filter}`);
  return response.data;
}

async function deleteEntry(id, isPlanned) {
  let url = `/api/entry/${id}`
  if (isPlanned == true || isPlanned == 'true') {
    url = `/api/planning-recursively/${id}`
  }

  const response = await instance.delete(url);
  return response.data;
}

async function getEntryDetail(id, isPlanned) {
  let url = `/api/entry/${id}`
  if (isPlanned == true || isPlanned == 'true') {
    url = `/api/planning-recursively/${id}`
  }
  const response = await instance.get(url);
  return response.data;
}

async function getEntryFromAccount(id) {
  const response = await instance.get('/api/entry/account/' + id);
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

async function payee() {
  const response = await instance.get(`/api/payee`);
  return response.data;
}

async function deletePayee(id) {
  const response = await instance.delete(`/api/payee/${id}`);
  return response.data;
}

async function categories() {
  const response = await instance.get('/api/categories');
  const resp = response.data;
  let categories = []
  data.forEach(function (r) {
    r.sub_category.forEach((item) => {
      categories.push({
        id: item.id,
        name: _this.$t('app.' + item.slug),
      })
    })
  })

  categories.sort(function (a, b) {
    return a.name.localeCompare(b.name);
  });

  return categories

}

async function category(id) {
  const response = await instance.get(`/api/categories/${id}`);
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

async function getModel(id) {
  const response = await instance.get(`/api/model/${id}`);
  return response.data;
}

async function setModel(data, id) {
  if (id != null) {
    const response = await instance.put(`/api/model/${id}`, data);
    return response.data;
  } else {
    const response = await instance.post('/api/model', data);
    return response.data;
  }

}

async function labels(queryParams) {
  if (queryParams === undefined) {
    queryParams = '';
  }

  const response = await instance.get(`/api/labels${queryParams}`);
  return response.data;
}

async function label(id) {
  const response = await instance.get(`/api/labels/${id}`);
  return response.data;
}

async function setLabel(id, data) {
  const response = await instance.put(`/api/labels/${id}`, data);
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
  const response = await instance.get(`/api/accounts${queryParams}`);
  return response.data;
}

async function deleteWallet(id) {
  const response = await instance.delete(`/api/accounts/${id}`);
  return response.data;
}

async function restoreWallet(id) {
  const response = await instance.get(`/api/account-restore/${id}`);
  return response.data;
}

async function account(id) {
  const response = await instance.get(`/api/accounts/${id}`);
  return response.data;
}

async function setAccount(data, id) {
  if (id != null) {
    const response = await instance.put(`/api/accounts/${id}`, data);
    return response.data;
  } else {
    const response = await instance.post('/api/accounts', data);
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

async function setAccountSorting(id, sorting) {
  const response = await instance.put(`/api/sorting-account/${id}`, { 'sorting': sorting });
  return response.data;
}

async function importData(data) {
  const response = await instance.post('/api/entries/import', data);
  return response.data;
}

async function getPlannedEntry(page) {
  const response = await instance.get(`/api/planning-recursively?page=${page}`);
  return response.data;
}

async function setPlannedEntry(data) {
  const response = await instance.post('/api/planning-recursively', data);
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
  payee,
  deletePayee,
  setAccount,
  setAccountSorting,
  setCategories,
  account,
  category,
  setLabel,
  setDefaultCurrency,
  getModel,
  deleteModel,
  assistance,
  deleteWallet,
  restoreWallet
}

</script>
