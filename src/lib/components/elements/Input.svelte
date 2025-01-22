<script>
	let {
		type = 'text',
		placeholder = '',
		label = '',
		value = $bindable(),
		required = false,
		name = '',
		className = '',
		id = ''
	} = $props();

	// Generate a unique ID if none is provided
	$effect(() => {
		if (!id) {
			id = name || `input-${Math.random().toString(36).substr(2, 9)}`;
		}
	});
</script>

<div class="mb-4 w-full">
	{#if label}
		<label for={id} class="mb-[6px] block text-start text-sm font-normal text-[#FBFBFB]">
			{label}
			{#if required}
				<span class="ml-1 text-red-500">*</span>
			{/if}
		</label>
	{/if}

	<input
		{type}
		{name}
		{id}
		{placeholder}
		{required}
		bind:value
		class="{className} w-full rounded-[12px] border border-white/10 bg-[#F1F1F10F] p-[12px]
           text-white transition-all
           duration-200 placeholder:text-[#828BA2] focus:border-white/30
           focus:bg-black/30 focus:outline-none"
	/>
</div>
