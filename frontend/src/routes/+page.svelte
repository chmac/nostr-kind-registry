<script lang="ts">
	import type { WORKER_OUTPUT_SEEN_KINDS } from '../../../shared/types';

	export let data: WORKER_OUTPUT_SEEN_KINDS;
</script>

<h1>All Kinds Ever seen</h1>

<ul>
	{#each data.kinds as kind}
		<li>
			<a href="/kinds/{kind}">Kind {kind}</a>
		</li>
	{/each}
</ul>
