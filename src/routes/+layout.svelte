<script>
	import '../app.css';
	import { auth } from '$lib/stores/auth';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { Toaster } from 'svelte-sonner';
	import { loaderStore } from '$lib/stores/loader';

	let { children } = $props();

	// Handle auth redirects
	$effect(() => {
		const path = $page.url.pathname;
		const isAuthRoute = path.startsWith('/login');

		if ($auth.isAuthenticated && isAuthRoute) {
			goto('/dashboard');
		}
	});
</script>

{@render children()}

<Toaster richColors />

{#if $loaderStore.isLoading}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
		<div class="flex flex-col items-center gap-3 rounded-lg bg-white p-6 shadow-xl">
			<div
				class="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"
			></div>
			{#if $loaderStore.message}
				<p class="text-center text-sm text-gray-600">{$loaderStore.message}</p>
			{/if}
		</div>
	</div>
{/if}

<style>
	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
</style>
