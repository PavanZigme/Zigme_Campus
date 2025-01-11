<script>
    const { password, onValidationChange = () => {} } = $props();
    
    let validations = $state({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        special: false
    });

    let isValid = $derived(Object.values(validations).every(v => v));
    
    $effect(() => {
        validations.length = password.length >= 8;
        validations.uppercase = /[A-Z]/.test(password);
        validations.lowercase = /[a-z]/.test(password);
        validations.number = /\d/.test(password);
        validations.special = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        
        onValidationChange(isValid);
    });
</script>

<div class="flex flex-col gap-2 mt-2 text-sm bg-[#F1F1F10F] p-[10px] rounded-[12px]">
    <div class="text-gray-200 mb-1">The password should have at least</div>
    <div class="flex gap-16">
        {#each Object.entries(validations) as [key, value]}
            <div class="flex items-center gap-2">
                <div class="w-4 h-4 flex items-center justify-center">
                    {#if value}
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6.6667 0.333984C2.99336 0.333984 3.05176e-05 3.32732 3.05176e-05 7.00065C3.05176e-05 10.674 2.99336 13.6673 6.6667 13.6673C10.34 13.6673 13.3334 10.674 13.3334 7.00065C13.3334 3.32732 10.34 0.333984 6.6667 0.333984ZM9.85336 5.46732L6.07336 9.24732C5.98003 9.34065 5.85336 9.39398 5.72003 9.39398C5.5867 9.39398 5.46003 9.34065 5.3667 9.24732L3.48003 7.36065C3.2867 7.16732 3.2867 6.84732 3.48003 6.65398C3.67336 6.46065 3.99336 6.46065 4.1867 6.65398L5.72003 8.18732L9.1467 4.76065C9.34003 4.56732 9.66003 4.56732 9.85336 4.76065C10.0467 4.95398 10.0467 5.26732 9.85336 5.46732Z" fill="#828BA2"/>
                        </svg>
                        
                    {:else}
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7.99999 14.6673C11.6667 14.6673 14.6667 11.6673 14.6667 8.00065C14.6667 4.33398 11.6667 1.33398 7.99999 1.33398C4.33333 1.33398 1.33333 4.33398 1.33333 8.00065C1.33333 11.6673 4.33333 14.6673 7.99999 14.6673Z" stroke="#828BA2" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        
                    {/if}
                </div>
                <span class="{value ? 'text-[#828BA2]' : 'text-[#E9E9E9]'}">
                    {#if key === 'length'}
                        Eight characters
                    {:else if key === 'uppercase'}
                        One uppercase letter
                    {:else if key === 'lowercase'}
                        One lowercase letter
                    {:else if key === 'number'}
                        One number
                    {:else if key === 'special'}
                        One special character
                    {/if}
                </span>
            </div>
        {/each}
    </div>
</div> 