export async function withLoading(loadingState, asyncFn) {
    loadingState.loading = true;
    try {
        await asyncFn();
    } catch (error) {
        toast.error(error.message);
        console.error(error);
    } finally {
        loadingState.loading = false;
    }
} 