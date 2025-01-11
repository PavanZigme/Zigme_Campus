<script>
	import AuthHeader from '$lib/components/auth/AuthHeader.svelte';
	import InputField from '$lib/components/InputField.svelte';
	import { SVG } from '$lib/utils/svgs';
	import { withLoading } from '$lib/utils/async';
	import { AUTH_CONFIG } from '$lib/config/auth';

	import student1 from '../../lib/utils/images/millennial-man.png';
	import student2 from '../../lib/utils/images/curly-latin-female.png';

	function handleSubmit() {
		console.log('hi');
	}

	const levels = $state([
		{ id: 'start', label: 'Start', status: 'completed' },
		{ id: 'lvl1', label: 'LVL I', status: 'current' },
		{ id: 'lvl2', label: 'LVL II', status: 'upcoming', hasAvatar: true },
		{ id: 'lvl3', label: 'LVL III', status: 'upcoming' }
	]);

	const getProgressStyle = (status) => {
		switch (status) {
			case 'completed':
				return 'bg-blue-500';
			case 'current':
				return 'bg-slate-200';
			case 'upcoming':
				return 'bg-slate-200';
			default:
				return 'bg-slate-200';
		}
	};
</script>

<div class="h-screen w-full bg-[#E0E6E9]">
	<div class="mx-auto flex h-full flex-col">
		<div class="relative h-[360px] w-full px-[40px] lg:grid lg:grid-cols-5">
			<div class="border-black-500 col-span-3 border">
				<div class="flex w-full items-center gap-[0.5rem] xs:p-[10px] sm:p-[30px] lg:py-[60px]">
					<svg
						width="20"
						height="20"
						viewBox="0 0 20 20"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M3.1333 6.0163V13.9913C3.1333 15.6246 4.90829 16.6496 6.32496 15.833L9.78328 13.8413L13.2416 11.8413C14.6583 11.0246 14.6583 8.98296 13.2416 8.16629L9.78328 6.1663L6.32496 4.17464C4.90829 3.35798 3.1333 4.37464 3.1333 6.0163Z"
							stroke="#022F49"
							stroke-width="1.2"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
						<path
							d="M16.8667 15.1496V4.84961"
							stroke="#022F49"
							stroke-width="1.2"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>

					<a href={AUTH_CONFIG.ROUTES.DASHBOARD}> Go to Dashboard </a>
				</div>
			</div>

			<div class="col-span-2 flex h-full w-full justify-between">
				<div class="absolute right-[318px] lg:py-[60px]">
					<h2 class="flex w-fit items-center rounded-[50px] bg-[#D6DDE2] px-[20px] py-[10px]">
						<span class="text-[1rem] font-[600] text-[#F28212] lg:text-[18px]">#Zig</span>
						<span class="text-[1rem] font-[600] lg:text-[18px]">ItUP</span>
					</h2>
				</div>

				<div class="flex">
					<div
						class="absolute right-[58px] top-0 sm:right-[76px] sm:top-[-20px] lg:right-[165px] lg:top-[77px]"
					>
						{@html SVG.roundedLogo1}
						{@html SVG.roundedLogo2}
					</div>

					<img
						class="absolute bottom-0 z-20 hidden h-[115px] w-[173px] sm:h-[150px] sm:w-[254px] lg:right-[200px] lg:block lg:h-[169px]"
						src={student1}
						alt="Student"
					/>

					<img
						class="absolute hidden h-[115px] sm:right-[-38px] sm:top-[-4px] sm:h-[140px] lg:right-[56px] lg:top-[127px] lg:block lg:h-[153px]"
						src={student2}
						alt="Student"
					/>
				</div>
			</div>
		</div>

		<!-- Form Section -->
		<main class="relative h-screen">
			<div
				class="flex h-full flex-col justify-between gap-[12px] rounded-t-[40px] bg-[#022F49] p-[40px] text-white lg:rounded-tr-[240px]"
			>
				<div class="flex h-full w-full flex-col justify-between text-center">
					<div>
						<h1 class="text-[28px] font-[700]">Sign-Up Complete!</h1>
						<p class="text-[18px] font-[400]">
							Welcome to <span class="text-[18px] font-[700]">ZigMe</span>! Your journey has
							officially begun.
						</p>
					</div>
					<div>
						<!-- Progress Text -->
						<div class="mt-4 text-start">
							<p class="font-semibold text-orange-500">You've Unlocked Level 1 !</p>
						</div>

						<!-- Progress Tracker -->
						<div class="relative w-full">
							<!-- Progress Line -->
							<div class="mb-4 flex gap-2">
								{#each levels as level, index}
									<!-- {#if index < levels.length - 1}
										<div 
											class="h-[2px] flex-1 rounded-[50px] {level.status === 'completed' ? 'bg-blue-500' : 'bg-slate-200'}"
										></div>
									{/if} -->
									<!-- <div class="border w-full"></div> -->
								{/each}
							</div>

							<!-- Progress Points -->
							<div class="relative flex items-center justify-between">
								{#each levels as level}
								<div class="w-full absolute border"></div>
									<div class="flex flex-col items-center gap-2">
										{#if level.hasAvatar}
											<svg
												xmlns="http://www.w3.org/2000/svg"
												width="24"
												height="25"
												viewBox="0 0 24 25"
												fill="none"
											>
												<rect
													y="0.5"
													width="24"
													height="24"
													rx="12"
													fill="#F1F1F1"
													fill-opacity="0.2"
												/>
												<path
													opacity="0.4"
													d="M18.3002 9.8C18.3002 11.105 17.9132 12.302 17.2472 13.301C16.2752 14.741 14.7362 15.758 12.9452 16.019C12.6392 16.073 12.3242 16.1 12.0002 16.1C11.6762 16.1 11.3612 16.073 11.0552 16.019C9.26419 15.758 7.7252 14.741 6.7532 13.301C6.0872 12.302 5.7002 11.105 5.7002 9.8C5.7002 6.317 8.5172 3.5 12.0002 3.5C15.4832 3.5 18.3002 6.317 18.3002 9.8Z"
													fill="#FBFBFB"
												/>
												<path
													d="M20.3079 18.3282L18.8259 18.6943C18.4936 18.7788 18.2332 19.0416 18.1613 19.3889L17.847 20.7688C17.6763 21.5198 16.7602 21.7451 16.2842 21.1537L12 16.0096L7.71582 21.1631C7.2398 21.7545 6.32369 21.5292 6.15304 20.7782L5.83868 19.3983C5.75785 19.051 5.49739 18.7788 5.17405 18.7037L3.6921 18.3376C3.00951 18.1686 2.76701 17.2768 3.26099 16.7606L6.76378 13.0996C7.73378 14.6015 9.26962 15.6623 11.0569 15.9345C11.3623 15.9908 11.6767 16.019 12 16.019C12.3233 16.019 12.6377 15.9908 12.9431 15.9345C14.7304 15.6623 16.2662 14.6015 17.2362 13.0996L20.739 16.7606C21.233 17.2675 20.9905 18.1592 20.3079 18.3282Z"
													fill="#FBFBFB"
												/>
												<path
													d="M12.5038 7.48929L13.0347 8.44727C13.1066 8.57716 13.2956 8.70706 13.4665 8.73142L14.4292 8.87754C15.041 8.96685 15.185 9.37277 14.7441 9.77058L13.9973 10.4444C13.8714 10.5581 13.7994 10.7773 13.8444 10.9396L14.0603 11.7758C14.2313 12.4334 13.8444 12.6932 13.1966 12.3441L12.2969 11.8651C12.135 11.7758 11.865 11.7758 11.7031 11.8651L10.8034 12.3441C10.1556 12.6851 9.76873 12.4334 9.93968 11.7758L10.1556 10.9396C10.1916 10.7854 10.1286 10.5581 10.0027 10.4444L9.2559 9.77058C8.81504 9.37277 8.959 8.97496 9.5708 8.87754L10.5335 8.73142C10.6954 8.70706 10.8844 8.57716 10.9563 8.44727L11.4872 7.48929C11.7481 6.96971 12.2159 6.96971 12.5038 7.48929Z"
													fill="#FBFBFB"
												/>
											</svg>
										{:else}
											<svg
												class="rounded-full {getProgressStyle(level.status)}"
												width="12"
												height="12"
												viewBox="0 0 12 13"
												fill="none"
												xmlns="http://www.w3.org/2000/svg"
											>
												<rect y="0.5" width="12" height="12" rx="6" fill="#FBFBFB" />
											</svg>
										{/if}
										<span class="text-[14px] font-[600] text-slate-200">{level.label}</span>
									</div>
								{/each}
							</div>
						</div>
					</div>

					<!-- Cards -->
					<div class="grid gap-8 md:grid-cols-2">
						<!-- Resume Builder Card -->
						<div
							class="relative flex cursor-pointer flex-col justify-between gap-[1rem] rounded-2xl bg-[#F1F1F10F] p-[12px]"
						>
							<p class="text-left text-[20px] font-[400]">
								Create a professional resume in minutes.
							</p>
							<div class="flex items-center justify-between rounded-[16px] bg-accent p-[20px]">
								<button class="text-2xl font-[600px] text-[#022F49]">Resume Builder</button>
								<svg
									width="11"
									height="21"
									viewBox="0 0 11 21"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M1.39502 19.7398L9.00169 12.1331C9.90002 11.2348 9.90002 9.76477 9.00169 8.86643L1.39502 1.25977"
										stroke="#022F49"
										stroke-width="2"
										stroke-miterlimit="10"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
								</svg>
							</div>
						</div>

						<!-- Work DNA Test Card -->
						<div
							class="relative flex cursor-pointer flex-col gap-[1rem] rounded-2xl bg-[#F1F1F10F] p-[12px]"
						>
							<p class="text-left text-[20px] font-[400]">
								Discover your strengths and get personalized insights.
							</p>
							<div class="flex items-center justify-between rounded-[16px] bg-accent p-[20px]">
								<button class="text-2xl font-[600px] text-[#022F49]">Work DNA Test</button>
								<svg
									width="11"
									height="21"
									viewBox="0 0 11 21"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M1.39502 19.7398L9.00169 12.1331C9.90002 11.2348 9.90002 9.76477 9.00169 8.86643L1.39502 1.25977"
										stroke="#022F49"
										stroke-width="2"
										stroke-miterlimit="10"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
								</svg>
							</div>
						</div>
					</div>
				</div>
			</div>
		</main>
	</div>
</div>
