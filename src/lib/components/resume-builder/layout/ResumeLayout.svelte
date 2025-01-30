<script>
	import {
		resumeBuilderStore,
		updateCurrentStep,
		setNavigationDirection,
		bioPopupStore
	} from '$lib/stores/resumeBuilder';
	import { showLoader, hideLoader } from '$lib/stores/loader';
	import BioPopup from '$lib/components/BioPopup.svelte';

	let { title = '', subtitle = '', totalSteps = 10, children } = $props();

	// Calculate progress percentage
	let progress = $derived(($resumeBuilderStore.currentStep / 10) * 100);

	function nextStep() {
		if ($resumeBuilderStore.currentStep < totalSteps) {
			setNavigationDirection('forward');
			// updatePageProgress($resumeBuilderStore.currentStep);
			updateCurrentStep($resumeBuilderStore.currentStep + 1);
		}
		if ($resumeBuilderStore.currentStep === totalSteps) {
			$bioPopupStore = true;
		}
	}

	function previousStep() {
		if ($resumeBuilderStore.currentStep > 1) {
			setNavigationDirection('backward');
			// updatePageProgress($resumeBuilderStore.currentStep);
			updateCurrentStep($resumeBuilderStore.currentStep - 1);
		}
	}
</script>

<div class="h-screen w-full bg-[#E0E6E9]">
	<div class="mx-auto flex h-full flex-col">
		<div class="relative">
			<div class="z-50 px-[16px] py-[25px] sm:p-[38px]">
				<h2 class="text-[24px] font-[700] sm:text-[48px] sm:font-[600]">{title}</h2>
				<p class="text-[18px] font-[600] text-[#828BA2] sm:text-[24px] sm:font-[500]">
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
				<div class="w-full">
					<span class="mx-2">Step {$resumeBuilderStore.currentStep}: Resume Basics</span>

					<div class="flex items-center justify-between text-sm text-gray-400">
						<div class="mx-2 h-2 flex-1 overflow-hidden rounded-full bg-[#F1F1F10F]">
							<div
								class="h-full bg-[#828BA2] transition-all duration-300"
								style="width: {progress}%;"
							></div>
						</div>
						<span>{progress.toFixed(0)}%</span>
					</div>
				</div>
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
					>
						Continue
					</button>
				</div>
			</div>
		</main>
	</div>
</div>
