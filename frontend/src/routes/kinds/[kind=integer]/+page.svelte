<script lang="ts">
	import { getEventsOfKindFromRelay, getEventsOfKindFromRelays } from '$lib/apis/nostr';
	import InteractiveNostrEvent from '$lib/components/InteractiveNostrEvent.svelte';
	import type { NostrEvent } from '../../../../../shared/types';
	import type { PageData } from './$types';
	import { COMMENT_KIND, COMMENT_RELAYS } from '../../../constants';
	export let data: PageData;

	let eventDialog: HTMLDialogElement;
	let urlForm: HTMLFormElement;
	let commentUrl: string;
	let commentEventStub: string;

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

	function handleUrlFormClick(event: MouseEvent) {
		event.preventDefault();
		commentEventStub = `{
  "kind": ${COMMENT_KIND},
  "tags": [
    ["k", "${data.kind.kind}"],
	["url", "${commentUrl}"]
  ],
  "content": ""
}`;
		eventDialog.show();
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
		Related Implementations: {@html data.urls.map((i) => `<a href="${i}">${i}</a>`).join('; ') ||
			'none'}
	</li>
	<li>
		<form bind:this={urlForm}>
			<button
				class="bg-slate-200 hover:bg-slate-300 rounded border p-2 mb-2"
				on:click={(e) => urlForm.checkValidity() && handleUrlFormClick(e)}>Add URL comment</button
			>
			<input class="border ml-1" type="URL" required bind:value={commentUrl} />
		</form>
		<p>
			<button
				class="bg-slate-200 hover:bg-slate-300 rounded border p-2 mb-2"
				on:click={handleGetEventClick}>Fetch example events</button
			><input class="ml-1" type="text" id="fetchFromRelayUrl" />
		</p>
		{#await eventsPromise then events}
			{#each events as event}
				<hr class="my-4" />
				<InteractiveNostrEvent {event} />
			{/each}
		{:catch error}
			<p style="color: red">{error}</p>
		{/await}
	</li>
</ul>

<!-- A modal dialog containing a form -->
<dialog bind:this={eventDialog} class="border bg-slate-100">
	<p>
		To add an implementation url, publish an event with these fields to one (or all) of these
		relays:<br />{COMMENT_RELAYS.join(', ')}
	</p>
	<pre class="border my-3 p-2">{commentEventStub}</pre>
	<form method="dialog">
		<button
			class="bg-slate-200 hover:bg-slate-300 rounded border p-2 mb-2 float-left"
			on:click={(e) => {
				e.preventDefault();
				navigator.clipboard.writeText(commentEventStub);
			}}>Copy</button
		>
		<button
			class="bg-slate-200 hover:bg-slate-300 rounded border p-2 mb-2 float-right"
			on:click={() => eventDialog.close()}>Close</button
		>
	</form>
</dialog>
