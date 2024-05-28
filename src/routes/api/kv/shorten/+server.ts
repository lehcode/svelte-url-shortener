import { json } from '@sveltejs/kit';
import { v4 as uuidv4 } from 'uuid';
import type { KVNamespace } from '@cloudflare/workers-types';
import { InternalError } from '@cloudflare/kv-asset-handler';
import { dev } from '$app/environment';
import { getDefaultNS, getUrlDataFromKV, generateUrlHash } from '$lib/kv/namespace';

/** @type {import('./$types').RequestHandler} */
export const POST = async({request, platform, getClientAddress}): Promise<Response> => {
  const kv: KVNamespace = getDefaultNS(dev, platform);
  const { url } = await request.json();
	
  const urlHash = await generateUrlHash(url);

  console.log("Long URL", url);
  console.log("Long URL hash", urlHash);
  
  const { longUrl, shortUrl } = await getUrlDataFromKV(kv, urlHash);
  
  console.log("Found long URL:", longUrl);
  console.log("Matching short URL:", shortUrl);

  const { latitude, longitude, continent, country, city, timezone, region } = platform.cf;
  const urlData: App.URLData = {
    longUrl: url,
    urlHash,
    shortUrl, 
    createdAt: new Date().toISOString(),
    userAgent: request.headers.get('user-agent'),
    userIP: getClientAddress(),
    geoData: { latitude, longitude, continent, country, city, timezone, region }
  }

  try {
    await kv.put(urlHash, JSON.stringify(urlData));
  } catch(error: unknown) {
    throw new InternalError(`Failed to store data in KV: ${error}`);
  }  

	return json({ shortUrl }, { status: 200 });
};
