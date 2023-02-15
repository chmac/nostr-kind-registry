<script>
	import NavBarLink from './NavBarLink.svelte';
	import { base } from '$app/paths';
</script>

<nav class="bg-gray-800">
	<div class="relative flex h-16 items-center justify-between">
		<div class="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
			<div class="hidden sm:ml-6 sm:block">
				<div class="flex space-x-4">
					<NavBarLink name="Feed" url="{base}/" />
					<NavBarLink name="Get Unused Kind" url="{base}/unused-kind/" />
					<NavBarLink name="Raw Data" url="{base}/raw-data/" />
				</div>
			</div>
		</div>
	</div>
</nav>
