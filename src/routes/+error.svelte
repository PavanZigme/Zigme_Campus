<script>
	import ErrorPage from '$lib/components/common/ErrorPage.svelte';
	// import ErrorPage from '$lib/components/common/ErrorPage.svelte';

	import { page } from '$app/stores';

	// Get error details from the page store using correct derived syntax
	let errorType = $derived(
		$page.status === 404
			? '404'
			: $page.status === 403
				? '403'
				: $page.status === 500
					? '500'
					: 'default'
	);
</script>

<ErrorPage type={errorType} title={$page.error?.message || undefined} />
