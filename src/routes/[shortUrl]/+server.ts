import type { KVNamespace } from '@cloudflare/workers-types';
import { getDefaultNS } from '$lib/kv/namespace';
import { dev } from '$app/environment';

/** @type {import('./$types').PageServerLoad} */
export async function GET({ getClientAddress, params, platform, request}) {
  const { shortUrl } = params;
  const kv:KVNamespace = getDefaultNS(dev, platform);
  const list = await kv.list({ prefix: shortUrl });
  const urlData = await kv.get<App.URLData>(list.keys[0].name, { type: 'json'});
  
  console.log("urlData: ", urlData);

  if (!urlData) {
    return new Response('URL not found', { status: 404 });
  }

  const logEntry: App.ShortUrlLogEntry = {
    createdAt: new Date().toISOString(),
    userAgent: request.headers.get('user-agent'),
    userIP: getClientAddress(),
    userCountry: platform.cf.country,
  };

  console.log("logEntry", logEntry);
  
  await kv.put(`${shortUrl}:logs`, JSON.stringify(logEntry), { metadata: { type: 'log' } });

  return Response.redirect(urlData.longUrl, 302);
}
