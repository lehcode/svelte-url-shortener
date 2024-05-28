import { KVNamespace } from "@cloudflare/workers-types";


export function getByName(dev: boolean, platform: App.Platform, name?: string,): KVNamespace {
  let kv:KVNamespace;

  switch (dev) {
    default:
    case true:
      kv = <KVNamespace>platform.env.APP_PREVIEW_KV_NS;
      break;
    case false:
      kv = <KVNamespace>platform.env.APP_PROD_KV_NS;
  }

  return kv;
}