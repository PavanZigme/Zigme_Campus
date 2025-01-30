<script>
	import { SVG } from '$lib/utils/svgs';
	import { showLoader, hideLoader } from '$lib/stores/loader';
	import { onMount } from 'svelte';
	import LoaderGif from '../../../lib/utils/images/Abstract Loading 20 (1).gif';
	import { API_END_POINT } from '../../../services/END_POINT';

	let user = $state({
		name: '',
		highest_education: '',
		contact_no: '',
		email: '',
		website: '',
		prefered_languages: [],
		qr: '',
		about_me: '',
		education: [],
		experiences: [],
		achievements: [],
		skills: []
	});

	let loaderPopup = $state(false);

	async function fetchUserData() {
		try {
			// showLoader('Loading user data...');
			loaderPopup = true;

			const token = localStorage.getItem('token');

			if (!token) {
				throw new Error('Authentication token not found');
			}

			const response = await fetch(`${API_END_POINT}/resume/getMyResume`, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${token}`
				}
			});

			if (!response.ok) {
				throw new Error(`Failed to fetch user data: ${response.statusText}`);
			}

			const data = await response.json();

			if (data) {
				user = data.data.user;
				user.qr = data.data.qr;
				console.log(data);
				user.education = data.data.education;
				user.experiences = data.data.experiences;
				user.achievements = data.data.achievements;
				user.skills = data.data.skills;
				user.about_me = data.data.about_me;
			}
		} catch (error) {
			console.error('Error fetching user data:', error);
		} finally {
			loaderPopup = false;
		}
	}

	onMount(() => {
		fetchUserData();
	});

	async function handleDownloadClick() {
		try {
			showLoader('Downloading resume...');
			const token = localStorage.getItem('token');

			if (!token) {
				throw new Error('Authentication token not found');
			}

			const templateId = 3848;

			const response = await fetch(`${API_END_POINT}/pdf/create`, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${token}`
				},
				body: JSON.stringify({ templateId })
			});

			if (!response.ok) {
				throw new Error(`Failed to download resume: ${response.statusText}`);
			}

			const data = await response.json();
			const link = data.pdfUrl;

			if (link) {
				window.open(link, '_blank');
			} else {
				console.error('Could not retrieve resume link. Please try again later.');
			}
		} catch (error) {
			console.error('Error downloading resume:', error);
		} finally {
			hideLoader();
		}
	}

	function formatDate(dateString) {
		const date = new Date(dateString);
		const formatter = new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' });
		return formatter.format(date).replace(' ', '-');
	}

	function gt(value, threshold) {
		return value > threshold;
	}
</script>

<div class="flex h-full flex-col gap-[40px] bg-[#F2F4F6] p-[40px] pr-[60px]">
	{#if !loaderPopup}
		<header class="flex items-center justify-between">
			<div>
				<h1 class="text-[48px] font-[600] text-[#022F49]">Resume ready!</h1>
				<p class="text-[28px] font-[500] text-[#828BA2]">Download your resume now</p>
			</div>
			<div class="flex items-center gap-[5px]">
				<span>
					{@html SVG.goToDash}
				</span>
				<span class="text-[12px] font-[500] text-[#022F49]"> Skip to Dashboard </span>
			</div>
		</header>
		<main class="flex h-full w-full gap-[20px]">
			<div class="h-full w-[70%] overflow-hidden bg-[#FBFBFB]">
				<div class="container mx-auto p-4">
					<div class="header flex items-start justify-between border-b border-gray-300 pb-3">
						<div class="info flex flex-1 flex-col gap-1">
							<div class="name text-lg font-bold">{user.name}</div>
							<div class="title text-sm font-medium text-gray-500">{user.highest_education}</div>
							<div class="contact-info text-xs font-normal">{user.contact_no}</div>
							<div class="contact-info text-xs font-normal">{user.email}</div>
							<div class="contact-info text-xs font-normal">{user.website}</div>
							<div class="contact-info text-xs font-normal">
								{#each user.prefered_languages as language, index (language)}
									{language}{#if index < user.prefered_languages.length - 1},
									{/if}
								{/each}
							</div>
						</div>
						<div class="qr-section flex">
							<div class="mt-[5px]">
								<div class="scan-label text-right text-xl font-bold uppercase">Scan</div>
								<div class="rich-resume text-xs font-medium uppercase">
									For <span class="text-blue-500">Rich Resume</span>
								</div>
							</div>
							<img src={user.qr} alt="QR Code" class="h-36 w-36" />
						</div>
					</div>

					<div class="bio mt-4">
						<div class="section-title text-sm font-bold uppercase text-blue-500">BIO</div>
						<div class="section-content text-xs font-normal text-gray-600">{user.about_me}</div>
					</div>

					<div class="education mt-4">
						<div class="section-title text-sm font-bold uppercase text-blue-500">EDUCATION</div>
						{#each user.education as edu}
							<div class="section-content text-xs font-normal text-gray-600">
								<div class="education-details flex items-center justify-between">
									<div class="course_name font-semibold capitalize text-black">{edu.course}</div>
									<div class="year-cgpa flex">
										<div class="mr-8">
											{#if edu.currently_studying}
												{formatDate(edu.start_year)} - Currently Studying
											{:else}
												{formatDate(edu.start_year)} - {formatDate(edu.end_year)}
											{/if}
										</div>
										<div class="text-blue-500">
											{#if gt(edu.cgpa, 10)}
												{edu.cgpa}%
											{:else}
												{edu.cgpa} CGPA
											{/if}
										</div>
									</div>
								</div>
								<div class="capitalize">{edu.college_name}</div>
							</div>
						{/each}
					</div>

					<div class="work-experience mt-4">
						<div class="section-title text-sm font-bold uppercase text-blue-500">
							WORK EXPERIENCE
						</div>
						{#each user.experiences as exp}
							<div class="section-content text-xs font-normal text-gray-600">
								<div class="job_company font-semibold capitalize text-black">
									{exp.company_name}
								</div>
								<div class="job-details flex items-center justify-between">
									<div class="job-title font-bold capitalize text-black">{exp.job_title}</div>
									<div>
										{#if exp.currently_working}
											{formatDate(exp.startDate)} - Currently Working
										{:else}
											{formatDate(exp.startDate)} - {formatDate(exp.endDate)}
										{/if}
									</div>
								</div>
								<div class="job-description">{exp.description}</div>
							</div>
						{/each}
					</div>

					<div class="achievements mt-4">
						<div class="section-title text-sm font-bold uppercase text-blue-500">ACHIEVEMENTS</div>
						{#each user.achievements as ach}
							<div class="section-content text-xs font-normal text-gray-600">
								<div class="achievement-name font-semibold capitalize text-black">
									{ach.course_name}
								</div>
								<div class="achievement-details font-semibold capitalize text-black">
									{ach.issuing_body}
								</div>
								<div class="job-description">{ach.desc}</div>
							</div>
						{/each}
					</div>

					<div class="skills mt-4">
						<div class="section-title text-sm font-bold uppercase text-blue-500">SKILLS</div>
						{#each user.skills as skill}
							<div class="section-content text-xs font-normal text-gray-600">
								<div class="skill-title font-semibold text-black">{skill.skill}</div>
								<div class="skill-title text-[12px] font-normal">{skill.description}</div>
							</div>
						{/each}
					</div>
				</div>
			</div>
			<div
				class="flex h-full w-[30%] flex-col items-center justify-center gap-[40px] bg-[#FBFBFB] p-[20px]"
			>
				<div class="flex flex-col items-center justify-center gap-[10px] text-center">
					<h2 class="text-[20px] font-[600] text-[#F28212]">You're Making Great Progress!</h2>
					<p class="text-[14px] font-[400] text-[#828BA2]">
						Completing both will give you the best head start for your professional journey!
					</p>
				</div>
				<div class="h-[1px] w-full bg-[#D6DDE2]"></div>

				<button
					class="flex items-center gap-[10px] rounded-[10px] rounded-[10px] rounded-tr-[24px] bg-[#022F49] px-[20px] py-[11px] text-accent"
					onclick={handleDownloadClick}
				>
					<!-- class="bg-trasparent rounded-[10px] rounded-tr-[24px] border border-[#022F49] px-[22px] py-[13px] text-[14px] font-medium text-[#344054]" -->

					{@html SVG.downloadIcon}
					Download Resume
				</button>
				<div class="relative flex flex-col gap-[1rem] rounded-2xl bg-[#E0E6E9] p-[12px]">
					<p class=" text-[14px] font-[400]">
						Discover your strengths and get personalized insights.
					</p>
					<a
						href="/work-dna-test"
						class="flex items-center justify-between rounded-[16px] bg-[#022F49] p-[14px]"
					>
						<span class="text-[18px] font-[600px] text-[#FBFBFB]">Work DNA Test</span>
						<!-- {@html SVG.leftIndicatorIcon} -->
					</a>
				</div>
			</div>
		</main>
	{:else}
		<div class="fixed inset-0 z-50 flex w-full items-center justify-center p-4">
			<div class="relative w-full max-w-[800px] rounded-[36px] bg-[#FBFBFB] p-[24px]">
				<div class="flex justify-center">
					<img src={LoaderGif} alt="Abstract GIF" class="h-full w-[123px]" />
				</div>
				<div class="flex flex-col items-center justify-center gap-[20px] text-center">
					<h2 class="text-[32px] font-[700]">Crafting a beautiful Resume For you</h2>
					<p class="text-[20px] font-[500] text-[#828BA2]">
						Hang tight! Your personalized, professional resume will be ready in moments.
					</p>
				</div>
			</div>
		</div>
	{/if}
</div>
