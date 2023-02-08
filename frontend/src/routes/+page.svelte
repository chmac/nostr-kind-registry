<script lang="ts">
	import type { KindMeta } from '../../../shared/types';
	export let data: { kinds: number[] };
</script>

<h1>All Kinds Ever seen</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

<ul>
	{#each data.kinds as kind}
		<li>
			<a href="/kinds/{kind}">Kind {kind}</a>
		</li>
	{/each}
</ul>
