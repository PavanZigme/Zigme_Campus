<script>
	let {
		options = [],
		placeholder = 'Select an option',
		value = $bindable(),
		label = '',
		required = false,
		name = '',
		className = '',
		onSelect = (selected) => {}
	} = $props();

	// Generate a unique ID if name is not provided
	const uniqueId = $state(name || `dropdown-${Math.random().toString(36).slice(2, 11)}`);

	let isOpen = $state(false);
	let selectedOption = $state(value);

	// Add effect to sync with external value changes
	$effect(() => {
		selectedOption = value;
	});

	function toggleDropdown() {
		isOpen = !isOpen;
	}

	function selectOption(option) {
		selectedOption = option;
		value = option;
		onSelect(option);
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

<div class="dropdown-container mb-4 w-full">
	{#if label}
		<label for={uniqueId} class="mb-[6px] block text-start text-sm font-normal text-[#FBFBFB]">
			{label}
			{#if required}
				<span class="ml-1 text-red-500">*</span>
			{/if}
		</label>
	{/if}

	<button
		type="button"
		id={uniqueId}
		name={uniqueId}
		class="{className} relative flex w-full items-center justify-between rounded-[12px] border
           border-white/10 bg-[#F1F1F133] p-[12px] text-left text-white
           transition-all duration-200 focus:border-white/30
           focus:bg-black/30 focus:outline-none"
		onclick={toggleDropdown}
	>
		<span class={selectedOption ? 'text-white' : 'text-[#828BA2]'}>
			{selectedOption || placeholder}
		</span>
		<svg
			class={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
		>
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
		</svg>
	</button>

	{#if isOpen}
		<div
			class="absolute z-50 mt-1 max-h-60 w-[260px] overflow-auto rounded-[12px] border border-white/10 bg-[#FFFFFF] shadow-lg"
		>
			{#each options as option}
				<button
					type="button"
					class="w-full px-4 py-2 text-left text-[14px] font-normal text-[#022F49] transition-colors hover:bg-[#F1F1F10F]"
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
