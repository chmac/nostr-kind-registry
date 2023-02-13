<script lang="ts">
	import { getEventsOfKindFromRelay } from '$lib/apis/nostr';
	import type { NostrEvent } from '../../../../shared/types';
	import type { PageData } from './$types';
	export let data: PageData;

	function handleCheckRandomKindClick() {
		// getKindFromRelayPromises(data.randomKind, 10);
		batchCheck(data.randomKind, 8);
	}

	const eventPromises: { relay: string; eventPromise: Promise<NostrEvent[]> }[] = data.relays.map(
		(r) => {
			return {
				relay: r,
				eventPromise: Promise.reject('not checked yet') as Promise<NostrEvent[]>
			};
		}
	);

	async function batchCheck(kind: number, batchSize: number) {
		const relays = data.relays;
		let index = 0;

		if (batchSize > relays.length) batchSize = relays.length;

		function checkNextRelay() {
			index++;
			if (index >= relays.length) return;
			eventPromises[index].eventPromise = getEventsOfKindFromRelay(kind, data.relays[index]);
			eventPromises[index].eventPromise.finally(() => checkNextRelay());
		}

		for (let i = 0; i < batchSize; i++) checkNextRelay();
	}
</script>

<div class="max-w-prose">
	<p class="mb-5">
		Your random kind: {data.randomKind}
	</p>
	<button
		class="bg-slate-200 hover:bg-slate-300 rounded border p-2"
		on:click={handleCheckRandomKindClick}
		>Check It Now!
	</button>
	<div class="mt-5">
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
								<span>checking…</span>
							{:then event}
								<span style="color: red;">oh no! found event {event.id}</span>
							{:catch error}
								{#if error === 'not checked yet'}
									<span>not checked yet</span>
								{:else if error === 'event not found'}
									<span style="color: green;">event not found!</span>
								{:else if error === 'timed out'}
									<span style="color: orange">timed out</span>
								{:else}
									<span style="color: orange">errored</span>
								{/if}
							{/await}
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
