<script lang="ts">
	import type { PageData } from "./$types";
	export let data: PageData
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
</ul>
