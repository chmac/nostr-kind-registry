const API = 'https://nkr.erudo.workers.dev/';

export const load = async ({ params }: { params: { kind: string } }) => {
	const res = await fetch(API + params.kind);
	const json = await res.json();
	const kind = json.kind;

	const tmpKind = {
		kind: 4,
		seen: true,
		firstSeenTimestamp: 1675851518,
		seenOnRelays: ['wss://knostr.neutrine.com'],
		relatedNips: [4],
		implementationUrls: ['https://github.com/SebastiaanWouters/emon']
	};

	return {
		kind: tmpKind
	};
};
