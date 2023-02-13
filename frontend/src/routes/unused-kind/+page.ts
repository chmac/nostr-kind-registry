import { getRelaysList, getSortedKindsList } from '$lib/apis/crawlerApi';

function getRandomKind(seenKinds: number[]) {
	const min = 100;
	const max = 10_000;
	while (true) {
		let randomKind = Math.floor(Math.random() * (max - min) + min);
		if (!seenKinds.find((kind) => kind === randomKind)) return randomKind;
	}
}

function shuffle(array: any[]) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * i);
		const temp = array[i];
		array[i] = array[j];
		array[j] = temp;
	}
	return array;
}

export const load = async () => {
	const relays = shuffle(await getRelaysList());
	const kinds = await getSortedKindsList();
	const randomKind = getRandomKind(kinds.map(({ kind }) => kind));

	return { relays, kinds, randomKind };
};
