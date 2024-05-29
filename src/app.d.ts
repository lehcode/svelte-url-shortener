import type {
	KVNamespace,
	CacheStorage,
	IncomingRequestCfPropertiesGeographicInformation,
	Iso3166Alpha2Code,
	ContinentCode,
	IncomingRequestCfProperties,
	ExecutionContext
} from '@cloudflare/workers-types';
// import './worker-configuration';


export interface GeoData extends IncomingRequestCfPropertiesGeographicInformation {
	latitude: string | undefined;
	longitude: string | undefined;
	continent: ContinentCode | undefined;
	country: Iso3166Alpha2Code | 'T1' | undefined;
	city: string | undefined;
	timezone: string | undefined;
	region: string | undefined;
}
export interface URLData {
	longUrl: string | URL;
	urlHash: string | undefined;
	shortUrl: string | undefined;
	createdAt: string | undefined;
	userAgent?: string | undefined;
	userIP?: string | undefined;
	geoData: GeoData;
}
export interface ShortUrlLogEntry {
	createdAt: string | undefined;
	userAgent?: string | undefined;
	userIP?: string | undefined;
}

export interface Env {
	// Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
	APP_PREVIEW_KV_NS: KVNamespace;
	APP_PROD_KV_NS: KVNamespace;
	//
	// Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
	// MY_DURABLE_OBJECT: DurableObjectNamespace;
	//
	// Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
	// MY_BUCKET: R2Bucket;
	//
	// Example binding to a Service. Learn more at https://developers.cloudflare.com/workers/runtime-apis/service-bindings/
	// MY_SERVICE: Fetcher;
	//
	// Example binding to a Queue. Learn more at https://developers.cloudflare.com/queues/javascript-apis/
	// MY_QUEUE: Queue;
}

