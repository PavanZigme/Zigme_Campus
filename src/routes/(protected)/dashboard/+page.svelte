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
    <h1>Welcome, {$auth.user?.name}</h1>
    <button onclick={handleLogout}>Logout</button>
</div>