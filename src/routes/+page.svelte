<!-- <script>
	let logintrue = $state(false);
</script>

<div class="h-screen overflow-auto">
	<a href="/login">Login</a>
</div> -->


<script>
	import { auth } from '$lib/stores/auth';
	import { goto } from '$app/navigation';
	$effect(() => {
		if ($auth.isAuthenticated) {
			goto('/dashboard');
		} else {
			goto('/login');
		}
	});
 </script>
 <div class="h-screen flex items-center justify-center" >
	<p>Loading...</p>
 </div>