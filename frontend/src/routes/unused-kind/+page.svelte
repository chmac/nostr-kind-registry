<script lang="ts">
	import { getEventKindFromRelay } from '$lib/apis/nostr';
	import type { NostrEvent } from '../../../../shared/types';
	import type { PageData } from './$types';
	export let data: PageData;

	function getRandomKind() {
		const min = 100;
		const max = 10_000;
		while (true) {
			let randomKind = Math.floor(Math.random() * (max - min) + min);
			if (!data.kinds.find(({ kind }) => kind === randomKind)) return randomKind;
		}
	}

	let randomKindPromise: Promise<number> = new Promise(() => {});

	function handleGetRandomKindClick() {
		const randomKind = getRandomKind();
		randomKindPromise = Promise.resolve(randomKind);
		getKindFromRelayPromises(randomKind, 10);
	}

	type emap = {
		[index: string]: Promise<NostrEvent>;
	};

	const eventPromises: { relay: string; eventPromise: Promise<NostrEvent> }[] = data.relays.map(
		(r) => {
			return {
				relay: r,
				eventPromise: new Promise(() => {}) as Promise<NostrEvent>
			};
		}
	);

	async function getKindFromRelayPromises(kind: number, batchSize: number) {
		let batchIndex = 0;
		while (batchIndex < data.relays.length) {
			for (let i = batchIndex; i < Math.min(batchIndex + batchSize, data.relays.length); i++) {
				eventPromises[i].eventPromise = getEventKindFromRelay(kind, data.relays[i]);
			}
			await Promise.allSettled(
				eventPromises.slice(batchIndex, batchIndex + batchSize).map((o) => o.eventPromise)
			);
			batchIndex += batchSize;
		}
	}
</script>

<div class="max-w-prose">
	<div>
		<button
			class="bg-slate-200 hover:bg-slate-300 rounded border"
			on:click={handleGetRandomKindClick}
			><span class="p-5">get random unseen kind</span>
		</button>
		<div class="mt-5">
			{#await randomKindPromise then randomKind}
				<p>Checking kind: {randomKind}</p>

				<table>
					<thead>
						<tr>
							<th>Relay</th>
							<th>Event status</th>
						</tr>
					</thead>
					<tbody>
						{#each eventPromises as { relay, eventPromise }}
							<tr>
								<td>{relay}:</td>
								<td>
									{#await eventPromise}
										<span>loading…</span>
									{:then event}
										<span style="color: red;">oh no! found event {event.id}</span>
									{:catch error}
										{#if error === 'event not found'}
											<span style="color: green;">event not found!</span>
										{:else if error === 'timed out'}
											<span style="color: orange">timed out</span>
										{:else}
											<span style="color: yellow">errored</span>
										{/if}
									{/await}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			{/await}
		</div>
	</div>
</div>
