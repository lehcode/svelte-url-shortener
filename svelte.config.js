import adapter from '@sveltejs/adapter-cloudflare';
import sveltePreprocess from 'svelte-preprocess';

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
    sourceMap: process.env.NODE_ENV !== 'production',
    typescript: true
  }),
};

export default config;
