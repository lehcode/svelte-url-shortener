import { json } from '@sveltejs/kit';
import { v4 as uuidv4 } from 'uuid';
import type { KVNamespace } from '@cloudflare/workers-types';
import { InternalError } from '@cloudflare/kv-asset-handler';
import { fallBackPlatformToMiniFlareInDev } from '$lib/miniflare';

/** @type {import('./$types').RequestHandler} */
export const POST = async({request, platform, ...args}): Promise<Response> => {
  const { url } = await request.json();
	const uuid = uuidv4();
	const shortUrl = uuid.slice(0, 8);
  const flare = await fallBackPlatformToMiniFlareInDev(platform);

  console.log("Platform:");
  console.log(flare);
  console.log("Server args:");
  console.log(args);

  const { latitude, longitude, continent, country, city, timezone, region } = platform.cf;
  const urlData = {
    url,
    shortUrl, 
    createdAt: new Date().toISOString(),
    geoData: { latitude, longitude, continent, country, city, timezone, region }
  }

  console.log(urlData);

  try {
    const kv = <KVNamespace>flare.env.APP_DEV_KV_NS;
    await kv.put(uuid, JSON.stringify(urlData));
  } catch(error: unknown) {
    throw new InternalError(`Failed to store data in KV: ${error}`);
  }  

	return json({ shortUrl });
};
