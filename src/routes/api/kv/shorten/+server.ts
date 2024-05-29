import { json } from '@sveltejs/kit';
import type { KVNamespace } from '@cloudflare/workers-types';
import { dev } from '$app/environment';
import { getDefaultNS, getUrlDataByPrefix, generateUrlHash } from '$lib/kv/namespace';
import type { URLData } from '../../../../app.d';

/**
 * Handles a POST request to create a short URL.
 *
 * @param {Object}    options - The options object.
 * @param {Request}   options.request - The request object.
 * @param {Object}    options.platform - The platform object.
 * @return {Promise<Response>} A promise that resolves to a response object.
 */
export const POST = async ({ request, platform }): Promise<Response> => {
	// Get the default KV namespace
	const kv: KVNamespace = getDefaultNS(dev, platform);

	// Extract the long URL from the request body
	const { url } = await request.json();

	// Generate a hash of the long URL
	const urlHash = await generateUrlHash(url);

	// Retrieve or create a short URL based on the hash
	const urlData: URLData = await getOrCreateShortUrl(kv, url, urlHash);

	// Return the short URL and URL data as a JSON response
	return json({ urlData }, { status: 200 });
};

/**
 * Retrieves or creates a short URL based on the provided Cloudflare namespace, URL, and URL hash.
 *
 * @param {KVNamespace} ns - The namespace to retrieve or create the short URL in.
 * @param {string} url - The long URL to generate or retrieve a short URL for.
 * @param {string} urlHash - The hash of the long URL.
 * @return {Promise<URLData>} A promise that resolves to the URL data of the short URL.
 */
const getOrCreateShortUrl = async (
	ns: KVNamespace,
	url: string,
	urlHash: string
): Promise<App.URLData> => {
	// Initialize short URL and URL data variables
	let shortUrl: string | undefined;
	const kvData: URLData = await getUrlDataByPrefix(ns, urlHash);
	let urlData: URLData;

	// If URL data already exists in KV, retrieve it
	if (kvData) {
		urlData = kvData;
		shortUrl = kvData.shortUrl;
	} else {
		// If URL data does not exist, generate a new short URL and create URL data
		shortUrl = crypto.randomUUID().slice(0, 8);
		urlData = <URLData>{
			shortUrl,
			longUrl: url,
			urlHash,
			createdAt: new Date().toISOString(),
			userAgent: undefined,
			userIP: undefined,
			geoData: {
				latitude: undefined,
				longitude: undefined,
				continent: undefined,
				country: undefined,
				city: undefined,
				timezone: undefined,
				region: undefined
			}
		};
	}

	// Store the URL data in KV using the URL hash and short URL as the key
	await ns.put(`${urlHash}:${shortUrl}`, JSON.stringify(urlData));

	// Return the URL data
	return urlData;
};
