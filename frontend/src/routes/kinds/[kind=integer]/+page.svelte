<script lang="ts">
	import type { PageData } from './$types';
	import type { NostrEvent } from '../../../../../shared/types';
	import { getEventKindFromRelay } from '../../../lib/nostr';
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
	<li>First seen: {data.kind.firstSeenTimestamp}</li>
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
	</li>
	<li>
		<pre>
		{#await eventPromise then event}
				{JSON.stringify(event, null, 2)}
			{:catch error}
				<span style="color: red">{error}</span>
			{/await}
	</pre>
	</li>
</ul>
