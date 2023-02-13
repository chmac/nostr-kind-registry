<script lang="ts">
	import type { NostrEvent } from '../../../../shared/types';
	export let event: NostrEvent;
	export let maxLengthInChars = 100;
</script>

<ul>
	<li class="font-mono break-all">
		<details open={event.tags.length < maxLengthInChars}>
			<summary class="hover:cursor-pointer"><strong>tags</strong>:</summary>
			{#if Array.isArray(event.tags)}
				<ul>
					{#each event.tags as [tagName, ...tagValue]}
						<li>{tagName}: {tagValue}</li>
					{/each}
				</ul>
			{:else}
				{event.tags}
			{/if}
		</details>
	</li>
	<li class="font-mono break-all">
		<details open={event.content.length < maxLengthInChars}>
			<summary class="hover:cursor-pointer">
				<strong>content</strong>:
			</summary>
			{event.content}
		</details>
	</li>
	<li class="font-mono break-all">
		<details open>
			<summary class="hover:cursor-pointer">
				<strong>created_at</strong>:
			</summary>
			{event.created_at}
			<span class="font-sans italic">({new Date(event.created_at * 1000).toUTCString()})</span>
		</details>
	</li>
	<li class="font-mono break-all">
		<details open>
			<summary class="hover:cursor-pointer">
				<strong>pubkey</strong>:
			</summary>
			<a
				class="underline hover:cursor-pointer hover:text-slate-500"
				target="_blank"
				rel="noreferrer"
				href={`https://iris.to/${event.pubkey}`}>{event.pubkey}</a
			>
		</details>
	</li>
	<li class="font-mono break-all">
		<details>
			<summary class="hover:cursor-pointer">
				<strong>kind</strong>:
			</summary>
			{event.kind}
		</details>
	</li>
	<li class="font-mono break-all">
		<details>
			<summary class="hover:cursor-pointer">
				<strong>id</strong>:
			</summary>
			{event.id}
		</details>
	</li>
	<li class="font-mono break-all">
		<details>
			<summary class="hover:cursor-pointer">
				<strong>sig</strong>:
			</summary>
			{event.sig}
		</details>
	</li>
</ul>
