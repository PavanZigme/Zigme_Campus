<script>
	import { goto } from '$app/navigation';

	let { message = '' } = $props();

	let isExistingAccount = $derived(
		message?.toLowerCase().includes('already in use') ||
			message?.toLowerCase().includes('already registered')
	);

	function handleSignIn() {
		goto('/login');
	}
</script>

<div class="col-span-full mt-2 {message ? '' : 'hidden'}">
	<div
		class="flex justify-between items-center gap-2 rounded-[12px] rounded-[12px] bg-[#F1F1F10F] p-[10px] p-[6px] text-xs font-normal text-[#D6DDE2] lg:text-[14px]"
	>
	<div class="flex gap-2 items-center ">

	
		<svg
			class="h-[22px] w-[22px]"
			width="16"
			height="16"
			viewBox="0 0 16 16"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M7.99992 14.6666C11.6666 14.6666 14.6666 11.6666 14.6666 7.99992C14.6666 4.33325 11.6666 1.33325 7.99992 1.33325C4.33325 1.33325 1.33325 4.33325 1.33325 7.99992C1.33325 11.6666 4.33325 14.6666 7.99992 14.6666Z"
				stroke="#F0F6F7"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M8 5.33325V8.66659"
				stroke="#F0F6F7"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M7.99634 10.6667H8.00233"
				stroke="#F0F6F7"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
		{message}
	</div>

		{#if isExistingAccount}
			<a class="text-end text-[14px] font-[500] text-[#D6DDE2]" href="/login">Sign In</a>
		{/if}
	</div>
</div>
