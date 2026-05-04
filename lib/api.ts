import axios from 'axios';
import { tokens } from './tokens';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? '/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = tokens.getAccess();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let refreshing: Promise<string> | null = null;

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;
    if (err.response?.status !== 401 || original._retry) throw err;
    original._retry = true;

    const refreshToken = tokens.getRefresh();
    if (!refreshToken) throw err;

    if (!refreshing) {
      refreshing = api
        .post<{ accessToken: string; refreshToken: string }>('/auth/refresh', { refreshToken })
        .then((r) => {
          tokens.setAccess(r.data.accessToken);
          tokens.setRefresh(r.data.refreshToken);
          return r.data.accessToken;
        })
        .finally(() => {
          refreshing = null;
        });
    }

    const newAccess = await refreshing;
    original.headers.Authorization = `Bearer ${newAccess}`;
    return api(original);
  },
);
