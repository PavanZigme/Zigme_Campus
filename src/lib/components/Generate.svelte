<script>
	import { resumeBuilderStore } from '$lib/stores/resumeBuilder';

	let { pageName = '', onGenerated = (data) => {}, onError = (error) => {} } = $props();

	let loading = $state(false);

	let experienceList = $state([]);
	let achievementsList = $state([]);
	let variables = $state({});

	$effect(() => {
		experienceList = $resumeBuilderStore.formData.experience;

		achievementsList = $resumeBuilderStore.formData.achievements;
	});

	$effect(() => {
		if (pageName === 'experience') {
			variables = {
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
		} else if (pageName === 'achievement') {
			variables = {
				type: 'achievements',
				data: achievementsList.map((achievement) => ({
					issuing_body: achievement.issuingBody,
					course_name: achievement.title,
					desc: achievement.description || ''
				}))
			};
		}
		console.log(variables);
	});

	async function handleGenerate() {
		try {
			loading = true;
			console.log('Generating description with variables:', variables, pageName);

			const token = localStorage.getItem('token');

			if (!token) {
				throw new Error('Authentication token not found');
			}

			const response = await fetch(
				'http://ec2-13-61-151-83.eu-north-1.compute.amazonaws.com:4002/api/v1/chatGpt/generate-description',
				{
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						...(token && { Authorization: `Bearer ${token}` })
					},
					body: JSON.stringify(variables)
				}
			);

			if (!response.ok) {
				throw new Error(`Failed to send data: ${response.statusText}`);
			}

			const result = await response.json();
			console.log('Data sent successfully:', result);

			onGenerated(result);
		} catch (error) {
			console.error('Error sending data:', error);
			onError(error);
		} finally {
			loading = false;
		}
	}
</script>

<button
	class="inline-flex items-center rounded-lg bg-[#F1F1F133] px-[8px] py-[6.5px] text-[#FBFBFB]"
	onclick={handleGenerate}
	disabled={loading}
>
	<div class="flex items-center gap-2">
		{#if loading}
			<svg
				class="h-5 w-5 animate-spin"
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
			>
				<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
				<path
					class="opacity-75"
					fill="currentColor"
					d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
				/>
			</svg>
		{:else}
			<svg
				width="20"
				height="20"
				viewBox="0 0 20 20"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M2.9167 17.0835C3.60837 17.7752 4.72503 17.7752 5.4167 17.0835L16.25 6.2502C16.9417 5.55853 16.9417 4.44186 16.25 3.7502C15.5584 3.05853 14.4417 3.05853 13.75 3.7502L2.9167 14.5835C2.22503 15.2752 2.22503 16.3919 2.9167 17.0835Z"
					stroke="#FBFBFB"
					stroke-width="1.2"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
				<path
					d="M15.0083 7.49219L12.5083 4.99219"
					stroke="#FBFBFB"
					stroke-width="1.2"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
				<path
					d="M7.08325 2.03366L8.33325 1.66699L7.96659 2.91699L8.33325 4.16699L7.08325 3.80033L5.83325 4.16699L6.19992 2.91699L5.83325 1.66699L7.08325 2.03366Z"
					stroke="#FBFBFB"
					stroke-width="1.2"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
				<path
					d="M3.75 7.03366L5 6.66699L4.63333 7.91699L5 9.16699L3.75 8.80033L2.5 9.16699L2.86667 7.91699L2.5 6.66699L3.75 7.03366Z"
					stroke="#FBFBFB"
					stroke-width="1.2"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
				<path
					d="M16.25 11.1997L17.5 10.833L17.1333 12.083L17.5 13.333L16.25 12.9663L15 13.333L15.3667 12.083L15 10.833L16.25 11.1997Z"
					stroke="#FBFBFB"
					stroke-width="1.2"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
		{/if}
		<span class="text-[14px] font-normal">Generate</span>
	</div>
</button>
