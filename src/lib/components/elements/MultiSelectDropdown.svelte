<script>
	let {
		options = [],
		placeholder = 'Select options',
		value = $bindable([]),
		label = '',
		required = false,
		name = '',
		className = '',
		onSelect = (selected) => {},
		isMultiSelect = true
	} = $props();

	// Generate a unique ID if name is not provided
	const uniqueId = $state(name || `multi-dropdown-${Math.random().toString(36).slice(2, 11)}`);

	let isOpen = $state(false);
	let selectedOptions = $state(value);
	let searchQuery = $state('');
	let filteredOptions = $derived(
		options.filter((option) => option.toLowerCase().includes(searchQuery.toLowerCase()))
	);

	// Add new derived state for visible options
	let visibleOptions = $derived(searchQuery ? filteredOptions : options.slice(0, 3));

	// Add effect to sync with external value changes
	$effect(() => {
		selectedOptions = value;
	});

	function toggleDropdown() {
		isOpen = !isOpen;
	}

	function toggleOption(option) {
		if (isMultiSelect) {
			const index = selectedOptions.indexOf(option);
			if (index === -1) {
				selectedOptions = [...selectedOptions, option];
			} else {
				selectedOptions = selectedOptions.filter((item) => item !== option);
			}
			searchQuery = '';
		} else {
			selectedOptions = [option];
			isOpen = false;
			searchQuery = '';
		}
		value = selectedOptions;
		onSelect(selectedOptions);
	}

	function removeOption(option) {
		selectedOptions = selectedOptions.filter((item) => item !== option);
		value = selectedOptions;
		onSelect(selectedOptions);
	}

	function handleInput(event) {
		searchQuery = event.target.value;
		if (!isOpen) {
			isOpen = true;
		}
	}

	function handleKeydown(event) {
		if (event.key === 'Enter' && searchQuery.trim()) {
			event.preventDefault();
			// Add the typed value if it doesn't exist in options
			if (!options.includes(searchQuery.trim()) && !selectedOptions.includes(searchQuery.trim())) {
				selectedOptions = [...selectedOptions, searchQuery.trim()];
				value = selectedOptions;
				isOpen = false;
				onSelect(selectedOptions);
			}
			searchQuery = '';
		}
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

	// Update the display value for single select
	let displayValue = $derived(
		isMultiSelect ? searchQuery : selectedOptions.length > 0 ? selectedOptions[0] : ''
	);
</script>

<div class=" relative mb-4 w-full">
	{#if label}
		<label for={uniqueId} class="mb-[6px] block text-start text-sm font-normal text-[#FBFBFB]">
			{label}
			{#if required}
				<span class="ml-1 text-red-500">*</span>
			{/if}
		</label>
	{/if}

	<div class=" relative">
		<input
			type="text"
			id={uniqueId}
			name={uniqueId}
			role="combobox"
			aria-controls={`${uniqueId}-listbox`}
			aria-expanded={isOpen}
			placeholder={isMultiSelect
				? placeholder
				: selectedOptions.length > 0
					? selectedOptions[0]
					: placeholder}
			value={displayValue}
			class="{className} dropdown-container relative w-full rounded-[12px] border
				border-white/10 bg-[#F1F1F133] p-[12px] text-left text-white
				transition-all duration-200 focus:border-white/30
				focus:bg-black/30 focus:outline-none"
			oninput={handleInput}
			onkeydown={handleKeydown}
			onfocus={() => (isOpen = true)}
		/>
		<!-- readonly={!isMultiSelect} -->
		<button
			type="button"
			class="absolute right-3 top-1/2 -translate-y-1/2"
			onclick={toggleDropdown}
			aria-label="Toggle dropdown"
		>
			<svg
				class={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
			>
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
			</svg>
		</button>
	</div>

	<!-- Selected Options Tags - Only show for multi-select -->
	{#if isMultiSelect && selectedOptions.length > 0}
		<div class="mt-2 flex flex-wrap gap-2">
			{#each selectedOptions as option}
				<div class="flex items-center gap-1 rounded-full bg-[#E0EDEE] px-3 py-1">
					<span class="text-sm text-[#3C8E98]">{option}</span>
					<button type="button" class="text-[#3C8E98]" onclick={() => removeOption(option)}>
						×
					</button>
				</div>
			{/each}
		</div>
	{/if}

	{#if isOpen}
		<div
			id={`${uniqueId}-listbox`}
			class="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-[12px] border border-white/10 bg-[#FBFBFB] shadow-lg"
		>
			{#if filteredOptions.length === 0 && searchQuery}
				<div class="px-4 py-2 text-[#5D657A]">No results found</div>
			{:else}
				{#each visibleOptions as option}
					<button
						type="button"
						class="flex w-full items-center justify-between px-4 py-2 text-left text-[#5D657A]"
						onclick={() => toggleOption(option)}
					>
						<span>{option}</span>
						{#if selectedOptions.includes(option)}
							<svg class="h-4 w-4 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
								<path
									fill-rule="evenodd"
									d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
									clip-rule="evenodd"
								/>
							</svg>
						{/if}
					</button>
				{/each}

				{#if !searchQuery && options.length > 3}
					<div class="px-4 py-2 text-sm italic text-[#5D657A]">Type to see more options...</div>
				{/if}
			{/if}
		</div>
	{/if}
</div>
