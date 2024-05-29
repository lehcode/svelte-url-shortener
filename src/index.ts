import { getAssetFromKV } from '@cloudflare/kv-asset-handler';
import type { FetchEvent } from '@cloudflare/workers-types';

const cacheControl = {
	browserTTL: 259200 // 3 days (in seconds)
};

type Evt = {
	request: Request;
	waitUntil: (promise: Promise<unknown>) => void;
};

// @ts-expect-error False positive
addEventListener('fetch', (event: FetchEvent) => {
	event.respondWith(handleRequest(event as unknown as Evt));
});

async function handleRequest(fetchEvent: Evt) {
	const asset: Response = await getAssetFromKV(fetchEvent);

	return new Response(asset.body, {
		status: 200,
		headers: {
			...asset.headers,
			'Cache-Control': `public, max-age=${cacheControl.browserTTL}`
		}
	});
}
