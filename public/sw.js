const CACHE_PREFIX = 'turkuaz-offline-';
const CACHE_NAME = `${CACHE_PREFIX}v2`;
const APP_SHELL = '/';
const PUBLIC_ASSET_PATH = /^\/(?:assets|icons|images|audio)\//;

self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames
      .filter((name) => name.startsWith(CACHE_PREFIX) && name !== CACHE_NAME)
      .map((name) => caches.delete(name)));
    await clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin ||
      request.headers.has('authorization') || request.headers.has('range')) return;

  const isNavigation = request.mode === 'navigate';
  const isPublicAsset = !isNavigation && PUBLIC_ASSET_PATH.test(url.pathname);
  const isAppShell = isNavigation && url.pathname === APP_SHELL && !url.search;
  if (!isNavigation && !isPublicAsset) return;

  const cacheKey = isNavigation ? APP_SHELL : request;
  const network = fetch(request);
  if (isAppShell || isPublicAsset) {
    event.waitUntil(network.then(async (response) => {
      const cacheControl = response.headers.get('cache-control') || '';
      const isHtml = response.headers.get('content-type')?.includes('text/html') ?? false;
      if (response.status !== 200 || response.redirected || isAppShell !== isHtml ||
          /\b(?:no-store|private)\b/i.test(cacheControl)) return;

      const copy = response.clone();
      const cache = await caches.open(CACHE_NAME);
      await cache.put(cacheKey, copy);
    }).catch(() => {}));
  }

  event.respondWith(network.catch(async () => {
    const cache = await caches.open(CACHE_NAME);
    return (await cache.match(cacheKey)) || Response.error();
  }));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windows) => {
    const app = windows.find((client) => new URL(client.url).origin === self.location.origin);
    return app ? app.focus() : clients.openWindow(APP_SHELL);
  }));
});
