<script>
	import Input from '$lib/components/elements/Input.svelte';
	import Dropdown from '$lib/components/elements/Dropdown.svelte';
	import BuilderButton from '../ui/BuilderButton.svelte';
	import Datepicker from '$lib/components/elements/DatePicker/Datepicker.svelte';
	import { resumeBuilderStore, updateStepData, markStepComplete } from '$lib/stores/resumeBuilder';
	import { SVG } from '$lib/utils/svgs';
	import MultiSelectDropdown from '$lib/components/elements/MultiSelectDropdown.svelte';
	import Generate from '$lib/components/Generate.svelte';
	import { onMount } from 'svelte';
	import { navigationDirection } from '$lib/stores/resumeBuilder';

	let jobTypes = ['Full-time', 'Part-time', 'Freelance', 'Internship'];
	let isEditing = $state(false);
	let editingIndex = $state(-1);
	let experienceList = $state([]);
	let educationList = $state([]);
	const currentStep = $derived($resumeBuilderStore.currentStep);
	let currentExperience = $state({
		title: '',
		companyName: '',
		type: '',
		location: '',
		startDate: '',
		endDate: '',
		skills: [],
		description: '',
		isCurrentlyWorking: false
	});

	let commonError = $state('');

	// Initialize from store
	$effect(() => {
		experienceList = $resumeBuilderStore.formData.experience;
		educationList = $resumeBuilderStore.formData.education;
	});

	// Update store whenever experienceList changes
	$effect(() => {
		updateStepData('experience', experienceList);
		// Mark step as complete if there's at least one experience entry
		markStepComplete('experience', experienceList.length > 0);
	});

	function resetForm() {
		currentExperience = {
			title: '',
			companyName: '',
			type: '',
			location: '',
			startDate: '',
			endDate: '',
			skills: [],
			description: '',
			isCurrentlyWorking: false
		};
		commonError = '';
		isEditing = false;
		editingIndex = -1;
	}

	function handleCurrentlyWorkingChange(event) {
		currentExperience.isCurrentlyWorking = event.target.checked;
		if (currentExperience.isCurrentlyWorking) {
			const today = new Date();
			currentExperience.endDate = formatDate(today);
		} else {
			currentExperience.endDate = '';
		}
	}

	function validateForm() {
		commonError = '';
		const requiredFields = ['title', 'companyName', 'type', 'startDate'];

		for (const field of requiredFields) {
			if (!currentExperience[field]) {
				commonError = 'Please fill in all required fields';
				return false;
			}
		}

		if (!currentExperience.isCurrentlyWorking && !currentExperience.endDate) {
			commonError = 'Please fill in all required fields';
			return false;
		}

		return true;
	}

	function addExperience() {
		if (!validateForm()) return;

		if (isEditing) {
			experienceList[editingIndex] = { ...currentExperience };
		} else {
			experienceList = [...experienceList, { ...currentExperience }];
		}

		resetForm();
	}

	function editExperience(index) {
		isEditing = true;
		editingIndex = index;
		currentExperience = { ...experienceList[index] };
	}

	function removeExperience(index) {
		experienceList = experienceList.filter((_, i) => i !== index);
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

	function handleGenerated(data) {
		console.log(data);
	}

	// Add this function to handle the API call
	async function sendExperienceData() {
		try {
			const experienceData = {
				type: 'education',
				data: educationList.map((exp) => ({
					college_name: exp.college,
					start_year: formatDateForAPI(exp.startDate),
					end_year: exp.isCurrentlyWorking ? null : formatDateForAPI(exp.endDate),
					currently_studying: exp.isCurrentlyStudying,
					cgpa: parseInt(exp.cgpa),
					course: exp.course
				}))
			};

			console.log(experienceData);

			// Get the JWT token from localStorage or your auth store
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
						...(token && { Authorization: `Bearer ${token}` })
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
				company_name: currentExperience.companyName,
				startDate: formatDateForAPI(currentExperience.startDate),
				endDate: currentExperience.currentlyWorking
					? null
					: formatDateForAPI(currentExperience.endDate),
				currently_working: currentExperience.currentlyWorking || false,
				location: currentExperience.location[0] || '',
				job_type: currentExperience.type?.toLowerCase() || '',
				job_title: currentExperience.title || ''
			};

			// Get the JWT token from localStorage or your auth store
			const token = localStorage.getItem('token');

			if (!token) {
				throw new Error('Authentication token not found');
			}

			const response = await fetch(
				'http://ec2-13-61-151-83.eu-north-1.compute.amazonaws.com:4000/api/v1/chatGpt/generate-description?type=description',
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
			currentExperience.description = result.data;
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
						label="Title/ Designation /Role"
						required={true}
						placeholder="Enter Job Title"
						bind:value={currentExperience.title}
					/>
				</div>
				<div class="w-full">
					<Input
						label="Company"
						required={true}
						placeholder="Enter Company Name"
						bind:value={currentExperience.companyName}
					/>
				</div>
				<div class="w-full">
					<Dropdown
						label="Type"
						required={true}
						name="type"
						placeholder="Select Job Type"
						options={jobTypes}
						value={currentExperience.type}
						onSelect={(selected) => {
							currentExperience.type = selected;
						}}
					/>
				</div>
			</div>

			<div class="flex w-full flex-col justify-between gap-[10px]">
				<div class="flex w-full flex-col justify-between gap-[10px] sm:flex-row">
					<div class="w-full">
						<label for="startDate" class="mb-[6px] text-sm text-slate-200">
							Start <span class="text-red-500">*</span>
						</label>
						<div class="datepicker">
							<Datepicker
								id="startDate"
								name="startDate"
								value={currentExperience.startDate}
								onDateChange={(date) => {
									currentExperience.startDate = date;
								}}
							/>
						</div>
					</div>

					<div class="w-full">
						<label for="endDate" class="text-sm text-slate-200">
							End <span class="text-red-500">*</span>
						</label>
						<Datepicker
							id="endDate"
							name="endDate"
							value={currentExperience.endDate}
							onDateChange={(date) => {
								currentExperience.endDate = date;
							}}
							disabled={currentExperience.isCurrentlyWorking}
						/>
						<div>
							<input
								type="checkbox"
								id="currently-working"
								bind:checked={currentExperience.isCurrentlyWorking}
								class="rounded border-slate-400"
								onchange={handleCurrentlyWorkingChange}
							/>
							<label for="currently-working" class="ml-2 text-sm text-slate-200">
								Currently Working
							</label>
						</div>
					</div>

					<MultiSelectDropdown
						options={['hybrid', 'remote', 'mumbai']}
						placeholder="Enter Location"
						isMultiSelect={false}
						bind:value={currentExperience.location}
						label="Location"
					/>
				</div>

				<div>
					<MultiSelectDropdown
						options={['JavaScript', 'Python', 'React', 'Node.js', 'SQL', 'TypeScript', 'Svelte']}
						placeholder="Select skills"
						isMultiSelect={true}
						bind:value={currentExperience.skills}
						label="Skills"
					/>
				</div>
				<div class="">
					<div class="flex justify-between">
						<label for="description" class="mb-[6px] text-sm text-slate-200">
							Description <span class="text-red-500">*</span>
						</label>
						<button class="" onclick={GenerateDescription}> Generate</button>
					</div>
					<textarea
						id="description"
						placeholder="Enter job description"
						bind:value={currentExperience.description}
						class="h-30 w-full resize-none rounded-[12px] bg-[#F1F1F10F] p-3 text-white placeholder-[#828BA2]"
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
						onclick={addExperience}
					>
						{isEditing ? 'Save' : '+ Add'}
					</button>
				</div>
			</div>
		</div>

		<div class="w-full sm:max-h-[calc(100vh-350px)] sm:w-[30%] sm:overflow-y-auto sm:px-2">
			{#each experienceList as experience, index}
				<div class="mb-4 rounded-[20px] bg-[#F1F1F10F] p-4">
					<div class="mb-2 flex items-start justify-between">
						<div>
							<h3 class="text-[14px] font-[600] text-white">{experience.title}</h3>
							<p class="text-[14px] font-normal text-[#828BA2]">{experience.companyName}</p>
						</div>

						<div class="flex gap-2">
							<BuilderButton variant="icon" onclick={() => editExperience(index)}>
								{@html SVG.edit_Icon}
							</BuilderButton>
							<BuilderButton variant="icon" onclick={() => removeExperience(index)}>
								{@html SVG.delete_Icon}
							</BuilderButton>
						</div>
					</div>
					<div class="flex justify-between">
						<p class="text-[12px] font-[500] text-[#F28212]">{experience.type}</p>
						<p class="text-[12px] font-normal text-[#D1D1D1]">
							{experience.startDate} - {experience.isCurrentlyWorking
								? 'Present'
								: experience.endDate}
						</p>
					</div>
					{#if experience.description}
						<p class="mt-2 text-[12px] text-[#D1D1D1]">{experience.description}</p>
					{/if}
				</div>
			{/each}
		</div>
	</div>
</div>
