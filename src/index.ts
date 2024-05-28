import { getAssetFromKV } from '@cloudflare/kv-asset-handler';

const cacheControl = {
  browserTTL: 259200, // 3 days (in seconds)
};

addEventListener("fetch", (event: any) => {
  const request = event.request;

  console.log("Request:", request);

  if (!request.url.endsWith("/")) {
    return;
  }

  event.respondWith(handleRequest(event));
});

type Evt = {
    request: Request;
    waitUntil: (promise: Promise<unknown>) => void;
};

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
