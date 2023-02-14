import { getCommentUrls } from '$lib/apis/nostr';
import type { KindMeta } from '../../../../../shared/types';
import { COMMENT_RELAYS, REPO_PUBLIC_URL } from '../../../constants';

export const load = async ({ params }: { params: { kind: string } }) => {
	const res = await fetch(`${REPO_PUBLIC_URL}/kinds/kind${params.kind}.json`);
	const jsonString = await res.text();
	console.log('#HLVitq jsonString', jsonString);
	const json = JSON.parse(jsonString) as KindMeta;

	const urls = await getCommentUrls(COMMENT_RELAYS, parseInt(params.kind));
	return { kind: json, urls };
};
