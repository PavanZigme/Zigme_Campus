<script>
	import { auth } from '$lib/stores/auth';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import Sidebar from '$lib/components/dashboardSidebar/Sidebar.svelte';

	let { children } = $props();
	let isAuthRoute = $state(null);
	$effect(() => {
		const path = $page.url.pathname;
		isAuthRoute = path.startsWith('/resume-builder');
	});

	onMount(() => {
		if (!$auth.isAuthenticated) {
			goto('/login');
		}
	});
</script>

<!-- {#if !isAuthRoute}
	<div class="flex">
		<Sidebar />
		<div class="ml-64 flex-1 p-5">
			{@render children()}
		</div>
	</div>
{:else} -->
{@render children()}
<!-- {/if} -->
