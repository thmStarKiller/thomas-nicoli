// Quoting model loader for Thomas's AI + Automation + Web services
// Loads JSON from public/quoting.json and caches it for reuse.

type LoaderKey = string;

const cache = new Map<LoaderKey, Promise<string>>();

function resolveBase(origin?: string) {
  if (origin) return origin;
  if (typeof process !== 'undefined' && process.env.SITE_URL) {
    return process.env.SITE_URL;
  }
  return 'http://127.0.0.1:3000';
}

export async function getQuotingModel(origin?: string): Promise<string> {
  const base = resolveBase(origin);
  let loader = cache.get(base);
  if (!loader) {
    loader = (async () => {
      try {
        const url = new URL('/quoting.json', base);
        const response = await fetch(url.toString(), {cache: 'no-store'});
        if (!response.ok) {
          throw new Error(`status ${response.status}`);
        }
        return await response.text();
      } catch (error) {
        console.error('Error loading quoting.json:', error);
        return JSON.stringify({ error: 'quoting.json not found' });
      }
    })();
    cache.set(base, loader);
  }
  return loader;
}
