import axios from 'axios';

const CACHE_TTL_MS = 5 * 60 * 1000;
const CACHE_PREFIX = 'careerpath_api_cache:';
const responseCache = new Map();

const isBrowser = typeof window !== 'undefined';

const buildCacheKey = (config) => {
  const method = String(config.method || 'get').toUpperCase();
  const url = String(config.url || '');
  const params = config.params ? JSON.stringify(config.params) : '';
  return `${method}:${url}?${params}`;
};

const readCachedEntry = (key) => {
  const inMemory = responseCache.get(key);
  if (inMemory) return inMemory;

  if (!isBrowser) return null;

  try {
    const raw = window.sessionStorage.getItem(`${CACHE_PREFIX}${key}`);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    responseCache.set(key, parsed);
    return parsed;
  } catch {
    return null;
  }
};

const writeCachedEntry = (key, entry) => {
  responseCache.set(key, entry);

  if (!isBrowser) return;

  try {
    window.sessionStorage.setItem(`${CACHE_PREFIX}${key}`, JSON.stringify(entry));
  } catch {
    // Ignore storage failures and keep in-memory cache only.
  }
};

const removeCachedEntry = (key) => {
  responseCache.delete(key);

  if (!isBrowser) return;

  try {
    window.sessionStorage.removeItem(`${CACHE_PREFIX}${key}`);
  } catch {
    // Ignore storage failures.
  }
};

const clearAllCachedEntries = () => {
  responseCache.clear();

  if (!isBrowser) return;

  try {
    Object.keys(window.sessionStorage)
      .filter((k) => k.startsWith(CACHE_PREFIX))
      .forEach((k) => window.sessionStorage.removeItem(k));
  } catch {
    // Ignore storage failures.
  }
};

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-API-TOKEN': 'my-secret-token',
  },
});

api.interceptors.request.use((config) => {
  const method = String(config.method || 'get').toLowerCase();

  // For data-changing requests, clear cached GET responses to keep UI fresh.
  if (method !== 'get') {
    clearAllCachedEntries();
  }

  // Serve GET requests from cache unless explicitly disabled.
  if (method === 'get' && !config.skipCache) {
    const cacheKey = buildCacheKey(config);
    const entry = readCachedEntry(cacheKey);

    if (entry) {
      const isFresh = Date.now() - entry.timestamp < CACHE_TTL_MS;
      if (isFresh) {
        config.adapter = async () => ({
          data: entry.data,
          status: entry.status || 200,
          statusText: 'OK',
          headers: entry.headers || {},
          config,
          request: { fromCache: true },
        });
      } else {
        removeCachedEntry(cacheKey);
      }
    }
  }

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
  (response) => {
    const method = String(response.config?.method || 'get').toLowerCase();
    if (method === 'get' && !response.config?.skipCache) {
      const cacheKey = buildCacheKey(response.config);
      writeCachedEntry(cacheKey, {
        data: response.data,
        status: response.status,
        headers: response.headers,
        timestamp: Date.now(),
      });
    }
    return response;
  },
  (error) => {
    // Don't automatically clear token on 401 - let components handle auth errors
    // Token should only be cleared on explicit logout
    return Promise.reject(error);
  }
);

api.clearCache = clearAllCachedEntries;

export default api;
