<script lang="ts">
	import { getEventKindFromRelay } from '$lib/apis/nostr';
	import type { NostrEvent } from '../../../../../shared/types';
	import type { PageData } from './$types';
	export let data: PageData;

	let eventPromise: Promise<NostrEvent> = new Promise(() => {});

	function handleGetEventClick() {
		eventPromise = getEventKindFromRelay(data.kind.kind, data.kind.seenOnRelays?.at(0) ?? '');
	}
</script>

<h1>
	Kind {data.kind.kind}
</h1>
<ul>
	<li>First seen: {data.kind.firstSeenDateString}</li>
	<li>Seen on relays: {data.kind.seenOnRelays?.join('; ')}</li>
	<li>
		Related NIPs: {@html data.kind.relatedNips
			?.map((n) => `<a href="https://github.com/nostr-protocol/nips/blob/master/${n}.md">${n}</a>`)
			.join('; ')}
	</li>
	<li>
		Related Implementations: {@html data.kind.implementationUrls
			?.map((i) => `<a href="${i}">${i}</a>`)
			.join('; ')}
	</li>
	<li>
		<a href="" on:click={handleGetEventClick}>get event details</a>
		{#await eventPromise then event}
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
		{:catch error}
			<p style="color: red">{error}</p>
		{/await}
	</li>
</ul>
