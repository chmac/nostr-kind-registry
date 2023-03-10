import { getRelaysList, getSortedKindsList } from '$lib/apis/crawlerApi';

export const load = async () => {
	// maybe parallelize this; I think just doing return { kinds: getSortedKindsList() } works: https://kit.svelte.dev/docs/load#promise-unwrapping
	const kinds = await getSortedKindsList();
	const relays = await getRelaysList();
	return { kinds, relays };
};
