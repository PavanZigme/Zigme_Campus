<script>
	import { resumeBuilderStore, updateCurrentStep, updateStepData } from '$lib/stores/resumeBuilder';
	import { onMount } from 'svelte';
	import { bioPopupStore } from '$lib/stores/resumeBuilder';

	import BioPopup from '$lib/components/BioPopup.svelte';
	import { navigationDirection } from '$lib/stores/resumeBuilder';
	import { showLoader, hideLoader } from '$lib/stores/loader';
	import { API_END_POINT } from '../../../services/END_POINT';

	let videoFile = $state(null);
	let videoUrl = $state(null);
	let error = $state(null);
	let skillCategories = $state([]);
	let languagesArray = $state([]);

	let achievementsList = $state([]);
	let educationList = $state([]);
	let experiencesList = $state([]);

	const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
	const ALLOWED_FORMATS = ['video/mp4', 'video/mov', 'video/avi'];
	import { fade } from 'svelte/transition';
	import { goto } from '$app/navigation';

	let bio = $state('');
	let isOpen = $state(false);

	async function GenerateBio() {
		try {
			showLoader('Generating your Bio...');

			// Get the JWT token from localStorage or your auth store
			const token = localStorage.getItem('token');

			if (!token) {
				throw new Error('Authentication token not found');
			}

			const response = await fetch(
				`${API_END_POINT}/chatGpt/generate-description?type=description`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						...(token && { Authorization: `Bearer ${token}` })
					},
					body: JSON.stringify({
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
					})
				}
			);

			if (!response.ok) {
				throw new Error(`Failed to send experience data: ${response.statusText}`);
			}

			const result = await response.json();
			bio = result.data;
		} catch (error) {
			console.error('Error sending experience data:', error);
		} finally {
			hideLoader();
		}
	}

	$effect(() => {
		skillCategories = $resumeBuilderStore.formData.skills;
		languagesArray = $resumeBuilderStore.formData.languages;
		achievementsList = $resumeBuilderStore?.formData?.achievements || [];
		educationList = $resumeBuilderStore?.formData?.education || [];
		experiencesList = $resumeBuilderStore?.formData?.experience || [];
		// videoFile = $resumeBuilderStore?.formData?.videoIntro;
	});

	function handleSkip() {
		$bioPopupStore = false;
	}

	async function sendBioData() {
		try {
			const bioData = {
				type: 'about_me',
				data: [bio]
			};

			// Get the JWT token from localStorage or your auth store
			const token = localStorage.getItem('token');

			if (!token) {
				throw new Error('Authentication token not found');
			}

			const response = await fetch(`${API_END_POINT}/resume/create`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					...(token && { Authorization: `Bearer ${token}` })
				},
				body: JSON.stringify(bioData)
			});

			if (!response.ok) {
				throw new Error(`Failed to send bio data: ${response.statusText}`);
			}

			const result = await response.json();
		} catch (error) {
			console.error('Error sending bio data:', error);
		}
	}

	function handleConfirm() {
		sendBioData();
		$bioPopupStore = false;
		goto('/resume-ready');
	}

	$bioPopupStore = false;

	async function handleVideoUpload(event) {
		const file = event.target.files?.[0];
		error = null;

		if (!file) {
			console.error('No file selected');
			return;
		}

		console.log('Selected file:', file); // Debugging log

		// Check file format
		if (!ALLOWED_FORMATS.includes(file.type)) {
			error = {
				title: 'Oops!',
				message: "This video format isn't supported.",
				details: 'Please upload a video in one of these formats:',
				formats: 'MP4, MOV, or AVI.',
				hint: 'Check your file and try again!'
			};
			return;
		}

		// Check file size
		if (file.size > MAX_FILE_SIZE) {
			error = {
				title: 'Oops!',
				message: 'The video file is too large.',
				details: 'Please upload a video smaller than 50MB.',
				hint: 'Try compressing your video and upload again!'
			};
			return;
		}

		videoFile = file;
		updateStepData('videoIntro', videoFile);

		try {
			videoUrl = URL.createObjectURL(file);
			console.log('Video URL:', videoUrl); // Debugging log
		} catch (e) {
			console.error('Error creating video URL:', e);
			error = {
				title: 'Error',
				message: 'Failed to create video URL.',
				details: 'Please try uploading the video again.'
			};
		}

		await sendVideoFile();
	}

	function removeVideo() {
		videoFile = null;
		if (videoUrl) {
			URL.revokeObjectURL(videoUrl);
			videoUrl = null;
		}
		error = null;
	}

	function retryUpload() {
		error = null;
	}

	async function sendSkillsData() {
		try {
			const skillsData = {
				type: 'skills',
				data: skillCategories.map((skill) => ({
					skill: skill.title,
					description: skill.description
				})),
				languages: languagesArray
			};

			// Get the JWT token from localStorage or your auth store
			const token = localStorage.getItem('token');

			if (!token) {
				throw new Error('Authentication token not found');
			}

			const response = await fetch(`${API_END_POINT}/resume/create`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					...(token && { Authorization: `Bearer ${token}` })
				},
				body: JSON.stringify(skillsData)
			});

			if (!response.ok) {
				throw new Error(`Failed to send skills data: ${response.statusText}`);
			}

			const result = await response.json();
			console.log('Skills data sent successfully:', result);
		} catch (error) {
			console.error('Error sending skills data:', error);
		}
	}

	async function sendVideoFile() {
		try {
			if (!videoFile) {
				throw new Error('No video file selected');
			}

			// Get the JWT token from localStorage or your auth store
			const token = localStorage.getItem('token');

			if (!token) {
				throw new Error('Authentication token not found');
			}

			const formData = new FormData();
			formData.append('intro', videoFile);

			const response = await fetch(
				`${API_END_POINT}/resume/upload-intro`,

				{
					method: 'POST',
					headers: {
						...(token && { Authorization: `Bearer ${token}` })
					},

					body: formData
				}
			);

			if (!response.ok) {
				throw new Error(`Failed to upload video: ${response.statusText}`);
			}

			const result = await response.json();
		} catch (error) {
			console.error('Error uploading video:', error);
		}
	}

	onMount(() => {
		if ($navigationDirection === 'forward') {
			sendSkillsData();
		}
	});
</script>

<div
	class="flex h-full max-h-[calc(100vh-300px)] w-full flex-col gap-6 overflow-y-auto p-6 sm:max-h-[calc(100vh-350px)]"
>
	<div class="text-center">
		<h2 class="mb-2 text-[14px] font-normal text-[#828BA2] sm:text-[24px] sm:font-[600]">
			Create a lasting impression by sharing your story in your own words.
		</h2>
		<p class="text-[14px] font-normal text-[#828BA2]">
			A quick intro video can set you apart and showcase your unique personality.
		</p>
	</div>

	{#if error}
		<div class="flex flex-col items-center gap-4">
			<div class="flex flex-col items-center">
				<div
					class="mb-4 flex h-[150px] w-[300px] flex-col items-center justify-center rounded-lg bg-[#0A2942] p-6"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="mb-4 h-12 w-12 text-gray-400"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
					>
						<circle cx="12" cy="12" r="10" />
						<line x1="12" y1="8" x2="12" y2="12" />
						<line x1="12" y1="16" x2="12.01" y2="16" />
					</svg>
				</div>
				<div class="text-center">
					<h3 class="mb-1 text-xl font-medium text-gray-700">{error.title}</h3>
					<p class="mb-2 text-gray-500">{error.message}</p>
					{#if error.details}
						<p class="text-gray-500">{error.details}</p>
					{/if}
					{#if error.formats}
						<p class="mb-2 text-gray-500">{error.formats}</p>
					{/if}
					<p class="text-gray-500">{error.hint}</p>
				</div>
				<button
					onclick={retryUpload}
					class="mt-4 rounded-lg bg-gray-200 px-6 py-2 font-medium text-gray-700 hover:bg-gray-300"
				>
					Retry
				</button>
			</div>
		</div>
	{:else if !videoFile}
		<div class="flex w-full flex-col items-center justify-center gap-[20px] sm:flex-row">
			<label
				class="hover:border-primary-500 flex h-[120px] w-[300px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-[#F1F1F133] bg-[#F1F1F10F] transition-colors"
			>
				<input
					type="file"
					accept=".mp4,.mov,.avi,video/mp4,video/quicktime,video/x-msvideo"
					onchange={handleVideoUpload}
					class="hidden"
				/>
				<svg
					width="24"
					height="25"
					viewBox="0 0 24 25"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M12.53 20.9201H6.21C3.05 20.9201 2 18.8201 2 16.7101V8.29008C2 5.13008 3.05 4.08008 6.21 4.08008H12.53C15.69 4.08008 16.74 5.13008 16.74 8.29008V16.7101C16.74 19.8701 15.68 20.9201 12.53 20.9201Z"
						stroke="#FBFBFB"
						stroke-width="1.2"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
					<path
						d="M19.5202 17.6001L16.7402 15.6501V9.34013L19.5202 7.39013C20.8802 6.44013 22.0002 7.02013 22.0002 8.69013V16.3101C22.0002 17.9801 20.8802 18.5601 19.5202 17.6001Z"
						stroke="#FBFBFB"
						stroke-width="1.2"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
					<path
						d="M11.5 11.5C12.3284 11.5 13 10.8284 13 10C13 9.17157 12.3284 8.5 11.5 8.5C10.6716 8.5 10 9.17157 10 10C10 10.8284 10.6716 11.5 11.5 11.5Z"
						stroke="#FBFBFB"
						stroke-width="1.2"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>

				<span class="text-[14px] font-normal text-white">Add Video</span>
			</label>

			<div class="flex flex-col gap-3">
				<div class="flex items-center gap-3">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
					>
						<circle cx="12" cy="12" r="10" />
						<path d="m9 12 2 2 4-4" />
					</svg>
					<span class="text-[16px] font-medium">Keep it short and sweet—around 60-90 seconds.</span>
				</div>
				<div class="flex items-center gap-3">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
					>
						<circle cx="12" cy="12" r="10" />
						<path d="m9 12 2 2 4-4" />
					</svg>
					<span class="text-[16px] font-medium"
						>Share your passion, goals, and what drives you.</span
					>
				</div>
				<div class="flex items-center gap-3">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
					>
						<circle cx="12" cy="12" r="10" />
						<path d="m9 12 2 2 4-4" />
					</svg>
					<span class="text-[16px] font-medium">Smile, stay confident, and be yourself!</span>
				</div>
			</div>
		</div>
	{:else}
		<div class="mx-auto flex w-full flex-col items-center justify-center gap-[20px] sm:flex-row">
			<div class="relative w-[300px] overflow-hidden rounded-lg">
				<video src={videoUrl} controls class="h-[120px] w-full rounded-lg object-cover">
					<track kind="captions" />
				</video>
				<button
					onclick={removeVideo}
					aria-label="Remove video"
					class="absolute right-2 top-2 rounded-full bg-gray-800/50 p-1 text-white hover:bg-gray-800/70"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
					>
						<path d="M18 6L6 18M6 6l12 12" />
					</svg>
				</button>
			</div>
			<div class="w-[400px]">
				<h3 class="mb-1 text-[24px] font-[600] text-[#FFFFFF]">Well Done!</h3>
				<p class="text-[14px] font-normal text-[#D6DDE2]">
					You're one step closer to crafting a standout resume that tells your unique story.
				</p>
			</div>
		</div>
	{/if}
</div>

{#if $bioPopupStore}
	<div
		class="fixed inset-0 z-50 flex w-full items-center justify-center p-4"
		transition:fade={{ duration: 200 }}
	>
		<div class="relative w-full max-w-[800px] rounded-[36px] bg-[#FBFBFB] p-[24px]">
			<h2 class="mb-2 text-center text-[20px] font-semibold text-[#F28212]">
				Your Bio, Your Style!
			</h2>
			<p class="mb-6 text-center text-[16px] font-normal text-[#5D657A]">
				We've pieced together the perfect bio for you! Feel free to tweak it, edit it, or make it
				your own. Your story, your vibe!
			</p>

			<div class="mb-6">
				<div class="flex items-center justify-between">
					<label for="bio-input" class="block text-sm font-medium text-gray-700">Bio</label>
					<button
						onclick={GenerateBio}
						class="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-orange-500 hover:bg-orange-50"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-4 w-4"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
						>
							<path
								d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
							/>
						</svg>
						Regenerate
					</button>
				</div>
				<textarea
					id="bio-input"
					bind:value={bio}
					rows="3"
					class="w-full rounded-[12px] border border-[#D1D1D1] p-3 text-[#0B150F] focus:border-blue-500 focus:ring-blue-500"
				></textarea>
			</div>

			<div class="mt-[25px] flex justify-center gap-4">
				<button
					class="bg-trasparent rounded-[10px] rounded-tr-[24px] border border-[#022F49] px-[22px] py-[13px] text-[14px] font-medium text-[#344054]"
					onclick={handleSkip}
				>
					Skip For Now
				</button>
				<button
					class="rounded-[10px] rounded-tr-[24px] bg-[#022F49] px-[22px] py-[13px] text-[14px] font-medium text-white"
					onclick={handleConfirm}
				>
					Looks great!
				</button>
			</div>
		</div>
	</div>
{/if}
