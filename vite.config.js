import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({command, mode, isSsrBuild, isPreview }) => {
	const env = loadEnv(mode, process.cwd(), 'env');
	const appEnv = JSON.stringify(env.APP_ENV)
	const config = {
		plugins: [sveltekit()],
		test: {
			include: ['src/**/*.{test,spec}.{js,ts}']
		},
		define: { __APP_ENV__: appEnv}
	}

	if (command === 'serve') {
    return config
  } else {
    // command === 'build'
    return config
  }
});
