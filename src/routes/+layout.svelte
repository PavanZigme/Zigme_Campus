<script>
    import '../app.css';
    import { auth } from '$lib/stores/auth';
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    import { Toaster } from 'svelte-sonner';


    let { children } = $props();

    // Handle auth redirects
    $effect(() => {
        const path = $page.url.pathname;
        const isAuthRoute = path.startsWith('/login') || path.startsWith('/signup');
        
        if ($auth.isAuthenticated && isAuthRoute) {
            goto('/dashboard');
        } 
    });
</script>


{@render children()}

<Toaster richColors />










