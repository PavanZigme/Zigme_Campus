import { writable } from 'svelte/store';
import { browser } from '$app/environment';
const createAuthStore = () => {
   const initialState = browser ? 
       JSON.parse(localStorage.getItem('authState')) || { isAuthenticated: false, user: null } :
       { isAuthenticated: false, user: null };
    const { subscribe, set, update } = writable(initialState);
    return {
       subscribe,
       login: (userData) => {
           const newState = { isAuthenticated: true, user: userData };
           if (browser) localStorage.setItem('authState', JSON.stringify(newState));
           set(newState);
       },
       logout: () => {
           const newState = { isAuthenticated: false, user: null };
           if (browser) localStorage.removeItem('authState');
           set(newState);
       },
       updateUser: (userData) => {
           update(state => {
               const newState = { ...state, user: { ...state.user, ...userData } };
               if (browser) localStorage.setItem('authState', JSON.stringify(newState));
               return newState;
           });
       }
   };
};
export const auth = createAuthStore();