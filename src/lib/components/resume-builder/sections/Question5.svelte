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

	let answer = $state($questionsStore[4]?.answer ?? '');
	let showLoadingPopup = $state(false);

	const question = $derived({
		question:
			$resumeBuilderStore.formData?.knowingYou?.questions?.[4]?.question ??
			"What's your biggest professional achievement?",
		placeholder:
			$resumeBuilderStore.formData?.knowingYou?.questions?.[4]?.placeholder ??
			'Eg. Successfully launched a product that increased company revenue by 25%...'
	});

	function handleBack() {
		updateCurrentStep($resumeBuilderStore.currentStep - 1);
	}

	function handleNext() {
		showLoadingPopup = true;
		setTimeout(() => {
			updateCurrentStep($resumeBuilderStore.currentStep + 1);
		}, 5000); // 5000 milliseconds = 5 seconds
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
		{#key $questionsStore}
			<div>
				<h2 class="mb-4 text-xl">{$questionsStore[4]}</h2>

				<textarea
					class="h-32 w-full resize-none rounded-[12px] bg-[#F1F1F10F] p-3 text-white placeholder-[#828BA2]"
					placeholder="type here"
					bind:value={answer}
				></textarea>
			</div>
		{/key}

		<div class="flex justify-between">
			<button
				class="rounded-b-[8px] rounded-t-[8px] rounded-br-[20px] border bg-transparent px-[18px] py-[9px] text-[14px] font-medium text-accent"
				onclick={handleBack}
			>
				Back
			</button>
			<div class="flex gap-[1rem]">
				<button onclick={handleNext}>
					{@html SVG.zigme_cta}
				</button>
			</div>
		</div>
	</div>
</div>

{#if showLoadingPopup}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
		<div
			class="flex max-w-[800px] flex-col gap-[25px] rounded-[36px] bg-white p-8 px-8 text-center sm:p-0"
		>
			<div>
				<div class="mb-4 flex justify-center">
					{@html SVG.Abstract_Loading}
				</div>
				<h2 class="mb-2 text-[34px] font-semibold text-[#022F49]">
					Analyzing Your Unique Traits...
				</h2>
				<p class="text-[20px] font-medium text-[#6B7280]">
					We're connecting the dots between your experiences and strengths. Your personalized skill
					set is loading—get ready to see how you shine!
				</p>
			</div>
			<div class="flex w-full justify-end px-4">
				<div class="mt-4 text-[24px] font-medium text-[#F28212]">
					Scanning for problem-solving mastery...
				</div>
				<div class="hidden sm:block">
					{@html SVG.fun_3D_cartoon}
				</div>
			</div>
		</div>
	</div>
{/if}
