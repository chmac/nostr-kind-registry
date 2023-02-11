<script lang="ts">
	export let name: string;
	export let url: string;

	import { page } from '$app/stores';
</script>

<a
	href={url}
	class={$page.url.pathname === url
		? 'bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium'
		: 'text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium'}
	aria-current="page">{name}</a
>
