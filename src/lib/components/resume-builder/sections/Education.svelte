<script>
	import Input from '$lib/components/elements/Input.svelte';
	import Dropdown from '$lib/components/elements/Dropdown.svelte';
	import BuilderButton from '../ui/BuilderButton.svelte';
	import Datepicker from '$lib/components/elements/DatePicker/Datepicker.svelte';
	import { resumeBuilderStore, updateStepData, markStepComplete } from '$lib/stores/resumeBuilder';
	import { SVG } from '$lib/utils/svgs';

	let courses = ['BTech - Computer Science', 'BTech - IT', 'BSc - CS'];
	let isEditing = $state(false);
	let editingIndex = $state(-1);

	let educationList = $state([]);

	// Subscribe to store and initialize data
	$effect(() => {
		educationList = $resumeBuilderStore.formData.education;
	});

	// Update store whenever educationList changes
	$effect(() => {
		updateStepData('education', educationList);
		// Mark step as complete if there's at least one education entry
		markStepComplete('education', educationList.length > 0);
	});

	let currentEducation = $state({
		college: '',
		course: '',
		cgpa: '',
		startDate: '',
		endDate: '',
		isCurrentlyStudying: false
	});

	let commonError = $state('');

	function resetForm() {
		currentEducation = {
			college: '',
			course: '',
			cgpa: '',
			startDate: '',
			endDate: '',
			isCurrentlyStudying: false
		};
		commonError = '';
		isEditing = false;
		editingIndex = -1;
	}

	function handleCurrentlyStudyingChange(event) {
		currentEducation.isCurrentlyStudying = event.target.checked;
		if (currentEducation.isCurrentlyStudying) {
			const today = new Date();
			currentEducation.endDate = formatDate(today);
		} else {
			currentEducation.endDate = '';
		}
	}

	function validateForm() {
		commonError = '';

		if (!currentEducation.college.trim()) {
			commonError = 'Please fill in all required fields';
			return false;
		}
		if (!currentEducation.course) {
			commonError = 'Please fill in all required fields';
			return false;
		}
		// if (!currentEducation.cgpa.trim()) {
		// 	commonError = 'Please fill in all required fields';
		// 	return false;
		// }
		if (!currentEducation.startDate) {
			commonError = 'Please fill in all required fields';
			return false;
		}
		if (!currentEducation.isCurrentlyStudying && !currentEducation.endDate) {
			commonError = 'Please fill in all required fields';
			return false;
		}

		return true;
	}

	function addEducation() {
		if (!validateForm()) return;

		if (isEditing) {
			educationList[editingIndex] = { ...currentEducation };
		} else {
			educationList = [...educationList, { ...currentEducation }];
		}

		resetForm();
	}

	function editEducation(index) {
		isEditing = true;
		editingIndex = index;
		currentEducation = { ...educationList[index] };
	}

	function removeEducation(index) {
		educationList = educationList.filter((_, i) => i !== index);
	}

	function formatDate(date) {
		if (!date) return '';
		if (typeof date === 'string') {
			// If date is already in DD/MM/YYYY format, return as is
			if (/^\d{2}\/\d{2}\/\d{4}$/.test(date)) return date;
			date = new Date(date);
		}
		if (!(date instanceof Date) || isNaN(date)) return '';

		const day = date.getDate().toString().padStart(2, '0');
		const month = (date.getMonth() + 1).toString().padStart(2, '0');
		const year = date.getFullYear();

		return `${day}/${month}/${year}`;
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
						label="College"
						required={true}
						placeholder="Enter College"
						bind:value={currentEducation.college}
					/>
				</div>
				<div class="w-full">
					<Dropdown
						label="Course"
						required={true}
						name="course"
						placeholder="Select Course"
						options={courses}
						value={currentEducation.course}
						onSelect={(selected) => {
							currentEducation.course = selected;
						}}
					/>
				</div>
				<div class="w-full">
					<Input
						label="CGPA"
						required={false}
						placeholder="Enter CGPA"
						bind:value={currentEducation.cgpa}
					/>
				</div>
			</div>
			<div class="flex w-full flex-col justify-between gap-[10px]">
				<div class="flex w-full flex-col justify-between gap-[10px] sm:flex-row">
					<div class="w-full">
						<label for="startDate" class="mb-[6px] text-sm text-slate-200">
							Start <span class="text-red-500">*</span>
						</label>
						<Datepicker
							id="startDate"
							name="startDate"
							value={currentEducation.startDate}
							onDateChange={(date) => {
								currentEducation.startDate = date;
							}}
						/>
					</div>

					<div class="w-full">
						<label for="endDate" class="text-sm text-slate-200">
							End <span class="text-red-500">*</span>
						</label>
						<Datepicker
							id="endDate"
							name="endDate"
							value={currentEducation.endDate}
							onDateChange={(date) => {
								currentEducation.endDate = date;
							}}
							disabled={currentEducation.isCurrentlyStudying}
						/>
					</div>
				</div>
				<div class="flex justify-between">
					<div class={commonError ? '' : 'invisible'}>
						<p class="text-sm font-medium text-red-500">{commonError}</p>
					</div>
					<div>
						<input
							type="checkbox"
							id="currently-studying"
							bind:checked={currentEducation.isCurrentlyStudying}
							class="rounded border-slate-400"
							onchange={handleCurrentlyStudyingChange}
						/>
						<label for="currently-studying" class="ml-2 text-sm text-slate-200">
							Currently Studying
						</label>
					</div>
				</div>
			</div>

			<div class="mt-4 flex items-center gap-4">
				<div class="flex items-center gap-[0.5rem]">
					{#if isEditing}
						<BuilderButton variant="icon">
							{@html SVG.delete_Icon}
						</BuilderButton>
					{/if}

					<button
						type="button"
						class="rounded-b-[8px] rounded-t-[8px] rounded-br-[20px] bg-accent px-[22px] py-[9px] text-[12px] font-medium text-[#022F49]"
						onclick={addEducation}
					>
						{isEditing ? 'Save' : '+ Add'}
					</button>
				</div>
			</div>
		</div>
		<!-- <div class="absolute h-1 border"></div> -->

		<div class="w-full sm:max-h-[calc(100vh-350px)] sm:w-[30%] sm:overflow-y-auto sm:px-2">
			{#if educationList.length}
				{#each educationList as education, index}
					<div class="mb-4 rounded-[20px] bg-[#F1F1F10F] p-4">
						<div class="mb-2 flex items-start justify-between">
							<div>
								<h3 class="text-[14px] font-[600] text-white">{education.college}</h3>
								<p class="text-[14px] font-normal text-[#828BA2]">{education.course}</p>
							</div>

							<div class="flex gap-2">
								<BuilderButton variant="icon" onclick={() => editEducation(index)}>
									{@html SVG.edit_Icon}
								</BuilderButton>
								<BuilderButton variant="icon" onclick={() => removeEducation(index)}>
									{@html SVG.delete_Icon}
								</BuilderButton>
							</div>
						</div>
						<div class="flex justify-between">
							<p class="text-[12px] font-[500] text-[#F28212]">
								{#if education.cgpa}
									{education.cgpa} CGPA
								{:else}
									-
								{/if}
							</p>
							<p class="text-[12px] font-normal text-[#D1D1D1]">
								{education.startDate} - {education.isCurrentlyStudying
									? 'Present'
									: education.endDate}
							</p>
						</div>
					</div>
				{/each}
			{:else}
				<div class="p-[18px] text-[20px] font-medium text-[#F1F1F133]">
					Let colleges and recruiters see your academic achievements. Add all your qualifications
					and certifications to paint a complete picture of your potential.
				</div>
			{/if}
		</div>
	</div>
</div>
