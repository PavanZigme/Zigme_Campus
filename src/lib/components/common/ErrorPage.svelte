<script>
    let {
        title = 'Page Not Found',
        message = 'The page you are looking for does not exist.',
        type = '404',
        showHomeButton = true
    } = $props();

    // Predefined error types
    const errorTypes = {
        '404': {
            icon: '️🔍',
            title: 'Page Not Found',
            message: 'The page you are looking for does not exist.'
        },
        '403': {
            icon: '🔒',
            title: 'Access Denied',
            message: 'You do not have permission to access this page.'
        },
        '500': {
            icon: '⚠️',
            title: 'Server Error',
            message: 'Something went wrong on our end.'
        },
        'default': {
            icon: '❌',
            title: 'Error',
            message: 'An error occurred.'
        }
    };

    // Get error configuration using $derived
    let errorConfig = $derived(errorTypes[type] || errorTypes.default);
</script>

<div class="min-h-[50vh] flex flex-col items-center justify-center p-4 text-center">
    <div class="max-w-md">
        <!-- Error Icon -->
        <div class="text-6xl mb-4">
            {errorConfig.icon}
        </div>

        <!-- Title -->
        <h1 class="text-4xl font-bold text-gray-800 mb-4">
            {title || errorConfig.title}
        </h1>

        <!-- Message -->
        <p class="text-gray-600 mb-8">
            {message || errorConfig.message}
        </p>

        <!-- Action Buttons -->
        <div class="space-x-4">
            {#if showHomeButton}
                <a 
                    href="/"
                    class="inline-block px-6 py-2 bg-blue500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                    Go Home
                </a>
            {/if}
            
            <button 
                onclick={() => history.back()}
                class="inline-block px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
                Go Back
            </button>
        </div>
    </div>
</div>