import type { KVNamespace } from '@cloudflare/workers-types';
import { getDefaultNS, fetchUrlHash, getUrlDataByPrefix } from '$lib/kv/namespace';
import { dev } from '$app/environment';
import { ShortUrlLogEntry } from '../../app.d';

/** @type {import('./$types').PageServerLoad} */
export async function GET({ getClientAddress, params, platform, request }) {
	let { shortUrl } = params;
	const kv: KVNamespace = getDefaultNS(dev, platform);
	const urlHash = await fetchUrlHash(shortUrl, kv);
	// console.log(`URL hash for '${shortUrl}'`, urlHash);

	if (urlHash) {
		const logEntry: ShortUrlLogEntry = {
			createdAt: new Date().toISOString(),
			userAgent: request.headers.get('user-agent'),
			userIP: getClientAddress()
		};
		const urlSlug = `${urlHash}:${shortUrl}`;
		const urlData = await getUrlDataByPrefix(kv, urlHash);
		shortUrl = urlData.shortUrl;

		if (dev) {
			console.log('logEntry', logEntry);
			console.log('urlSlug', urlSlug);
		}

		await kv.put(`${urlSlug}:logs`, JSON.stringify(logEntry), { metadata: { type: 'log' } });

		return Response.redirect(urlData.longUrl, 302);
	}

	return new Response('Not Found', { status: 404 });
}
