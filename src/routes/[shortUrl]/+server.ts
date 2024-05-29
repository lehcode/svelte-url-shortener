import type { KVNamespace } from '@cloudflare/workers-types';
import { getDefaultNS, fetchUrlHash, getUrlDataByPrefix } from '$lib/kv/namespace';
import { dev } from '$app/environment';
import { ShortUrlLogEntry, UrlLogEntryMetadata } from '../../app.d';

export async function GET({ getClientAddress, params, platform, request }) {
	const { shortUrl } = params;
	const kv: KVNamespace = getDefaultNS(dev, platform);
	const urlHash = await fetchUrlHash(shortUrl, kv);

	if (dev) console.log(`Found URL hash for short URL '${shortUrl}'`, urlHash);

	if (urlHash) {
		const logEntry: ShortUrlLogEntry = {
			userAgent: request.headers.get('user-agent'),
			userIP: getClientAddress()
		};

		if (dev) console.log('logEntry', logEntry);

		const urlData = await getUrlDataByPrefix(kv, urlHash);
		const createdAt = new Date().toISOString();
		const metadata: UrlLogEntryMetadata = {
			type: 'log',
			createdAt
		};

		console.log("Metadata:", metadata);

		await kv.put(`${shortUrl}:${btoa(createdAt)}`, JSON.stringify(logEntry), { metadata });

		if (dev) console.log(`Redirecting to ${urlData.longUrl}`);

		return Response.redirect(urlData.longUrl, 302);
	}

	return new Response('Not Found', { status: 404 });
}
