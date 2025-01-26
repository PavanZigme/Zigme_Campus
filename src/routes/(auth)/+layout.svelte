<script>
	import { auth } from '$lib/stores/auth';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	let { children } = $props();

	onMount(() => {
		if (!$auth.isAuthenticated) {
			goto('/login');
		}
	});
</script>

{@render children()}
