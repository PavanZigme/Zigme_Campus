<script>
	let { field, value = $bindable(), onInput = () => {},shouldFocus = false, hasError = false, id } = $props();

	 // Add shouldFocus to props
	 
// Update useFocus to only focus if shouldFocus is true
function useFocus(node) {
	if (shouldFocus) {
		setTimeout(() => node.focus(), 0);
	}
	return {
		destroy() {}
	};
}

	const requirements = $state([
		{ label: 'Characters', regex: /[A-Za-z]/, valid: false },
		{ label: 'One uppercase letter ', regex: /[A-Z]/, valid: false },
		{ label: 'One lowercase letter', regex: /[a-z]/, valid: false },
		{ label: 'One number', regex: /\d/, valid: false },
		{ label: 'One special character', regex: /[@$!%*?&]/, valid: false },
		{ label: 'At least 8 characters long', regex: /.{8,}/, valid: false }
	]);

	function handleInput(event) {
		hasError = false;
		onInput(field.model);

		if (field.model === 'otp') {
			// Allow only numeric characters
			value = event.target.value.replace(/\D/g, '').slice(0, 4);
		}

		if (field.model === 'phone') {
			value = event.target.value.replace(/\D/g, '').slice(0, 10);
		}

		if (field.model === 'password') {
			requirements.forEach((req) => {
				req.valid = req.regex.test(value);
			});
		}
	}

 
</script>

<div class="">
	<label for={id} class="mb-[5px] block text-[1rem] font-[600] text-white">{field.label}</label>
	<div class="flex gap-2">
		{#if field.model === 'phone'}
			<span class="h-[50px] flex items-center text-[28px] lg:text-[42px] font-[400]">+91</span>
		{/if}
		<!-- svelte-ignore a11y_autofocus -->
		<input
			type={field.type}
			placeholder={field.placeholder}
			use:useFocus
			oninput={handleInput}
			bind:value
			{id}
			class=" !mr-[1px] h-[50px] w-full !border-l-4 border-b-0 border-r-0 border-t-0 border-accent !p-0 text-[28px] font-[700] placeholder:text-[#FBFBFB33] focus:border-none focus:bg-[#022F49] focus:outline-none focus:ring-0 md:text-[42px] md:font-[600]
			{hasError ? ' bg-[#FF110029] caret-red-900' : 'bg-[#022F49] '}
			"
		/>
	</div>
</div>

<style>
	input:-webkit-autofill,
	input:-webkit-autofill:focus {
		transition:
			background-color 600000s 0s,
			color 600000s 0s;
	}
	input[data-autocompleted] {
		background-color: transparent !important;
	}
</style>
