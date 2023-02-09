import { WORKER_URL } from '../../../../../shared/constants';
import type { WORKER_OUTPUT_KIND_SINGLE } from '../../../../../shared/types';
import type { PageLoad } from './$types';

export const load = (async ({ fetch, params }) => {
	const res = await fetch(`${WORKER_URL}/kinds/${params.kind}`);
	const json = (await res.json()) as WORKER_OUTPUT_KIND_SINGLE;

	return json;
}) satisfies PageLoad;
