<script>
	import { resumeBuilderStore, updateCurrentStep } from '$lib/stores/resumeBuilder';

	let { title = '', subtitle = '', totalSteps = 7, children } = $props();

	function nextStep() {
		if ($resumeBuilderStore.currentStep < totalSteps) {
			updateCurrentStep($resumeBuilderStore.currentStep + 1);
		}
	}

	function previousStep() {
		if ($resumeBuilderStore.currentStep > 1) {
			updateCurrentStep($resumeBuilderStore.currentStep - 1);
		}
	}
</script>

<div class="h-screen w-full bg-[#E0E6E9]">
	<div class="mx-auto flex h-full flex-col">
		<div class="relative">
			<div class="z-50 p-[48px]">
				<h2 class="text-[48px] font-[600]">{title}</h2>
				<p class="text-[24px] font-[500] text-[#828BA2]">
					{subtitle}
				</p>
			</div>
			<!-- Your existing SVG icon -->
		</div>

		<!-- Form Section -->
		<main class="relative h-screen">
			<div
				class="flex h-full flex-col justify-between gap-[12px] rounded-t-[56px] bg-[#022F49] p-[24px] text-white sm:p-[40px]"
			>
				{@render children()}

				<!-- Navigation Buttons -->
				<div
					class={$resumeBuilderStore.currentStep === 4 ||
					$resumeBuilderStore.currentStep === 5 ||
					$resumeBuilderStore.currentStep === 6 ||
					$resumeBuilderStore.currentStep === 7 ||
					$resumeBuilderStore.currentStep === 8
						? 'hidden'
						: 'mt-4 flex justify-between'}
				>
					<button
						class="rounded-b-[8px] rounded-t-[8px] rounded-br-[20px] border bg-transparent px-[18px] py-[9px] text-[14px] font-medium text-accent {$resumeBuilderStore.currentStep ===
						1
							? 'invisible'
							: ''} disabled:opacity-50"
						onclick={previousStep}
						disabled={$resumeBuilderStore.currentStep === 1}
					>
						Back
					</button>
					<button
						type="button"
						class="rounded-b-[8px] rounded-t-[8px] rounded-br-[20px] bg-accent px-[18px] py-[9px] text-[12px] font-medium text-[#022F49]"
						onclick={nextStep}
						disabled={$resumeBuilderStore.currentStep === totalSteps}
					>
						{$resumeBuilderStore.currentStep === totalSteps ? 'Finish' : 'Continue'}
					</button>
				</div>
			</div>
		</main>
	</div>
</div>
