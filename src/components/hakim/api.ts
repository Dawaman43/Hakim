export const api = {
  async get(url: string, token?: string) {
    const headers: HeadersInit = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(url, { headers });
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch {
      return { success: false, error: 'Invalid JSON response', status: res.status };
    }
  },
  async post(url: string, data: unknown, token?: string) {
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch {
      return { success: false, error: 'Invalid JSON response', status: res.status };
    }
  },
  async del(url: string, token?: string) {
    const headers: HeadersInit = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(url, { method: 'DELETE', headers });
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch {
      return { success: false, error: 'Invalid JSON response', status: res.status };
    }
  },
};
