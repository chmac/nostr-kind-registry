import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/kit/vite';

const isDev = process.argv.includes('dev');

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		paths: {
			base: isDev ? '' : '/nostr-kind-registry'
		},
		adapter: adapter({
			fallback: '404.html'
		}),
		prerender: {
			crawl: true,
			entries: ['/', '/kinds/0/', '/kinds/1/', '/kinds/2/']
			// entries: ['/']
		}
	}
};

export default config;
