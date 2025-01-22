import { writable } from 'svelte/store';

export const loaderStore = writable({
    isLoading: false,
    message: ''
});

export const showLoader = (message = '') => {
    loaderStore.set({ isLoading: true, message });
};

export const hideLoader = () => {
    loaderStore.set({ isLoading: false, message: '' });
}; 