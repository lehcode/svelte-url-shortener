import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, loadEnv } from 'vite';
import vpc from "vite-plugin-cloudflare";

export default defineConfig(({ command, mode }) => {
	const env = loadEnv(mode, process.cwd(), 'env');
	const appEnv = JSON.stringify(env.APP_ENV);

	const config = {
		plugins: [sveltekit(), vpc({ 
			// modules: true,
			scriptPath: "./src/lib/cloudflare/worker.ts",
			miniflare: {
				// modules: true,
				// scriptPath: './.wrangler/dist/index.js',
				// kvNamespaces: ["APP_DEV_KV_NS"],
				kvPersist: "./kv-data",
				host: "127.0.0.1",
				verbose: true,
			}
		})],
		test: {
			include: ['src/**/*.{test,spec}.{js,ts}']
		},
		define: { __APP_ENV__: appEnv }
	};

	if (command === 'serve') {
		return config;
	} else {
		// command === 'build'
		return config;
	}
});
