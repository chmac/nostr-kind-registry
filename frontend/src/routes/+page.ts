import type { WORKER_OUTPUT_SEEN_KINDS } from '../../../shared/types';
import { REPO_PUBLIC_URL } from '../constants';

export const load = async () => {
	const response = await fetch(`${REPO_PUBLIC_URL}/kinds/kindsList.txt`);
	if (response.status !== 200) {
		return { kinds: [] };
	}
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
	return { kinds: sortedKinds };
};
