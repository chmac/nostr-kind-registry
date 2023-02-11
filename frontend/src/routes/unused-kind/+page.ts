import { getRelaysList, getSortedKindsList } from '$lib/apis/crawlerApi';

export const load = async () => {
	const relays = await getRelaysList();
	const kinds = await getSortedKindsList();
	return { relays, kinds };
};
