<script>
	import Input from '$lib/components/elements/Input.svelte';
	import BuilderButton from '../ui/BuilderButton.svelte';
	import { resumeBuilderStore, updateStepData, markStepComplete } from '$lib/stores/resumeBuilder';
	import { SVG } from '$lib/utils/svgs';
	import { onMount } from 'svelte';
	import { navigationDirection } from '$lib/stores/resumeBuilder';

	let isEditing = $state(false);
	let editingIndex = $state(-1);
	let achievementsList = $state([]);
	let experienceList = $state([]);

	let currentAchievement = $state({
		title: '',
		issuingBody: '',
		description: ''
	});

	let commonError = $state('');

	// Initialize from store
	$effect(() => {
		achievementsList = $resumeBuilderStore.formData.achievements;
		experienceList = $resumeBuilderStore.formData.experience;
	});

	// Update store whenever achievementsList changes
	$effect(() => {
		updateStepData('achievements', achievementsList);
		markStepComplete('achievements', achievementsList.length > 0);
	});

	function resetForm() {
		currentAchievement = {
			title: '',
			issuingBody: '',
			description: ''
		};
		commonError = '';
		isEditing = false;
		editingIndex = -1;
	}

	function validateForm() {
		commonError = '';
		const requiredFields = ['title', 'issuingBody', 'description'];

		for (const field of requiredFields) {
			if (!currentAchievement[field]) {
				commonError = 'Please fill in all required fields';
				return false;
			}
		}
		return true;
	}

	function addAchievement() {
		if (!validateForm()) return;

		if (isEditing) {
			achievementsList[editingIndex] = { ...currentAchievement };
		} else {
			achievementsList = [...achievementsList, { ...currentAchievement }];
		}

		resetForm();
	}

	function editAchievement(index) {
		isEditing = true;
		editingIndex = index;
		currentAchievement = { ...achievementsList[index] };
	}

	function removeAchievement(index) {
		achievementsList = achievementsList.filter((_, i) => i !== index);
	}

	function formatDate(date) {
		if (!date) return '';
		if (typeof date === 'string') {
			if (/^\d{2}\/\d{2}\/\d{4}$/.test(date)) return date;
			date = new Date(date);
		}
		if (!(date instanceof Date) || isNaN(date)) return '';

		const day = date.getDate().toString().padStart(2, '0');
		const month = (date.getMonth() + 1).toString().padStart(2, '0');
		const year = date.getFullYear();

		return `${day}/${month}/${year}`;
	}

	// Add this function to handle the API call
	async function sendExperienceData() {
		try {
			const experienceData = {
				type: 'experiences',
				data: experienceList.map((exp) => ({
					company_name: exp.companyName,
					startDate: formatDateForAPI(exp.startDate),
					endDate: exp.currentlyWorking ? null : formatDateForAPI(exp.endDate),
					currently_working: exp.currentlyWorking || false,
					description: exp.description || '',
					location: exp.location[0] || '',
					job_type: exp.jobType?.toLowerCase() || '',
					job_title: exp.jobTitle || ''
				}))
			};

			const token = localStorage.getItem('token');

			if (!token) {
				throw new Error('Authentication token not found');
			}

			const response = await fetch(
				'http://ec2-13-61-151-83.eu-north-1.compute.amazonaws.com:4000/api/v1/resume/create',
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`
					},
					body: JSON.stringify(experienceData)
				}
			);

			if (!response.ok) {
				throw new Error(`Failed to send experience data: ${response.statusText}`);
			}

			const result = await response.json();
			console.log('Experience data sent successfully:', result);
		} catch (error) {
			console.error('Error sending experience data:', error);
		}
	}

	function formatDateForAPI(dateString) {
		if (!dateString) return null;

		// Convert from DD/MM/YYYY to YYYY-MM-DD
		const [day, month, year] = dateString.split('/');
		return `${year}-${month}-${day}`;
	}

	onMount(() => {
		if ($navigationDirection === 'forward') {
			sendExperienceData();
		}
	});

	async function GenerateDescription() {
		try {
			let variables = {
				issuing_body: currentAchievement.issuingBody,
				course_name: currentAchievement.title
			};

			// Get the JWT token from localStorage or your auth store
			const token = localStorage.getItem('token');

			if (!token) {
				throw new Error('Authentication token not found');
			}

			const response = await fetch(
				'http://ec2-13-61-151-83.eu-north-1.compute.amazonaws.com:4000/api/v1/chatGpt/generate-description?type=achievements',
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						...(token && { Authorization: `Bearer ${token}` })
					},
					body: JSON.stringify(variables)
				}
			);

			if (!response.ok) {
				throw new Error(`Failed to send experience data: ${response.statusText}`);
			}

			const result = await response.json();
			currentAchievement.description = result.data;
			console.log('Experience data sent successfully:', result);
		} catch (error) {
			console.error('Error sending experience data:', error);
		}
	}
</script>

<div class="">
	<div
		class="flex max-h-[calc(100vh-230px)] w-full flex-col gap-[36px] overflow-y-auto sm:h-full sm:flex-row sm:px-2"
	>
		<div class="h-full w-full sm:w-[70%]">
			<div class="flex w-full flex-col justify-between gap-[10px] sm:flex-row">
				<div class="w-full">
					<Input
						label="Achievement"
						required={true}
						placeholder="Eg. Hackathon Winner"
						bind:value={currentAchievement.title}
					/>
				</div>
				<div class="w-full">
					<Input
						label="Issuing Body"
						required={true}
						placeholder="Eg. Future Innovators Council"
						bind:value={currentAchievement.issuingBody}
					/>
				</div>
			</div>

			<div class="flex w-full flex-col justify-between gap-[10px]">
				<div class="">
					<div class="flex justify-between">
						<label for="description" class="mb-[6px] text-sm text-slate-200">
							Description <span class="text-red-500">*</span>
						</label>
						<button class="" onclick={GenerateDescription}> Generate</button>
					</div>
					<textarea
						id="description"
						placeholder="Enter description"
						bind:value={currentAchievement.description}
						class="h-32 w-full resize-none rounded-[12px] bg-[#F1F1F10F] p-3 text-white placeholder-[#828BA2]"
					></textarea>
				</div>

				<div class="flex justify-between">
					<div class={commonError ? '' : 'invisible'}>
						<p class="text-sm font-medium text-red-500">{commonError}</p>
					</div>
				</div>
			</div>

			<div class="mt-4 flex items-center gap-4">
				<div class="flex items-center gap-[0.5rem]">
					<button
						type="button"
						class="rounded-b-[8px] rounded-t-[8px] rounded-br-[20px] bg-accent px-[22px] py-[11px] text-[12px] font-medium text-[#022F49]"
						onclick={addAchievement}
					>
						{isEditing ? 'Save' : '+ Add'}
					</button>
				</div>
			</div>
		</div>

		<div class="w-full sm:max-h-[calc(100vh-350px)] sm:w-[30%] sm:overflow-y-auto sm:px-2">
			{#each achievementsList as achievement, index}
				<div class="mb-4 rounded-[20px] bg-[#F1F1F10F] p-4">
					<div class="mb-2 flex items-start justify-between">
						<div>
							<h3 class="text-[14px] font-[600] text-white">{achievement.title}</h3>
							<p class="text-[14px] font-normal text-[#828BA2]">{achievement.issuingBody}</p>
						</div>

						<div class="flex gap-2">
							<BuilderButton variant="icon" onclick={() => editAchievement(index)}>
								{@html SVG.edit_Icon}
							</BuilderButton>
							<BuilderButton variant="icon" onclick={() => removeAchievement(index)}>
								{@html SVG.delete_Icon}
							</BuilderButton>
						</div>
					</div>
					{#if achievement.description}
						<p class="mt-2 text-[12px] text-[#D1D1D1]">{achievement.description}</p>
					{/if}
				</div>
			{/each}
		</div>
	</div>
</div>
