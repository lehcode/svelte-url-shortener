import type { KVNamespace } from '@cloudflare/workers-types';
import { getByName } from '$lib/kv/namespace';
import { dev } from '$app/environment';

/** @type {import('./$types').PageServerLoad} */
export async function GET({ getClientAddress, params, platform, request}) {
  const { shortUrl } = params;
  // const appPlatform = getPlatform(platform);
  const kv:KVNamespace = getByName(dev, platform);
  const list = await kv.list({ prefix: shortUrl });
  const urlData = await kv.get<App.URLData>(list.keys[0].name, { type: 'json'});
  
  console.log(urlData);

  if (!urlData) {
    return new Response('URL not found', { status: 404 });
  }

  const logEntry = {
    time: new Date().toISOString(),
    userAgent: request.headers.get('user-agent'),
    geoip: platform.cf.country,
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
