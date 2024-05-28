import { Miniflare, Log, LogLevel } from 'miniflare';
import { dev } from '$app/environment';
// import type { KVNamespace } from '@cloudflare/workers-types';

export const fallBackPlatformToMiniFlareInDev = async (_platform: App.Platform) => {
  if (!dev) return _platform;
  
  const mf = new Miniflare({
    modules: true,
    scriptPath: './.wrangler/dist/index.js',
    kvNamespaces: ["APP_DEV_KV_NS"],
    kvPersist: "./kv-data",
    log: new Log(LogLevel.DEBUG),
    host: "127.0.0.1",
    cache: false
  });

  return {
    ..._platform,
    env: {
      APP_DEV_KV_NS: (await mf.getKVNamespace('APP_DEV_KV_NS'))
    }
  };
};

export const getPlatform = async(platform: App.Platform): Promise<App.Platform | undefined> => {
  if (dev) {
    // Comment before deploying.
    // return await fallBackPlatformToMiniFlareInDev(platform);
  } else {
    // Comment out upon local dev.
    return platform
  }
}
