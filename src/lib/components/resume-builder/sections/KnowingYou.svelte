<script>
	import Input from '$lib/components/elements/Input.svelte';
	import ZigzagButton from '$lib/components/ZigzagButton.svelte';
	import { showLoader, hideLoader } from '$lib/stores/loader';
	import { SVG } from '$lib/utils/svgs';
	import { onMount } from 'svelte';
	import { API_END_POINT } from '../../../services/END_POINT';

	import {
		resumeBuilderStore,
		updateCurrentStep,
		updateStepData,
		markStepComplete,
		updateAnswer,
		setNavigationDirection,
		questionsStore
	} from '$lib/stores/resumeBuilder';
	import { navigationDirection } from '$lib/stores/resumeBuilder';
	import { derived } from 'svelte/store';

	let achievementsList = $state([]);
	let educationList = $state([]);
	let experiencesList = $state([]);
	let showSkipConfirmation = $state(false);
	let answer = $state('');

	let questionsAndAnswers = $state([]);

	$effect(() => {
		answer = $resumeBuilderStore?.formData?.questionAnswers[1]?.answer || '';
		questionsAndAnswers = $resumeBuilderStore?.formData?.questionAnswers || [];
	});

	function handleBack() {
		updateCurrentStep($resumeBuilderStore.currentStep - 1);
		setNavigationDirection('backward');
	}

	function handleNext() {
		setNavigationDirection('forward');
		updateCurrentStep($resumeBuilderStore.currentStep + 1);

		// Check if the question already exists in questionAnswers
		const existingAnswerIndex = $resumeBuilderStore.formData.questionAnswers.findIndex(
			(qa) => qa.question === $questionsStore[0]
		);

		if (existingAnswerIndex !== -1) {
			// Update the existing answer
			questionsAndAnswers[existingAnswerIndex].answer = answer;
		} else {
			// Add a new question-answer pair
			updateStepData('questionAnswers', [{ question: $questionsStore[0], answer: answer }]);
		}
	}

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

	$effect(() => {
		achievementsList = $resumeBuilderStore?.formData?.achievements || [];
		educationList = $resumeBuilderStore?.formData?.education || [];
		experiencesList = $resumeBuilderStore?.formData?.experience || [];
		answer = $resumeBuilderStore?.formData?.questionAnswers[0]?.answer || '';
	});

	// Function to send achievement data to API
	async function sendAchievementData() {
		try {
			const achievementData = {
				type: 'achievements',
				data: achievementsList.map((achievement) => ({
					issuing_body: achievement.issuingBody,
					course_name: achievement.title,
					desc: achievement.description || ''
				}))
			};

			const token = localStorage.getItem('token');

			if (!token) {
				throw new Error('Authentication token not found');
			}

			const response = await fetch(`${API_END_POINT}/resume/create`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				},
				body: JSON.stringify(achievementData)
			});

			if (!response.ok) {
				throw new Error(`Failed to send achievement data: ${response.statusText}`);
			}

			const result = await response.json();
		} catch (error) {
			console.error('Error sending achievement data:', error);
		}
	}

	async function generateQuestions() {
		$resumeBuilderStore.formData.questionAnswers = [];
		try {
			showLoader('Generating Questions...');
			const resumeData = {
				education: (educationList || []).map((edu) => ({
					college_name: edu.collegeName,
					start_year: edu.startYear,
					end_year: edu.endYear,
					currently_studying: edu.currentlyStudying,
					cgpa: parseInt(edu.cgpa),
					course: edu.course
				})),
				achievements: (achievementsList || []).map((achievement) => ({
					issuing_body: achievement.issuingBody,
					course_name: achievement.title,
					desc: achievement.description || ''
				})),
				experiences: (experiencesList || []).map((exp) => ({
					company_name: exp.companyName,
					startDate: exp.startDate,
					endDate: exp.endDate,
					currently_working: exp.currentlyWorking,
					description: exp.description || '',
					location: exp.location,
					job_type: exp.jobType,
					job_title: exp.jobTitle
				}))
			};

			const token = localStorage.getItem('token');

			if (!token) {
				throw new Error('Authentication token not found');
			}

			const response = await fetch(`${API_END_POINT}/chatGpt/generate-questions`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				},
				body: JSON.stringify(resumeData)
			});

			if (!response.ok) {
				throw new Error(`Failed to send resume data: ${response.statusText}`);
			}

			const result = await response.json();
			console.log('Resume data sent successfully:', result);

			// Ensure questionsStore is updated with the response
			if (result.questions && result.questions.length > 0) {
				const cleanedQuestions = result.questions.map((question) =>
					question.trim().replace(/^,/, '')
				);
				questionsStore.set(cleanedQuestions);
			} else {
				console.error('No questions received from the API');
			}
		} catch (error) {
			console.error('Error sending resume data:', error);
		} finally {
			hideLoader();
		}
	}

	onMount(() => {
		if ($navigationDirection === 'forward') {
			sendAchievementData();
			generateQuestions();
		}
	});
</script>

<div class="flex h-full flex-col gap-6">
	<div class="flex h-full flex-col justify-between">
		{#key $questionsStore}
			<div class="flex flex-col gap-[16px]">
				<div class="flex items-start gap-[12px]">
					<span>
						<span class="text-[24px] font-normal">1</span>/<span class="text-[14px] font-normal"
							>{$questionsStore.length}</span
						>
					</span>
					<h2 class="text-[18px] font-[500] sm:text-[24px] sm:font-[600]">
						{$questionsStore[0]} ?
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
