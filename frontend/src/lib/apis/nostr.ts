import type { NostrEvent } from '../../../../shared/types';
import { relayInit } from 'nostr-tools';

export async function getEventsOfKindFromRelay(
	kind: number,
	relayUrl: string
): Promise<NostrEvent[]> {
	console.log(`connecting to ${relayUrl} ...`);
	const relay = relayInit(relayUrl);
	await relay.connect();

	return new Promise((resolve, reject) => {
		setTimeout(() => reject('timed out'), 5_000);
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
		});
		sub.on('eose', () => {
			sub.unsub();
			if (events.length === 0) {
				reject('event not found');
			} else {
				resolve(events);
			}
		});
	});
}

export async function getEventKindFromRelays(
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
