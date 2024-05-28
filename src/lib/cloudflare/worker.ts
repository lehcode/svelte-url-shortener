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

  const response = getAssetFromKV(event)
  .then((asset) => {
    return new Response(asset.body, {
      headers: {
        ...asset.headers,
        "Cache-Control": `public, max-age=${cacheControl.browserTTL}`
      }
    });
  });
  
  event.respondWith(response);
});
