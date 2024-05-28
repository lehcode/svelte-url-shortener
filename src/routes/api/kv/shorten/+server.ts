import { json } from '@sveltejs/kit';
import { v4 as uuidv4 } from 'uuid';
import type { KVNamespace } from '@cloudflare/workers-types';
import { InternalError } from '@cloudflare/kv-asset-handler';
import { dev } from '$app/environment';

/** @type {import('./$types').RequestHandler} */
export const POST = async({request, platform, getClientAddress}): Promise<Response> => {
  const { url } = await request.json();
	const uuid = uuidv4();
	const shortUrl = uuid.slice(0, 8);
  const appPlatform = platform;

  const { latitude, longitude, continent, country, city, timezone, region } = appPlatform.cf;
  const urlData: App.URLData = {
    longUrl: url,
    shortUrl, 
    createdAt: new Date().toISOString(),
    userAgent: request.headers.get('user-agent'),
    userIP: getClientAddress(),
    geoData: { latitude, longitude, continent, country, city, timezone, region }
  }

  try {
    let kv: KVNamespace;

    switch (dev) {
      default:
      case true:
        kv = <KVNamespace>appPlatform.env.APP_PREVIEW_KV_NS;
        break;
      case false:
        kv = <KVNamespace>appPlatform.env.APP_PROD_KV_NS;
    }
    
    await kv.put(uuid, JSON.stringify(urlData));
    
  } catch(error: unknown) {
    throw new InternalError(`Failed to store data in KV: ${error}`);
  }  

	return json({ shortUrl });
};
