import type {
	KVNamespace,
	CacheStorage,
	IncomingRequestCfPropertiesGeographicInformation,
	Iso3166Alpha2Code,
	ContinentCode,
	IncomingRequestCfProperties,
	ExecutionContext
} from '@cloudflare/workers-types';
import './worker-configuration';

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
	userAgent?: string | undefined;
	userIP?: string | undefined;
	geoData: GeoData;
}
export interface ShortUrlLogEntry {
	userAgent?: string | undefined;
	userIP?: string | undefined;
}

export interface UrlLogEntryMetadata {
	type: string | undefined;
	createdAt: string | undefined;
}
