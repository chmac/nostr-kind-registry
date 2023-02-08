import { WORKER_URL } from '../../../shared/constants';
import type { WORKER_OUTPUT_SEEN_KINDS } from '../../../shared/types';

export const load = async (): Promise<WORKER_OUTPUT_SEEN_KINDS> => {
	const response = await fetch(`${WORKER_URL}/kinds`);
	const json = (await response.json()) as WORKER_OUTPUT_SEEN_KINDS;
	const sortedKinds = json.kinds.sort((a, b) => a - b);
	return { kinds: sortedKinds };
};
