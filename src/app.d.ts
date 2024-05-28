import type { 
	KVNamespace, 
	CacheStorage,
  IncomingRequestCfPropertiesGeographicInformation,
  Iso3166Alpha2Code,
  ContinentCode,
  IncomingRequestCfProperties,
  ExecutionContext
} from '@cloudflare/workers-types';
import './worker-configuration'
// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace App {
    export interface GeoData extends IncomingRequestCfPropertiesGeographicInformation {
			latitude: string | undefined,
			longitude: string | undefined,
			continent: ContinentCode | undefined,
			country: Iso3166Alpha2Code | "T1" | undefined,
			city: string | undefined,
			timezone: string | undefined,
			region: string | undefined,
		}
		export interface URLData {
			longUrl: string | URL;
			shortUrl: string | undefined;
			createdAt: string | undefined;
			userAgent:  string | undefined;
			userIP: string | undefined;
			geoData: App.GeoData
		}
		export interface ShortUrlLogEntry {
			createdAt: string | undefined;
			userAgent: string | undefined;
			userIP: string | undefined;
			userCountry: string | undefined;
		}
    export interface KVNamespaceConfig {
			[key: string]: KVNamespace;
		}
		interface Platform {
			kvNamespaces: KVNamespaceConfig,
			caches: CacheStorage,
			cf?: IncomingRequestCfProperties | undefined
      env: Env,
      ctx: ExecutionContext,
		}

    
  }
}

export {};