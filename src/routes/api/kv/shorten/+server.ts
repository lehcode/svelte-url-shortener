import { json } from '@sveltejs/kit';
import { v4 as uuidv4 } from 'uuid';
import type { KVNamespace } from '@cloudflare/workers-types';
import { InternalError } from '@cloudflare/kv-asset-handler';
import { dev } from '$app/environment';

/** @type {import('./$types').RequestHandler} */
export const POST = async({request, platform}): Promise<Response> => {
  const { url } = await request.json();
	const uuid = uuidv4();
	const shortUrl = uuid.slice(0, 8);

  console.log("Platform:");
  console.log(platform);

  const { latitude, longitude, continent, country, city, timezone, region } = platform.cf;
  const urlData = {
    url,
    shortUrl, 
    createdAt: new Date().toISOString(),
    geoData: { latitude, longitude, continent, country, city, timezone, region }
  }

  console.log(urlData);

  try {
    let kv: KVNamespace;

    switch (dev) {
      default:
      case true:
        kv = <KVNamespace>platform.env.APP_DEV_KV_NS;
        break;
      case false:
        kv = <KVNamespace>platform.env.APP_PROD_KV_NS;
    }

    console.log("Dev:", dev);
    console.log("kv:", kv);
    
    await kv.put(uuid, JSON.stringify(urlData));
    
  } catch(error: unknown) {
    throw new InternalError(`Failed to store data in KV: ${error}`);
  }  

	return json({ shortUrl });
};
