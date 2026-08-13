const BASE = process.env.API_BASE_URL ?? 'http://localhost:4000/api';
export async function api<T>(path: string): Promise<T> {
  const response = await fetch(`${BASE}${path}`, { cache: 'no-store' });
  if (!response.ok) throw new Error(`API request failed: ${response.status}`);
  return response.json() as Promise<T>;
}
