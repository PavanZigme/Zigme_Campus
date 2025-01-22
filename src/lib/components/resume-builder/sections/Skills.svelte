<script>
	import Input from '$lib/components/elements/Input.svelte';
	import Dropdown from '$lib/components/elements/Dropdown.svelte';
	import { resumeBuilderStore, updateStepData, markStepComplete } from '$lib/stores/resumeBuilder';
	import MultiSelectDropdown from '$lib/components/elements/MultiSelectDropdown.svelte';
	import { SVG } from '$lib/utils/svgs';

	let formData = $state({
		languages: [],
		skills: [],
		supportingStatement: '',
		selectedSkill: 'None'
	});

	let skillCategories = $state([
		{
			title: 'Communication',
			description:
				'Presented research findings to peers and professors with clarity and confidence.'
		},
		{
			title: 'Leadership',
			description:
				'Presented research findings to peers and professors with clarity and confidence.'
		},
		{
			title: 'Problem-Solving',
			description:
				'Presented research findings to peers and professors with clarity and confidence.'
		},
		{
			title: 'Leadership',
			description:
				'Presented research findings to peers and professors with clarity and confidence.'
		}
	]);

	let activePopupIndex = $state(null);
	let editingIndex = $state(null);

	// Subscribe to store and initialize data
	$effect(() => {
		skillCategories = $resumeBuilderStore.formData.skills;
	});

	// Update store whenever skillsList changes
	$effect(() => {
		updateStepData('skills', skillCategories);
		// Mark step as complete if there's at least one skill entry
		markStepComplete('skills', skillCategories.length > 0);
	});

	function togglePopup(index) {
		activePopupIndex = activePopupIndex === index ? null : index;
	}

	function deleteSkill(index) {
		skillCategories = skillCategories.filter((_, i) => i !== index);
		activePopupIndex = null;
	}

	function editSkill(index) {
		// Populate form with existing data
		formData.skills = [skillCategories[index].title];
		formData.supportingStatement = skillCategories[index].description;
		editingIndex = index;
		activePopupIndex = null;
	}

	function addSkillCategory() {
		if (!formData.skills.length || !formData.supportingStatement) {
			return;
		}

		const newSkill = {
			title: formData.skills[0],
			description: formData.supportingStatement
		};

		if (editingIndex !== null) {
			// Update existing skill
			skillCategories = skillCategories.map((skill, index) =>
				index === editingIndex ? newSkill : skill
			);
			editingIndex = null;
		} else {
			// Add new skill
			skillCategories = [...skillCategories, newSkill];
		}

		// Reset form fields
		formData.skills = [];
		formData.supportingStatement = '';
	}

	// When adding a skill
	// function addSkill() {
	// 	if (!validateForm()) return;

	// 	if (editingIndex !== null) {
	// 		skillCategories = skillCategories.map((skill, index) =>
	// 			index === editingIndex ? { ...skillCategories[editingIndex] } : skill
	// 		);
	// 	} else {
	// 		skillCategories = [...skillCategories, { ...skillCategories[editingIndex] }];
	// 	}

	// 	resetForm();
	// }

	// // When removing a skill
	// function removeSkill(index) {
	// 	skillCategories = skillCategories.filter((_, i) => i !== index);
	// }

	// function resetForm() {
	// 	formData.skills = [];
	// 	formData.supportingStatement = '';
	// 	editingIndex = null;
	// 	activePopupIndex = null;
	// }

	// function validateForm() {
	// 	// Implement your validation logic here
	// 	return true; // Placeholder return, actual implementation needed
	// }
</script>

<!-- max-h-[calc(100vh-350px)] overflow-y-auto -->

<div class="h-full w-full">
	<MultiSelectDropdown
		options={['English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese']}
		placeholder="Select languages"
		bind:value={formData.languages}
		label="Languages"
	/>
	<div class="border border-b border-[#F1F1F133]"></div>
	<div class="mt-[20px] flex w-full gap-[30px]">
		<div class="w-[50%]">
			<div>
				<MultiSelectDropdown
					options={['JavaScript', 'Python', 'React', 'Node.js', 'SQL', 'TypeScript', 'Svelte']}
					placeholder="Select skills"
					bind:value={formData.skills}
					isMultiSelect={false}
					label="Skills"
				/>
			</div>
			<div>
				<Input
					label="Supporting Statement"
					required={true}
					placeholder="Eg. Designed unique promotional posters that boosted event attendance."
					bind:value={formData.supportingStatement}
				/>
			</div>
			<button
				onclick={addSkillCategory}
				class="rounded-b-[8px] rounded-t-[8px] rounded-br-[20px] bg-accent px-[22px] py-[9px] text-[12px] font-medium text-[#022F49]"
				disabled={!formData.skills.length || !formData.supportingStatement}
			>
				<span>{editingIndex !== null ? 'Save' : '+ Add'}</span>
			</button>
		</div>
		<!-- max-h-[calc(100vh-350px)] overflow-y-auto -->
		<div class="grid h-full w-[50%] grid-cols-2 gap-[0.5rem]">
			{#each skillCategories as category, index}
				<div class="relative rounded-[12px] bg-[#F1F1F10F] p-[8px]">
					<div class="mb-[4px] flex items-center justify-between">
						<div class="flex items-center">
							<button class="cursor-pointer p-1" onclick={() => togglePopup(index)}>
								{@html SVG.more_SVG}
							</button>
							<h3 class="text-[12px] font-normal text-white">{category.title}</h3>
						</div>
						{#if activePopupIndex === index}
							<div
								class="absolute left-0 top-[35px] z-10 rounded-lg bg-white/10 p-1 backdrop-blur-sm"
								role="menu"
								tabindex="0"
								onmouseleave={() => togglePopup(null)}
							>
								<button
									class="flex w-full items-center gap-2 rounded px-3 py-2 text-left text-sm text-white hover:bg-white/10"
									onclick={() => editSkill(index)}
								>
									{@html SVG.edit_Icon}
									Edit
								</button>
								<button
									class="flex w-full items-center gap-2 rounded px-3 py-2 text-left text-sm text-white hover:bg-white/10"
									onclick={() => deleteSkill(index)}
								>
									{@html SVG.delete_Icon}
									Delete
								</button>
							</div>
						{/if}
					</div>
					<p class="text-[12px] font-normal text-[#828BA2]">{category.description}</p>
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	/* Optional: Add transition for smooth popup appearance */
	div[class*='absolute'] {
		animation: fadeIn 0.2s ease-out;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: scale(0.95);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
	}
</style>
