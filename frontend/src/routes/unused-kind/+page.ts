import { getRelaysList, getSortedKindsList } from '$lib/apis/crawlerApi';

function getRandomKind(seenKinds: number[]) {
	const min = 100;
	const max = 10_000;
	while (true) {
		let randomKind = Math.floor(Math.random() * (max - min) + min);
		if (!seenKinds.find((kind) => kind === randomKind)) return randomKind;
	}
}

export const load = async () => {
	const relays = await getRelaysList();
	const kinds = await getSortedKindsList();
	const randomKind = getRandomKind(kinds.map(({ kind }) => kind));

	return { relays, kinds, randomKind };
};
