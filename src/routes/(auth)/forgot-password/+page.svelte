<script>
	import AuthHeader from '$lib/components/auth/AuthHeader.svelte';
	import InputField from '$lib/components/InputField.svelte';
	

	function handleSubmit() {
		console.log('hi'); 
	}
</script>

<div class="h-screen w-full bg-[#E0E6E9]">
	<div class="mx-auto flex h-full flex-col">
		<AuthHeader />

		<!-- Form Section -->
		<main class="relative h-screen">
			<div
				class="flex h-full flex-col justify-between gap-[12px] rounded-t-[40px] bg-[#022F49] p-[24px] text-white lg:rounded-tr-[240px]"
			>
				<form onsubmit={handleSubmit} class="flex h-full flex-col justify-between gap-[12px]">
					<div class="mb-6">
						<h3
							class="lg:border-1 border-0 text-[24px] font-medium lg:w-fit lg:border-b lg:text-[20px]"
						>
						Forgot Password
						</h3>
					</div>
					<InputField
						field={{
							label: 'Email',
							type: 'email',
							placeholder: 'Enter your email',
							model: 'email'
						}}
					/>

					<div class="flex flex-col gap-[12px] lg:gap-[22px]">
						<div class="flex flex-col items-center gap-4 lg:flex-row lg:justify-between">
							<button
								class="flex w-full justify-center rounded-t-[10px] rounded-bl-[10px] rounded-br-[24px] bg-white px-[26px] py-[13px] text-center text-sm font-medium text-[#003366] transition-colors hover:bg-gray-100 lg:w-auto"
								type="submit"
							>
								Continue
							</button>
						</div>
					</div>
				</form>
			</div>
		</main>
	</div>
</div>
