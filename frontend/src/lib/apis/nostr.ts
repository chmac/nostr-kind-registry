import type { NostrEvent } from '../../../../shared/types';
import { relayInit } from 'nostr-tools';
import { COMMENT_KIND } from '../../constants';

export async function getEventsOfKindFromRelay(
	kind: number,
	relayUrl: string
): Promise<NostrEvent[]> {
	console.log(`connecting to ${relayUrl} ...`);
	const relay = relayInit(relayUrl);
	await relay.connect();

	return new Promise((resolve, reject) => {
		relay.on('connect', () => {
			console.log(`connected to ${relay.url}`);
		});
		relay.on('error', () => {
			reject(`failed to connect to ${relay.url}`);
		});
		// let's query for an event that exists
		const sub = relay.sub([
			{
				kinds: [kind],
				limit: 10
			}
		]);
		const events: NostrEvent[] = [];

		sub.on('event', (event: NostrEvent) => {
			events.push(event);
			console.log(`#LqWeB7 Got event from relay ${relayUrl}`, event);
		});
		sub.on('eose', () => {
			sub.unsub();
			if (events.length === 0) {
				reject('event not found');
			} else {
				resolve(events);
			}
		});
		setTimeout(() => {
			reject('timed out');
			sub.unsub();
		}, 5_000);
	});
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
	const events = getEventsOfKindFromRelays(COMMENT_KIND, relayUrls);
	const urls: string[] = [];

	(await events).forEach((e: NostrEvent) => {
		let uTag = e.tags.find((tagArray) => {
			return tagArray.at(0) === 'url';
		});
		if (uTag !== undefined && uTag.length >= 2) urls.push(uTag[1]);
	});
	return urls;
}
