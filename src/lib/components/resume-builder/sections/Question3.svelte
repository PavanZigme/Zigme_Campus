<script>
	import Input from '$lib/components/elements/Input.svelte';
	import ZigzagButton from '$lib/components/ZigzagButton.svelte';

	import { SVG } from '$lib/utils/svgs';
	import { onMount } from 'svelte';
	import {
		resumeBuilderStore,
		updateCurrentStep,
		updateStepData,
		markStepComplete,
		questionsStore,
		updateAnswer
	} from '$lib/stores/resumeBuilder';

	let answer = $state('');
	let showLoadingPopup = $state(false);
	let questionsAndAnswers = $state([]);

	$effect(() => {
		answer = $resumeBuilderStore?.formData?.questionAnswers[2]?.answer || '';
		questionsAndAnswers = $resumeBuilderStore?.formData?.questionAnswers || [];
	});

	function handleNext() {
		updateCurrentStep($resumeBuilderStore.currentStep + 1);
		updateStepData('questionAnswers', [
			...questionsAndAnswers,
			{ question: $questionsStore[2], answer: answer }
		]);
	}

	function handleBack() {
		updateCurrentStep($resumeBuilderStore.currentStep - 1);
	}

	let showSkipConfirmation = $state(false);

	function handleSkipClick() {
		showSkipConfirmation = true;
	}

	function confirmSkip() {
		showSkipConfirmation = false;
		answer = '';
		handleNext();
	}

	function cancelSkip() {
		showSkipConfirmation = false;
	}
</script>

<div class="flex h-full flex-col gap-6">
	<div class="flex h-full flex-col justify-between">
		<div>
			{#key $questionsStore}
				<div class="flex flex-col gap-[16px]">
					<div class="flex items-start gap-[12px]">
						<span>
							<span class="text-[24px] font-normal">3</span>/<span class="text-[14px] font-normal"
								>{$questionsStore.length}</span
							>
						</span>
						<h2 class="text-[18px] font-[500] sm:text-[24px] sm:font-[600]">
							{$questionsStore[2]} ?
						</h2>
					</div>

					<textarea
						class="h-32 w-full resize-none rounded-[12px] bg-[#F1F1F10F] p-3 text-white placeholder-[#828BA2]"
						placeholder="describe your answer"
						bind:value={answer}
					></textarea>
				</div>
			{/key}
		</div>

		<div class="flex justify-between">
			<button
				class="rounded-b-[8px] rounded-t-[8px] rounded-br-[20px] border bg-transparent px-[18px] py-[9px] text-[14px] font-medium text-accent"
				onclick={handleBack}
			>
				Back
			</button>
			<div class="flex gap-[1rem]">
				<button class="text-[14px] font-medium text-white" onclick={handleSkipClick}>
					Skip Question
				</button>

				<button
					class="rounded-b-[8px] rounded-t-[8px] rounded-br-[20px] bg-accent px-[18px] py-[9px] text-[12px] font-medium text-[#022F49]"
					onclick={handleNext}
				>
					Continue
				</button>
			</div>
		</div>
	</div>
</div>
{#if showSkipConfirmation}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
		<div
			class="flex max-w-[800px] flex-col gap-[16px] rounded-[36px] bg-white px-[29px] py-[24px] text-center"
		>
			<h2 class="text-[28px] font-[600] text-[#022F49]">
				Your answers help us craft a resume that truly represents you!
			</h2>
			<p class="text-[20px] font-medium text-[#828BA2]">
				highlight key details that employers look for.
			</p>
			<div class="mt-[25px] flex justify-center gap-4">
				<button
					class="bg-trasparent rounded-[10px] rounded-tr-[24px] border border-[#022F49] px-[22px] py-[13px] text-[14px] font-medium text-[#344054]"
					onclick={confirmSkip}
				>
					Skip Anyway
				</button>
				<button
					class="rounded-[10px] rounded-tr-[24px] bg-[#022F49] px-[22px] py-[13px] text-[14px] font-medium text-white"
					onclick={cancelSkip}
				>
					Continue Filling
				</button>
			</div>
		</div>
	</div>
{/if}
