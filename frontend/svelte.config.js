import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/kit/vite';
import { getKindsPaths } from './utils/getKindsPaths.js';

const isDev = process.argv.includes('dev');

const kindPaths = await getKindsPaths();

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		paths: {
			// base: isDev ? '' : '/nostr-kind-registry'
		},
		adapter: adapter({
			fallback: '404.html'
		}),
		prerender: {
			crawl: true,
			entries: ['/'].concat(kindPaths)
		}
	}
};

export default config;
