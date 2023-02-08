import { WORKER_URL } from '../../../../../shared/constants';

export const load = async ({ params }: { params: { kind: string } }) => {
	const res = await fetch(`${WORKER_URL}/kinds/${params.kind}`);
	const json = await res.json();
	const kind = json.kind;

	return {
		kind
	};
};
