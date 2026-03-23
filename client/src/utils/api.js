import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-API-TOKEN': 'my-secret-token',
  },
});

api.interceptors.request.use((config) => {
  const userToken = localStorage.getItem('auth_token');
  const adminToken = localStorage.getItem('admin_token');
  const url = String(config.url || '');
  const isAdminRoute = url.startsWith('/admin');

  // Use only the token that matches the API namespace to avoid wrong-token 401s.
  const token = isAdminRoute ? adminToken : userToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // Let axios set Content-Type with boundary for FormData uploads
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Don't automatically clear token on 401 - let components handle auth errors
    // Token should only be cleared on explicit logout
    return Promise.reject(error);
  }
);

export default api;
