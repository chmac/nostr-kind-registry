<script lang="ts">
	import { getEventKindFromRelay } from '$lib/nostr';
	import type { NostrEvent } from '../../../shared/types';
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
	}
</script>

<h1>All Kinds Ever seen</h1>

<ul>
	{#each data.kinds as kind}
		<li>
			<a href="/kinds/{kind.kind}">Kind {kind.kind}</a>
		</li>
	{/each}
</ul>
<p>
	<a href="" on:click={handleGetRandomKindClick}
		>get random unseen kind:
	</a>{#await randomKindPromise then randomKind}
		{randomKind}
		<ul>
			{#each data.relays as relay}
				<li>
					{relay}:
					{#await getEventKindFromRelay(randomKind, relay)}
						<span>loading…</span>
					{:then event}
						<span style="color: red;">oh no! found event {event.id}</span>
					{:catch error}
						{#if error === 'event not found'}
							<span style="color: green;">event not found!</span>
						{:else}
							<span style="color: yellow">errored</span>
						{/if}
					{/await}
				</li>
			{/each}
		</ul>
	{/await}
</p>
