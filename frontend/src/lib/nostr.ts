import type { NostrEvent } from '../../../shared/types';
import { relayInit } from 'nostr-tools';

export async function getEventKindFromRelay(kind: number, relayUrl: string): Promise<NostrEvent> {
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
		let sub = relay.sub([
			{
				kinds: [kind]
			}
		]);

		sub.on('event', (event: NostrEvent) => {
			resolve(event);
		});
		sub.on('eose', () => {
			sub.unsub();
			reject('event not found');
		});
	});
}

export function getEventKindFromRelays(kind: number, relayUrls: string[]): Promise<NostrEvent>[] {
	return relayUrls.map((relayUrl) => {
		return getEventKindFromRelay(kind, relayUrl);
	});
}
