<!-- src/lib/components/Sidebar.svelte -->
<script>
	import { goto } from '$app/navigation';

	const routes = [
		{ name: 'Dashboard', path: '/dashboard' },
		{ name: 'Resume Builder', path: '/resume-builder' },
		{ name: 'Placement Support', path: '/placement-support' },
		{ name: 'Jobs', path: '/jobs' },
		{ name: 'Sign Out', path: '/sign-out' }
	];

	function navigateTo(route) {
		goto(route);
	}
</script>

<div class="fixed h-full w-64 bg-gray-800 p-5 text-white">
	<h2 class="mb-4 text-xl font-bold">ZgMe</h2>
	{#each routes as route}
		<button
			type="button"
			class="mb-2 w-full cursor-pointer rounded p-2 text-left hover:bg-gray-700"
			onclick={() => navigateTo(route.path)}
			onkeydown={(e) => e.key === 'Enter' && navigateTo(route.path)}
		>
			{route.name}
		</button>
	{/each}
</div>
