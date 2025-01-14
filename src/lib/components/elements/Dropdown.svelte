<script>
  let {
    options = [],
    placeholder = "Select an option",
    value = $bindable(),
    label = "",
    required = false,
    name = "",
    className = ""
  } = $props();

  let isOpen = $state(false);
  let selectedOption = $state(value);

  function toggleDropdown() {
    isOpen = !isOpen;
  }

  function selectOption(option) {
    selectedOption = option;
    value = option;
    isOpen = false;
  }

  // Close dropdown when clicking outside
  function handleClickOutside(event) {
    const dropdown = event.target.closest('.dropdown-container');
    if (!dropdown) {
      isOpen = false;
    }
  }

  $effect(() => {
    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
    } else {
      document.removeEventListener('click', handleClickOutside);
    }
  });
</script>

<div class="dropdown-container mb-4">
  {#if label}
    <label 
      for={name} 
      class="text-start block text-[#FBFBFB] text-sm font-normal mb-[6px]"
    >
      {label}
      {#if required}
        <span class="text-red-500 ml-1">*</span>
      {/if}
    </label>
  {/if}
  
  <button
    type="button"
    class="{className} relative min-w-[260px] max-w-full bg-[#F1F1F10F] rounded-[12px] border border-white/10 text-white 
           p-[12px] text-left flex justify-between items-center
           focus:outline-none focus:border-white/30 focus:bg-black/30
           transition-all duration-200"
    onclick={toggleDropdown}
  >
    <span class={selectedOption ? "text-white" : "text-[#828BA2]"}>
      {selectedOption || placeholder}
    </span>
    <svg
      class={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path 
        stroke-linecap="round" 
        stroke-linejoin="round" 
        stroke-width="2" 
        d="M19 9l-7 7-7-7"
      />
    </svg>
  </button>

  {#if isOpen}
    <div 
      class="absolute z-50 mt-1 w-[260px] max-h-60 overflow-auto rounded-[12px] bg-[#022F49] border border-white/10 shadow-lg"
    >
      {#each options as option}
        <button
          type="button"
          class="w-full px-4 py-2 text-left text-white hover:bg-[#F1F1F10F] transition-colors"
          onclick={() => selectOption(option)}
        >
          {option}
        </button>
      {/each}
    </div>
  {/if}
</div>

<style>
  /* Custom scrollbar styles */
  div::-webkit-scrollbar {
    width: 6px;
  }

  div::-webkit-scrollbar-track {
    background: transparent;
  }

  div::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
  }
</style> 