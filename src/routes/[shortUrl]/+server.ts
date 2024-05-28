// import { Router } from 'itty-router';
import type { KVNamespace } from '@cloudflare/workers-types';
import { getByName } from '$lib/kv/namespace';
import { dev } from '$app/environment';
// import { fallBackPlatformToMiniFlareInDev } from '$lib/miniflare/miniflare';

// const router = Router();

/** @type {import('./$types').PageServerLoad} */
export async function GET({ getClientAddress, params, platform, request}) {
  // const _platform = await fallBackPlatformToMiniFlareInDev(platform, dev);
  const _platform: App.Platform = pla
  const { shortUrl } = params;
  const kv:KVNamespace = getByName(dev, _platform);
  const list = await kv.list({ prefix: shortUrl });
  const urlData = await kv.get<App.URLData>(list.keys[0].name, { type: 'json'});
  
  console.log(urlData);

  if (!urlData) {
    return new Response('URL not found', { status: 404 });
  }

  const logEntry = {
    time: new Date().toISOString(),
    userAgent: request.headers.get('user-agent'),
    geoip: _platform.cf.country,
    ip: getClientAddress()
  };

  console.log(logEntry);
  
  await kv.put(
    `${shortUrl}:logs`,
    JSON.stringify(logEntry),
    { metadata: { type: 'log' } }
  );

  return Response.redirect(urlData.url, 302);
}

// addEventListener('fetch', (event: any): void => {
//   console.log(typeof event);
//   event.respondWith(router.handle(event.request));
// });
