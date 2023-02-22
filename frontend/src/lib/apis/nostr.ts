import type { NostrEvent } from '../../../../shared/types';
import * as nostr from 'nostr-tools';
const { relayInit } = nostr; // had some issue with import { relayInit } from 'nostr-tools'
import { COMMENT_KIND } from '../../constants';

export async function getEventsFromRelay(relayUrl: string, filter: any): Promise<NostrEvent[]> {
	console.log(`#5EULu9 connecting to ${relayUrl} ...`);
	const relay = relayInit(relayUrl);
	await relay.connect();

	return new Promise((resolve, reject) => {
		relay.on('connect', () => {
			console.log(`#sITVfy connected to ${relay.url}`);
		});
		relay.on('error', () => {
			relay.close();
			reject(`failed to connect to ${relay.url}`);
		});
		// let's query for an event that exists
		const sub = relay.sub([filter]);
		const events: NostrEvent[] = [];

		const timeoutTimerId = setTimeout(() => {
			console.log(`#IvEtOq getEventsFromRelay timeout ${relayUrl}`);
			reject('timed out');
			sub.unsub();
			relay.close();
		}, 5_000);

		sub.on('event', (event: NostrEvent) => {
			events.push(event);
			console.log(`#LqWeB7 Got event from relay ${relayUrl}`, event);
		});
		sub.on('eose', () => {
			console.log(`#1ykpIS Closing relay connection ${relayUrl}`);
			clearTimeout(timeoutTimerId);
			sub.unsub();
			relay.close();
			if (events.length === 0) {
				reject('event not found');
			} else {
				resolve(events);
			}
		});
	});
}

export function getEventsOfKindFromRelay(kind: number, relayUrl: string): Promise<NostrEvent[]> {
	return getEventsFromRelay(relayUrl, { kinds: [kind] });
}

export function checkRelayForEventsOfKind(kind: number, relayUrl: string): Promise<NostrEvent[]> {
	return getEventsFromRelay(relayUrl, { kinds: [kind], limit: 1 });
}

export async function getEventsOfKindFromRelays(
	kind: number,
	relayUrls: string[]
): Promise<NostrEvent[]> {
	const eventsPromises = relayUrls.flatMap(async (relayUrl) => {
		return getEventsOfKindFromRelay(kind, relayUrl);
	});
	const eventsByRelay = await Promise.all(eventsPromises);
	const events = eventsByRelay.flatMap((e) => e);
	return events;
}

export async function getCommentUrls(relayUrls: string[], kind: number) {
	// TODO: actually filter for the kind
	try {
		const events = await getEventsFromRelay(relayUrls[0], {
			kinds: [COMMENT_KIND],
			limit: 20,
			'#k': [`${kind}`]
		});
		const urls: string[] = [];

		events.forEach((e: NostrEvent) => {
			let uTag = e.tags.find((tagArray) => {
				return tagArray.at(0) === 'url';
			});
			if (uTag !== undefined && uTag.length >= 2) urls.push(uTag[1]);
		});
		return urls;
	} catch (e) {
		return [];
	}
}
