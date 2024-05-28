import type { KVNamespace, KVNamespaceListResult } from "@cloudflare/workers-types";
import { InternalError } from '@cloudflare/kv-asset-handler';
import { from, lastValueFrom } from 'rxjs';
import { filter, flatMap, map as rxjsMap, toArray } from 'rxjs/operators';
import { URLData } from "../../app";

export const getNSByName = (name: string, dev: boolean=true, platform: App.Platform): KVNamespace => {
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

export const getDefaultNS = (dev: boolean=true, platform: App.Platform): KVNamespace => {
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

  return kv;
}

export const getUrlDataByPrefix = async(kv: KVNamespace, prefix: string, dev: boolean=true): Promise<URLData | undefined> => {
  const list = await kv.list({ prefix: prefix });
  let urlData: URLData;

  console.log(`List for ${prefix}:`, list);

  if (list && list.keys.length) {
    urlData = await kv.get<URLData>(list.keys[0].name, { type: 'json'}) as URLData;
    if (dev) console.log("urlData: ", urlData);
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

export const fetchUrlHash = async (suffix: string, ns: KVNamespace) => {
  const result = await lastValueFrom(
    from(ns.list()).pipe(
      flatMap(a => a.keys),
      filter((keyObj) => keyObj.name.endsWith(suffix)),
      rxjsMap((keyObj) => keyObj.name.replace(`:${suffix}`, '')),
      toArray()
    ),
  );

  console.log(`Found record for ${suffix}`, result);

  return result[0];
}