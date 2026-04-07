const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export { API_BASE };

export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem('ct_app_token');
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (token) headers.Authorization = 'Bearer ' + token;
  const res = await fetch(API_BASE + path, { ...options, headers });
  if (!res.ok) {
    const json = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(json.message || 'Request failed');
  }
  return res.json();
}
