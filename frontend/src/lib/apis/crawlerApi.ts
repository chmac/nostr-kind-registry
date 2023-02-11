import { REPO_PUBLIC_URL } from '../../constants';

export const getSortedKindsList = async () => {
	console.log('starting fetch');
	const response = await fetch(`${REPO_PUBLIC_URL}/kinds/kindsList.txt`);
	if (response.status !== 200) {
		[];
	}
	console.log('got something');
	const text = await response.text();
	const kinds = text
		.trim()
		.split('\n')
		.map((kindLine) => {
			const [kindString, dateString] = kindLine.split(',');
			const kind = parseInt(kindString);
			const seen = new Date(dateString);
			return { kind, seen };
		});
	const sortedKinds = kinds.sort((a, b) => a.seen.getTime() - b.seen.getTime());
	return sortedKinds;
};

export const getRelaysList = async () => {
	const response = await fetch(`${REPO_PUBLIC_URL}/relays/relaysList.txt`);
	if (response.status !== 200) {
		return [];
	}
	const text = await response.text();
	const relays = text.trim().split('\n');
	return relays;
};
