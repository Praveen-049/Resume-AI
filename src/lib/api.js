const TOKEN_KEY = 'resumeai_token';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export async function api(path, options = {}) {
  const headers = new Headers(options.headers || {});
  const token = getToken();

  if (token) headers.set('Authorization', `Bearer ${token}`);
  if (!(options.body instanceof FormData)) headers.set('Content-Type', 'application/json');

  const response = await fetch(path, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || 'API request failed');
  return data;
}

export const authApi = {
  demo: () => api('/api/auth/demo', { method: 'POST' }),
  login: (payload) => api('/api/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
  register: (payload) => api('/api/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  me: () => api('/api/me'),
};

export const resumeApi = {
  health: () => api('/api/health'),
  createJob: (payload) => api('/api/jobs', { method: 'POST', body: JSON.stringify(payload) }),
  uploadResumes: (files) => {
    const form = new FormData();
    Array.from(files).forEach((file) => form.append('resumes', file));
    return api('/api/resumes/upload', { method: 'POST', body: form });
  },
  runRanking: (jobId) => api('/api/rankings/run', { method: 'POST', body: JSON.stringify({ jobId }) }),
};
