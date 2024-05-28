import type { KVNamespace } from "@cloudflare/workers-types";
import { InternalError } from '@cloudflare/kv-asset-handler';

export function getNSByName(name: string, dev: boolean=true, platform: App.Platform): KVNamespace {
  let kv:KVNamespace;
  try {
    switch (dev) {
      default:
      case true:
        kv = <KVNamespace>platform.env[`APP_DEV_${name}`];
        break;
      case false:
        kv = <KVNamespace>platform.env[`APP_PROD_${name}`];
    }
  } catch(error: unknown) {
    throw new InternalError(`Failed to load KV namespace: ${error}`);
  }

  return kv;
}

export function getDefaultNS(dev: boolean=true, platform: App.Platform): KVNamespace {
  let kv:KVNamespace;

  try {
    switch (dev) {
      default:
      case true:
        kv = <KVNamespace>platform.env.APP_PREVIEW_KV_NS;
        break;
      case false:
        kv = <KVNamespace>platform.env.APP_PROD_KV_NS;
    }
  } catch(error: unknown) {
    throw new InternalError(`Failed to initialize KV: ${error}`);
  }

  if (dev) {
    console.log("kv:", kv);
  }

  return kv;
}

export async function getUrlDataFromKV(kv: KVNamespace, urlHash: string, dev: boolean=true): Promise<App.URLData | undefined> {
  let urlData: App.URLData;
  
  console.log("kv:", kv);
  console.log("urlHash:", urlHash);
  console.log("Dev mode", dev);

  const list = await kv.list({ prefix: urlHash });
  console.log(`List for ${urlHash}:`, list);
  if (list && list.keys[0]) {
    urlData = await kv.get<App.URLData>(list.keys[0].name, { type: 'json'}) as App.URLData;
    if (dev) console.log(urlData);
    return urlData;
  }
}

export const generateUrlHash = async (url: string): Promise<string> => {
  const utf8 = new TextEncoder().encode(url);
  const hashBuffer = await crypto.subtle.digest('SHA-256', utf8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((bytes) => bytes.toString(16).padStart(2, '0'))
    .join('');
  return hashHex;
}