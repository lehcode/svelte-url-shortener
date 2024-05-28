import { getAssetFromKV } from '@cloudflare/kv-asset-handler';
import type { KVNamespace, R2Bucket } from '@cloudflare/workers-types';

const cacheControl = {
  browserTTL: 259200, // 3 days (in seconds)
};

type Evt = {
    request: Request;
    waitUntil: (promise: Promise<unknown>) => void;
};

addEventListener("fetch", (event: any) => {
  const request = event.request;

  console.log("Request:", request);

  if (!request.url.endsWith("/")) {
    return;
  }

  event.respondWith(handleRequest(event));
});

async function handleRequest(fetchEvent: Evt) {
  const asset = await getAssetFromKV(fetchEvent)

  return new Response(asset.body, {
    status: 200,
    headers: {
      ...asset.headers,
      "Cache-Control": `public, max-age=${cacheControl.browserTTL}`
    }
  });
}

export interface Env {
	// Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
	MY_KV_NAMESPACE: KVNamespace;
	//
	// Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
	// MY_DURABLE_OBJECT: DurableObjectNamespace;
	//
	// Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
	MY_BUCKET: R2Bucket;
	//
	// Example binding to a Service. Learn more at https://developers.cloudflare.com/workers/runtime-apis/service-bindings/
	// MY_SERVICE: Fetcher;
	//
	// Example binding to a Queue. Learn more at https://developers.cloudflare.com/queues/javascript-apis/
	// MY_QUEUE: Queue;
}
