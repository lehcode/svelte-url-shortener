import adapter from '@sveltejs/adapter-cloudflare';
import sveltePreprocess from 'svelte-preprocess';

const nodeEnv = process.env.NODE_ENV;

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({
			routes: {
				include: ['/*'],
				exclude: ['<all>']
			},
			platformProxy: {}
		}),
	},
	vite: {
		resolve: {
			alias: {
				'@': '/src'
			}
		}
	},
	preprocess: sveltePreprocess({
    sourceMap: nodeEnv !== 'production',
    typescript: {
			tsconfigFile: nodeEnv === 'production' ? 'tsconfig.prod.json' : 'tsconfig.dev.json'
		}
  }),
};

export default config;
