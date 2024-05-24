import { Miniflare } from 'miniflare';
import { dev } from '$app/environment';

export const fallBackPlatformToMiniFlareInDev = async (_platform: App.Platform) => {
  if (!dev) return _platform;
  
  const mf = new Miniflare({
    modules: true,
    scriptPath: './.wrangler/dist/index.js',
    kvNamespaces: <Record<string, any>>{
      APP_DEV_KV_NS: "APP_DEV_KV_NS"
    }
  });

  return {
    ..._platform,
    env: {
      APP_DEV_KV_NS: (await mf.getKVNamespace('APP_DEV_KV_NS'))
    }
  };
};
