<script>
	import { fade } from 'svelte/transition';

	let bio = $state('');
	let isOpen = $state(false);

	function regenerateBio() {
		// Example bio generation - replace with your actual generation logic
		bio =
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam sagittis pretium nisi, nec commodo est. Fusce laoreet consequat sapien, eu fermentum ex pulvinar eget.';
	}

	function handleSkip() {
		isOpen = false;
	}

	function handleConfirm() {
		// Handle saving the bio
		isOpen = false;
	}
</script>

<div
	class="fixed inset-0 z-50 flex items-center justify-center p-4"
	class:hidden={!isOpen}
	transition:fade={{ duration: 200 }}
>
	<button
		type="button"
		class="fixed inset-0 bg-black/50"
		onclick={handleSkip}
		onkeydown={(e) => e.key === 'Enter' && handleSkip()}
		aria-label="Close popup"
	></button>

	<div class="relative w-full max-w-2xl rounded-lg bg-white p-8 shadow-xl">
		<h2 class="mb-2 text-center text-2xl font-semibold text-[#2D3748]">Your Bio, Your Style!</h2>
		<p class="mb-6 text-center text-gray-600">
			We've pieced together the perfect bio for you! Feel free to tweak it, edit it, or make it your
			own. Your story, your vibe!
		</p>

		<div class="mb-6">
			<label for="bio-input" class="mb-2 block text-sm font-medium text-gray-700">Bio</label>
			<textarea
				id="bio-input"
				bind:value={bio}
				rows="4"
				class="w-full rounded-lg border border-gray-300 p-3 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
			></textarea>
		</div>

		<div class="flex justify-between gap-4">
			<button
				onclick={handleSkip}
				class="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
			>
				Skip For Now
			</button>

			<button
				onclick={handleConfirm}
				class="flex-1 rounded-lg bg-[#0A2942] px-4 py-2 text-white hover:bg-[#0A2942]/90"
			>
				Looks great!
			</button>
		</div>

		<button
			onclick={regenerateBio}
			class="absolute right-4 top-4 flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-orange-500 hover:bg-orange-50"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-4 w-4"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
			>
				<path
					d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
				/>
			</svg>
			Regenerate
		</button>
	</div>
</div>
