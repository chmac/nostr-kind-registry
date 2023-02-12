<script lang="ts">
	import { getEventsOfKindFromRelay, getEventsOfKindFromRelays } from '$lib/apis/nostr';
	import type { NostrEvent } from '../../../../../shared/types';
	import type { PageData } from './$types';
	export let data: PageData;

	let eventsPromise: Promise<NostrEvent[]> = new Promise(() => {});

	function handleGetEventClick(event: MouseEvent) {
		event.preventDefault();
		const fetchFromRelayUrl = (
			globalThis.document.getElementById('fetchFromRelayUrl') as HTMLInputElement
		).value;
		if (fetchFromRelayUrl.length > 0) {
			eventsPromise = getEventsOfKindFromRelay(data.kind.kind, fetchFromRelayUrl);
			return;
		}

		if (typeof data.kind.seenOnRelays === 'undefined' || data.kind.seenOnRelays.length === 0) {
			return;
		}
		eventsPromise = getEventsOfKindFromRelays(data.kind.kind, data.kind.seenOnRelays);
	}
</script>

<h1>
	Kind {data.kind.kind}
</h1>
<ul>
	<li>First seen: {data.kind.firstSeenDateString || 'unknown'}</li>
	<li>Seen on relays: {data.kind.seenOnRelays?.join('; ')}</li>
	<li>
		Related NIPs: {@html data.kind.relatedNips
			?.map((n) => `<a href="https://github.com/nostr-protocol/nips/blob/master/${n}.md">${n}</a>`)
			.join('; ') || 'none'}
	</li>
	<li>
		Related Implementations: {@html data.kind.implementationUrls
			?.map((i) => `<a href="${i}">${i}</a>`)
			.join('; ') || 'none'}
	</li>
	<li>
		<p>
			<button on:click={handleGetEventClick}>Fetch example events</button><input
				class="ml-1"
				type="text"
				id="fetchFromRelayUrl"
			/>
		</p>
		{#await eventsPromise then events}
			{#each events as event}
				<hr class="my-4" />
				<ul>
					{#each Object.entries(event) as [key, value]}
						<li class="font-mono break-all">
							<strong>{key}</strong>:
							{#if Array.isArray(value)}
								<ul>
									{#each value as [tagName, ...tagValue]}
										<li>{tagName}: {tagValue}</li>
									{/each}
								</ul>
							{:else}
								{value}
							{/if}
						</li>
					{/each}
				</ul>
			{/each}
		{:catch error}
			<p style="color: red">{error}</p>
		{/await}
	</li>
</ul>
