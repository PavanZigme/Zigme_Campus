<script>
	import Input from '$lib/components/elements/Input.svelte';
	import BuilderButton from '../ui/BuilderButton.svelte';
	import { resumeBuilderStore, updateStepData, markStepComplete } from '$lib/stores/resumeBuilder';
	import { SVG } from '$lib/utils/svgs';

	let isEditing = $state(false);
	let editingIndex = $state(-1);
	let achievementsList = $state([]);

	let currentAchievement = $state({
		title: '',
		issuingBody: '',
		description: ''
	});

	let commonError = $state('');

	// Initialize from store
	$effect(() => {
		achievementsList = $resumeBuilderStore.formData.achievements;
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
</script>

<div class="">
	<div class="grid max-h-[calc(100vh-350px)] grid-cols-3 gap-[36px] overflow-y-auto">
		<div class="col-span-2">
			<div class="flex w-full justify-between gap-[10px]">
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
				<Input
					label="Description"
					required={true}
					type="textarea"
					placeholder="Eg. Managed social media accounts, increasing engagement by 35% through targeted campaigns."
					bind:value={currentAchievement.description}
				/>

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

		<div class="col-span-1">
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
