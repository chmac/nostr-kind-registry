<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;

	function getRandomKind() {
		const min = 0;
		const max = 40_000;
		while (true) {
			let randomKind = Math.floor(Math.random() * (max - min) + min);
			if (!data.kinds.find(({kind}) => kind === randomKind)) return randomKind;
		}
	}

	let randomKindPromise = new Promise(() => {});
	function handleGetRandomKindClick() {
		randomKindPromise = Promise.resolve(getRandomKind());
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
	{/await}
</p>
