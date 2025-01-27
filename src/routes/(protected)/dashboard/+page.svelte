<script>
	import { auth } from '$lib/stores/auth';
	import { authService } from '$lib/services/auth';
	import { goto } from '$app/navigation';

	function handleLogout() {
		authService.logout();
		goto('/login');
	}
</script>

<div>
	<h1 class="text-2xl font-bold">Welcome, {$auth.user?.name}</h1>
	<button
		class="mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
		onclick={handleLogout}
	>
		Logout
	</button>
	<!-- Add more content here as needed -->
</div>
