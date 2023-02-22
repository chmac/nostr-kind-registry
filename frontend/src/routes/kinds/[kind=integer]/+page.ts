import { browser } from '$app/environment';
import { getCommentUrls } from '$lib/apis/nostr';
import type { KindMeta } from '../../../../../shared/types';
import { COMMENT_RELAYS, REPO_PUBLIC_URL } from '../../../constants';

export const load = async ({ params }: { params: { kind: string } }) => {
	const res = await fetch(`${REPO_PUBLIC_URL}/kinds/kind${params.kind}.json`);
	const jsonString = await res.text();
	console.log('#HLVitq jsonString', jsonString);
	const json = JSON.parse(jsonString) as KindMeta;

	// We fetch data on the client, but not on the server, because this data is
	// published by users on nostr and so we don't trust it at all.
	const urls = browser ? await getCommentUrls(COMMENT_RELAYS, parseInt(params.kind)) : [];
	return { kind: json, urls };
};
