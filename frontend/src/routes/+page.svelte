<script lang="ts">
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<div class="max-w-prose">
	<h1 class="font-semibold">All Kinds Ever Seen</h1>
	This page lists every kind our crawlers have ever seen, along with the date of the first sighting.
	Click on a table row to get more information about that kind.
</div>

<div class="my-2 max-w-xl">
	<table
		class="table-fixed border-collapse w-full border border-slate-400 dark:border-slate-500 bg-white dark:bg-slate-800 text-sm shadow-sm"
	>
		<thead>
			<tr>
				<th class="border border-slate-300">Kind</th>
				<th class="border border-slate-300">First Seen</th>
			</tr>
		</thead>
		<tbody>
			{#each data.kinds.reverse() as kind}
				<tr on:click={() => goto(`/kinds/${kind.kind}`)} class="hover:bg-slate-300">
					<td
						class="border border-slate-300 dark:border-slate-700 p-4 text-slate-500 dark:text-slate-400"
					>
						{kind.kind}
					</td>
					<td
						class="border border-slate-300 dark:border-slate-700 p-4 text-slate-500 dark:text-slate-400"
					>
						{kind.seen.toDateString()}
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
