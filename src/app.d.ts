import type { 
	KVNamespace, 
	DurableObjectNamespace,
	CacheStorage 
} from '@cloudflare/workers-types';
// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		interface Error {
			message: string;
			errorId: string;
		}
		interface Locals {}
		interface ShortURLData {
			date: Date;
		}
		interface PageData {
			longUrl?: string;
			shortUrl?: ShortURLData;
		}
		interface PageState {}
		interface Platform {
			env?: {
				APP_KV_NS: KVNamespace;
				APP_DO_NS: DurableObjectNamespace;
			},
			context: {
				waitUntil(promise: Promise<any>): void;
			},
			caches: CacheStorage
		}
		
		const APP_KV_NS: KVNamespace;
	}
}

export {};
