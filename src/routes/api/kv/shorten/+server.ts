import { json } from '@sveltejs/kit';
import { v4 as uuidv4 } from 'uuid';
import type { KVNamespace } from '@cloudflare/workers-types';
import { getPlatformProxy } from 'wrangler';
import { InternalError } from '@cloudflare/kv-asset-handler';

/** @type {import('./$types').RequestHandler} */
export const POST = async({request}): Promise<Response> => {
  const { url } = await request.json();
	const uuid = uuidv4();
	const shortUrl = uuid.slice(0, 8);
  const platform = await getPlatformProxy();

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
    const kv = <KVNamespace>platform.env.APP_KV_NS;
    await kv.put(uuid, JSON.stringify(urlData));
  } catch(error: unknown) {
    throw new InternalError(`Failed to store data in KV: ${error}`);
  }  

	return json({ shortUrl });
};
