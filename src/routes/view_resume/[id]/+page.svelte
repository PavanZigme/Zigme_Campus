<script>
	import VideoIntro from '$lib/components/resume-builder/sections/VideoIntro.svelte';
	import { hideLoader, showLoader } from '$lib/stores/loader';
	import { questionsStore } from '$lib/stores/resumeBuilder';
	import { onMount } from 'svelte';
	import resume_view_01 from '../../../lib/utils/images/view-resume-01.png';
	import { goto } from '$app/navigation';
	import { SVG } from '$lib/utils/svgs';
	import { page } from '$app/stores';

	let arrayTab = $state(['Personal Stories', 'DNA Assessment']);
	let activeTab = $state(arrayTab[0]);

	function setActiveTab(tab) {
		activeTab = tab;
	}

	let user = $state({
		user: {},
		name: '',
		highest_education: '',
		contact_no: '',
		email: '',
		website: '',
		prefered_languages: [],
		qr: '',
		about_me: '',
		videoIntro: null,
		questionsAnswers: [],
		education: [],
		experiences: [],
		achievements: [],
		skills: []
	});

	let loaderPopup = $state(false);
	let errorMessage = $state('');
	let userID = $state();

	$effect(() => {
		const { id } = $page.params;
		userID = id;
	});

	async function fetchUserData() {
		try {
			showLoader('Loading user data...');

			const token = localStorage.getItem('token');

			if (!token) {
				throw new Error('Authentication token not found');
			}

			const response = await fetch(
				`http://ec2-13-61-151-83.eu-north-1.compute.amazonaws.com:4002/api/v1/rich-resume?userId=${userID}`,
				{
					method: 'GET',
					headers: {
						Authorization: `Bearer ${token}`
					}
				}
			);

			if (!response.ok) {
				throw new Error(`Failed to fetch user data: ${response.statusText}`);
			}

			const data = await response.json();

			if (data) {
				user.name = data?.data?.name;
				console.log(data);
				user.videoIntro = data?.data?.video_intro;
				user.questionsAnswers = data?.data?.questions;
				user.user = data.data.user;
				user.qr = data.data.qr_code.path;
				console.log(data);
				user.education = data.data.education;
				user.experiences = data.data.experiences;
				user.achievements = data.data.achievements;
				user.skills = data.data.skills;
				user.about_me = data.data.about_me;
				errorMessage = '';
			}
		} catch (error) {
			console.error('Error fetching user data:', error);
			errorMessage = 'Failed to fetch user data. Please try again later.';
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

	onMount(() => {
		// fetchUserData();
	});
</script>

<div>
	<header class="flex items-center justify-between bg-[#F2F4F6] px-[18px] py-[30px]">
		<div>
			<a href="zigme.in">{@html SVG.zigmeOriginalLogo}</a>
		</div>
		<div class="flex gap-[12px]">
			<button
				class="rounded-[10px] rounded-tr-[24px] border border-[#022F49] px-[20px] py-[11px] text-[14px] font-medium text-[022F49]"
				>Contact Us</button
			>
			<button
				class="rounded-[10px] rounded-tr-[24px] bg-[#022F49] px-[22px] py-[13px] text-[14px] font-medium text-white"
				>Sign Up on ZigMe
			</button>
		</div>
	</header>
	{#if !errorMessage}
		<div class="flex flex-col gap-[40px] bg-[#FBFBFB] px-[60px] py-[32px]">
			<div class="text-center">
				<h1 class="text-[48px] font-[500] text-[#F28212]">
					Welcome to {user.user.name}'s Profile!
				</h1>
				<p class="text-[24px] font-normal text-[#828BA2]">
					Explore beyond the resume and get a glimpse of the candidate's personality and unique
					experiences.
				</p>
			</div>

			<div class="flex justify-center">
				<video
					src={user?.videoIntro?.path}
					controls
					class="h-[500px] w-full rounded-[24px] object-cover"
				>
					<track kind="captions" />
				</video>
			</div>
			<div class="w-full overflow-hidden bg-[#FBFBFB]">
				<div class="container mx-auto p-4">
					<div class="header flex items-start justify-between border-b border-gray-300 pb-3">
						<div class="info flex flex-1 flex-col gap-1">
							<div class="name text-lg font-bold">{user.user.name}</div>
							<div class="title text-sm font-medium text-gray-500">
								{user.user.highest_education}
							</div>
							<div class="contact-info text-xs font-normal">{user.user.contact_no}</div>
							<div class="contact-info text-xs font-normal">{user.user.email}</div>
							<div class="contact-info text-xs font-normal">{user.user.website}</div>
							<div class="contact-info text-xs font-normal">
								{#each user.user.prefered_languages as language, index (language)}
									{language}{#if index < user.user.prefered_languages.length - 1},
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
						{#each user?.achievements as ach}
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
						{#each user?.skills as skill}
							<div class="section-content text-xs font-normal text-gray-600">
								<div class="skill-title font-semibold text-black">{skill.skill}</div>
								<div class="skill-title text-[12px] font-normal">{skill.description}</div>
							</div>
						{/each}
					</div>
				</div>
			</div>

			<div class="rounded-[24px] bg-[#F2F4F6] p-[20px]">
				<div class="mb-6 flex justify-center gap-[1rem]">
					{#each arrayTab as tab}
						<button
							onclick={() => setActiveTab(tab)}
							class="rounded-[50px] px-[14px] py-[10px] text-[14px] font-medium {activeTab === tab
								? 'bg-[#022F49] text-white'
								: 'text-black'}"
						>
							{tab}
						</button>
					{/each}
				</div>

				<div class="rounded-lg">
					<p class="text-[18px] font-medium text-[#F28212]">
						Personal Stories: Real Experiences, Real Growth
					</p>
					{#key user.questionsAnswers}
						{#each user.questionsAnswers as story}
							<div class="mt-[15px]">
								<h2 class="text-[24px] font-medium text-[#022F49]">{story.question}</h2>
								{#if story.answer}
									<p class="mt-2 text-[18px] font-normal text-[#828BA2]">{story.answer}</p>
								{:else}
									<p class="mt-2 text-[18px] font-normal text-[#828BA2]">no answer</p>
								{/if}
							</div>
						{/each}
					{/key}
				</div>
			</div>

			<div class="flex w-full rounded-[24px]">
				<div class="w-[30%]">
					<img src={resume_view_01} alt="resume_view_01" class="h-full w-full rounded-l-[24px]" />
				</div>
				<div class="flex w-[70%] flex-col gap-[44px] rounded-r-[24px] bg-[#022F49] p-[20px]">
					<div>
						<h2 class="text-[38px] font-[700] text-[#FBFBFB]">Faster, Smarter Hiring with Zigme</h2>
						<p class="mt-4 text-[18px] font-normal text-[#FFFFFFCC]">
							Zigme streamlines recruitment by offering more than just resumes. Access video intros,
							real-life stories, and AI insights, all in one place. This makes it easier to assess a
							candidate's potential quickly and efficiently.
						</p>
					</div>
					<div class="flex flex-col gap-[20px]">
						<div class="flex w-full text-white">
							<div class="flex w-[22%] items-center gap-[8px]">
								<span>{@html SVG.checkedTick}</span>
								<span class="text-[18px] font-[500]">Save Time :</span>
							</div>
							<div class="w-[70%]">
								<p class="text-[18px] font-[300]">Streamlined profiles with essential details.</p>
							</div>
						</div>
						<div class="flex w-full text-white">
							<div class="flex w-[22%] items-center gap-[8px]">
								<span>{@html SVG.checkedTick}</span>
								<span class="text-[18px] font-[500]">True Insights :</span>
							</div>
							<div class="w-[70%]">
								<p class="text-[18px] font-[300]">
									Soft skills and personality, not just qualifications.
								</p>
							</div>
						</div>
						<div class="flex w-full text-white">
							<div class="flex w-[22%] items-center gap-[8px]">
								<span>{@html SVG.checkedTick}</span>
								<span class="text-[18px] font-[500]">Smarter Hiring :</span>
							</div>
							<div class="w-[70%]">
								<p class="text-[18px] font-[300]">Quickly find the best candidates with ease.</p>
							</div>
						</div>
					</div>
					<button
						class="w-fit rounded-[10px] rounded-tr-[24px] bg-white px-[22px] py-[13px] text-[14px] font-medium text-[#022F49]"
						>Reach Out to Jane Now</button
					>
				</div>
			</div>
			<footer class="h-full w-full rounded-tl-[180px] rounded-tr-[36px] bg-[#0B150F] p-[40px]">
				<div
					class="flex h-full flex-col gap-[20px] rounded-[24px] rounded-tl-[150px] bg-[#F1F1F10F] px-[30px] pt-[30px] text-white"
				>
					<div class="flex justify-end gap-[45px] text-[#F1F1F1]">
						<p class="text-[16px] font-normal">About</p>
						<p class="text-[16px] font-normal">Placement Help Tools</p>
						<p class="text-[16px] font-normal">Careers</p>
						<p class="text-[16px] font-normal">Blogs</p>
					</div>
					<div class="flex h-full items-center gap-[18px]">
						<div class="">{@html SVG.zigmeBlackWhiteLog}</div>
						<div class="h-[1px] w-[44px] rotate-90 rotate-90 bg-[#F1F1F133]"></div>
						<div class="text-[24px] font-normal">Let's begin your Journey to Success !</div>
					</div>
					<div class="flex gap-[12px]">
						{@html SVG.linkedinLog}
						{@html SVG.instaLogo}
						{@html SVG.xLogo}
					</div>
					<div class="flex justify-between border-t p-[10px] text-[#828BA2]">
						<div class="text-[12px] font-normal">© 2025 ZigMe. All rights reserved.</div>
						<div class="flex gap-[45px] text-[#828BA2]">
							<p class="text-[12px] font-normal">contact us</p>
							<p class="text-[12px] font-normal">Terms of Services</p>
							<p class="text-[12px] font-normal">Privacy Policy</p>
						</div>
					</div>
				</div>
			</footer>
		</div>
	{:else}
		<div class="error-message mt-4 text-center text-red-500">
			{errorMessage}
		</div>
	{/if}
</div>
