export const api = {
  async get(url: string, token?: string) {
    const headers: HeadersInit = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(url, { headers });
    return res.json();
  },
  async post(url: string, data: unknown, token?: string) {
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
    return res.json();
  },
};
