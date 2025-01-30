<script>
	import Input from '$lib/components/elements/Input.svelte';
	import ZigzagButton from '$lib/components/ZigzagButton.svelte';

	import { SVG } from '$lib/utils/svgs';
	import {
		resumeBuilderStore,
		updateCurrentStep,
		updateStepData,
		markStepComplete,
		questionsStore,
		updateAnswer,
		setNavigationDirection
	} from '$lib/stores/resumeBuilder';
	import { API_END_POINT } from '../../../services/END_POINT';

	let answer = $state('');
	let showLoadingPopup = $state(false);
	let questionsAndAnswers = $state([]);

	$effect(() => {
		answer = $resumeBuilderStore?.formData?.questionAnswers[4]?.answer || '';
		questionsAndAnswers = $resumeBuilderStore?.formData?.questionAnswers || [];
	});

	function handleNext() {
		setNavigationDirection('forward');
		showLoadingPopup = true;

		// Check if the question already exists in questionAnswers
		const existingAnswerIndex = questionsAndAnswers.findIndex(
			(qa) => qa.question === $questionsStore[4]
		);

		if (existingAnswerIndex !== -1) {
			// Update the existing answer, even if it's empty
			questionsAndAnswers[existingAnswerIndex].answer = answer;
		} else {
			// Add a new question-answer pair
			// questionsAndAnswers.push({ question: $questionsStore[4], answer: answer });
			questionsAndAnswers = [
				...questionsAndAnswers,
				{ question: $questionsStore[4], answer: answer }
			];
		}

		// Update the store with the modified questionsAndAnswers array
		updateStepData('questionAnswers', questionsAndAnswers);

		setTimeout(() => {
			updateCurrentStep($resumeBuilderStore.currentStep + 1);
			sendQuestionData();
		}, 3000);
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

	async function sendQuestionData() {
		try {
			const questionData = {
				type: 'questions',
				data: questionsAndAnswers.map((qa) => ({
					question: qa.question,
					answer: qa.answer || ''
				}))
			};

			const token = localStorage.getItem('token');

			if (!token) {
				throw new Error('Authentication token not found');
			}

			const response = await fetch(
				`${API_END_POINT}/resume/create`, // Adjust the endpoint if necessary
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`
					},
					body: JSON.stringify(questionData)
				}
			);

			if (!response.ok) {
				throw new Error(`Failed to send question data: ${response.statusText}`);
			}

			const result = await response.json();
		} catch (error) {
			console.error('Error sending question data:', error);
		}
	}
</script>

<div class="flex h-full flex-col gap-6">
	<div class="flex h-full flex-col justify-between">
		{#key $questionsStore}
			<div class="flex flex-col gap-[16px]">
				<div class="flex items-start gap-[12px]">
					<span>
						<span class="text-[24px] font-normal">5</span>/<span class="text-[14px] font-normal"
							>{$questionsStore.length}</span
						>
					</span>
					<h2 class="text-[18px] font-[500] sm:text-[24px] sm:font-[600]">
						{$questionsStore[4]} ?
					</h2>
				</div>

				<textarea
					class="h-32 w-full resize-none rounded-[12px] bg-[#F1F1F10F] p-3 text-white placeholder-[#828BA2]"
					placeholder="describe your answer"
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
			class="mx-[30px] flex max-w-[800px] flex-col gap-[25px] rounded-[36px] bg-white p-8 px-8 text-center sm:p-0"
		>
			<div>
				<div class="mb-4 flex justify-center">
					{@html SVG.Abstract_Loading}
				</div>
				<h2 class="mb-2 text-[18px] font-[700] text-[#022F49] sm:text-[34px]">
					Analyzing Your Unique Traits...
				</h2>
				<p class=" text-[12px] font-medium text-[#6B7280] sm:text-[20px]">
					We're connecting the dots between your experiences and strengths. Your personalized skill
					set is loading—get ready to see how you shine!
				</p>
			</div>
			<div class="flex w-full justify-center px-4">
				<div class="mt-4 text-center text-[14px] font-medium text-[#F28212] sm:text-[24px]">
					Scanning for problem-solving mastery...
				</div>
				<div class="hidden sm:block">
					{@html SVG.fun_3D_cartoon}
				</div>
			</div>
		</div>
	</div>
{/if}
