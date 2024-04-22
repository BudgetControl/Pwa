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
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

async function login(email, password) {
  const response = await instance.post('/api/auth/authenticate', {
    email: email,
    password: password
  });
  return response.data;
}

async function verify(email) {
  const response = await instance.post('/api/auth/verify-email',{
    email: email
  });
  return response.data;
}

async function register(name, password,confirm_password, email) {
  const response = await instance.post('/api/auth/sign-up', {
    name: name,
    password: password,
    email: email,
    password_confirmation: confirm_password
  });
  return response.data;
}

async function logout() {
  const response = await instance.get('/api/auth/logout');
  return response.data;
}

async function authenticate(email, password) {
  const response = await instance.post('/api/auth/authenticate', {
    email: email,
    password: password
  });
  return response.data;
}

async function recoveryPassword(email) {
  const response = await instance.post('/api/auth/reset-password', {
    email: email,
  });
  return response.data;
}

async function resetPassword(token,password,confirm_password) {
  const response = await instance.put(`/api/auth/reset-password/${token}`, {
    password: password,
    password_confirmation: confirm_password
  });
  return response.data;
}

async function check() {
  //retrive access token header
  const response = await instance.get('/api/auth/check');
  // Accedi all'header X-Custom-Header dalla risposta
  const access_token = response.headers.authorization;
  if(access_token) {
    LocalStorageService.setToken(access_token);
  }

  return response;
}

async function providerUri(provider) {
  //retrive access token header
  const response = await instance.get(`/api/auth/authenticate/${provider}`);

  return response.data;
}

async function token(code, provider) {
  //retrive access token header
  const response = await instance.get(`/api/auth/authenticate/token/${provider}?code=${code}`);

  return response.data;
}

async function confirm(token) {
  //retrive access token header
  const response = await instance.get(`/api/auth/confirm/${token}`);
  return response.status;
}

async function profile() {
  //retrive access token header
  const response = await instance.get(`/api/auth/profile`);
  return response;
}

async function deleteUser() {
  //retrive access token header
  const response = await instance.delete(`/api/auth/delete`);
  return response;
}


async function deleteDataUser() {
  //retrive access token header
  const response = await instance.delete(`/api/auth/data/delete`);
  return response;
}


async function settings() {
  //retrive access token header
  const response = await instance.get(`/api/user/settings`);
  return response.data;
}

export default {
  login,
  register,
  logout,
  authenticate,
  check,
  recoveryPassword,
  resetPassword,
  verify,
  confirm,
  profile,
  deleteUser,
  deleteDataUser,
  settings,
  providerUri,
  token
}

</script>
