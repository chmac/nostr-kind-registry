<script lang="ts">
	import type { PageData } from "./$types";
	export let data: PageData
</script>

<h1>All Kinds Ever seen</h1>

<ul>
	{#each data.kinds as kind}
		<li>
			<a href="/kinds/{kind}">Kind {kind}</a>
		</li>
	{/each}
</ul>
