<script lang="ts">
	import { getEventsOfKindFromRelay } from '$lib/apis/nostr';
	import type { NostrEvent } from '../../../../../shared/types';
	import type { PageData } from './$types';
	export let data: PageData;

	let eventsPromise: Promise<NostrEvent[]> = new Promise(() => {});

	function handleGetEventClick() {
		eventsPromise = getEventsOfKindFromRelay(data.kind.kind, data.kind.seenOnRelays?.at(0) ?? '');
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
		<a href="" on:click={handleGetEventClick}>Fetch example events</a>
		{#await eventsPromise then events}
			{#each events as event}
				<ul>
					{#each Object.entries(event) as [key, value]}
						<li class="font-mono break-all">
							<strong>{key}</strong>:
							{#if Array.isArray(value)}
								{JSON.stringify(value)}
							{:else}
								{value}
							{/if}
						</li>
					{/each}
				</ul>
				<hr class="my-4" />
			{/each}
		{:catch error}
			<p style="color: red">{error}</p>
		{/await}
	</li>
</ul>
