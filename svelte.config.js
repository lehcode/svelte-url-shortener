import adapter from "@sveltejs/adapter-cloudflare";
import sveltePreprocess from 'svelte-preprocess';

const nodeEnv = process.env.NODE_ENV;

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: sveltePreprocess({
    sourceMap: nodeEnv !== 'production',
    typescript: {
			tsconfigFile: nodeEnv === 'production' ? 'tsconfig.prod.json' : 'tsconfig.dev.json'
		}
  }),

	kit: {
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: adapter({
			routes: {
				include: ['/*'],
				exclude: ['<all>']
			},
			platformProxy: {
				persist: './.wrangler'
			}
		})
	},
	vitePlugin: {
		inspector: true,
	},
	vite: {
		resolve: {
			alias: {
				'$lib': './src/lib'
			}
		}
	}
};

export default config;