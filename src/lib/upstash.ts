const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

function getHeaders() {
  if (!redisUrl || !redisToken) {
    throw new Error("Upstash Redis env vars are not set");
  }
  return {
    Authorization: `Bearer ${redisToken}`,
  };
}

export async function redisGet<T>(key: string): Promise<T | null> {
  if (!redisUrl || !redisToken) return null;
  const res = await fetch(`${redisUrl}/get/${encodeURIComponent(key)}`, {
    method: "POST",
    headers: getHeaders(),
  });
  const data = await res.json();
  if (data?.result == null) return null;
  try {
    return JSON.parse(data.result) as T;
  } catch {
    return data.result as T;
  }
}

export async function redisSet(key: string, value: unknown, ttlSeconds?: number) {
  if (!redisUrl || !redisToken) return;
  const encodedKey = encodeURIComponent(key);
  const encodedValue = encodeURIComponent(JSON.stringify(value));
  const ttlQuery = ttlSeconds ? `?ex=${ttlSeconds}` : "";
  await fetch(`${redisUrl}/set/${encodedKey}/${encodedValue}${ttlQuery}`, {
    method: "POST",
    headers: getHeaders(),
  });
}
