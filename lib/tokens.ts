const ACCESS_KEY = 'hp_access';
const REFRESH_KEY = 'hp_refresh';
const AUTH_COOKIE = 'hp_authed';

function setCookie(name: string, value: string, days: number) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax`;
}

function clearCookie(name: string) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

export const tokens = {
  getAccess: () => (typeof window !== 'undefined' ? localStorage.getItem(ACCESS_KEY) : null),
  setAccess: (t: string) => localStorage.setItem(ACCESS_KEY, t),

  getRefresh: () => (typeof window !== 'undefined' ? localStorage.getItem(REFRESH_KEY) : null),
  setRefresh: (t: string) => {
    localStorage.setItem(REFRESH_KEY, t);
    setCookie(AUTH_COOKIE, '1', 90);
  },

  clear: () => {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
    clearCookie(AUTH_COOKIE);
  },
};
