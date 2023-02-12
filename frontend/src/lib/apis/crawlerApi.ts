import { REPO_PUBLIC_URL } from '../../constants';

export const getSortedKindsList = async () => {
	console.log('#tuKsxI Starting fetch');
	const response = await fetch(`${REPO_PUBLIC_URL}/kinds/kindsList.txt`, { cache: 'reload' });
	if (response.status !== 200) {
		[];
	}
	console.log('#x7yAAo Fetch finished 200', Array.from(response.headers.entries()));
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
