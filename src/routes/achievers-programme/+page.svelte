<script>
	import { slide } from 'svelte/transition';

	const studentImageUrl =
		'https://s3-alpha-sig.figma.com/img/812f/30e9/bf09f192f89d996aa14ac07a2fc454b6?Expires=1737331200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=A4pdRW1~NiB1C7aVoT5VLMKl93PqeZfGrfN12v89Q6-pNF6yZDJc~K6XVGoe9McQiE7NN4hsIH8FSNOd9-MQ8WcvFHD7Oyqs2NTumGgB~FBXDHPqiUgGrd~7bN7qjiZxJWAxlgmoEbNdkuFrfYMsW4Vfu6wJyfj4AXh~EmeNLv2kVncBaL4NmoSsNwHZbgcIz3ViciAKJXccAyg28GWeRi6qV1097xwjGAtQUrgKdzAp3ySAZTxLaU1F3q2w6KK~4MTYNBrw4sVj6NhBT97sPVY-ph-HZeVuVJuQbhpEobRjDmqWYJ3xwtQ~HoCO-PojgRSVjwSW3an4p4z5vxNSbQ__';

	import girlImg from '../../lib/utils/images/beautiful-smiling-young-girl-sitting-table-home 1.png';
	import zigmeLogo from '../../lib/utils/images/Group.png';

	// FAQ questions and answers
	let faqs = $state([
		{
			question: 'Is the job confirmed after completion of course?',
			answer:
				'Yes, upon successful completion of the course and meeting all requirements, the job is confirmed.'
		},
		{
			question: 'How much will I earn after this programme?',
			answer: 'You will start with a package of INR 2,50,000 per annum plus incentives.'
		},
		{
			question: 'What if I cannot pass the course for some reason?',
			answer:
				'In such a case, you may not be eligible for the job. However, support and guidance will be provided to help you complete the course.'
		}
	]);

	// Toggle the visibility of the answers
	let openIndexes = $state([]);

	const toggleAnswer = (index) => {
		if (openIndexes.includes(index)) {
			openIndexes = openIndexes.filter((i) => i !== index);
		} else {
			openIndexes = [...openIndexes, index];
		}
	};
</script>

<!-- Main Container with padding -->
<div class="min-h-screen bg-[#FFF4F3]">
	<!-- Content Container with max-width and center alignment -->
	<div class="mx-auto">
		<!-- Content Wrapper with internal padding -->
		<div class="rounded-lg lg:px-[120px]">
			<!-- Two Column Layout -->
			<div class="flex min-h-full w-full flex-col sm:flex-row">
				<!-- Left Column -->
				<div
					class="flex w-full flex-col justify-center gap-6 px-[22px] pt-[60px] sm:w-1/2 sm:px-[60px] sm:py-[25px]"
				>
					<!-- Logos -->
					<div>
						<div class="flex items-center gap-4">
							<img
								src="https://s3-alpha-sig.figma.com/img/b73e/74c0/77d08c126274995c1133e6b5ce230544?Expires=1737331200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=CCEOKTv8FFJji72mxd1j1NKX2~IwWSqul6oc0wcUcI-ggo3g9KGM5z~L2t4jdyuQ7R36Q-Ezk-GP~CyDnSaibqB2oJF7SD62efr0VPI6WjMnd7-eCAkl2EUWrORTvGiNgo5rA6OmExfnbYU8hqfM3j3Lyv50B8v9xyKhHU18ITN3m6ReqZf6OYee3UUoIX608gD9oqYEND~5rPQ8I7CKCxr7dcQi1th-9V~pu7Z0UTD6fy68WQmYMNyDqAxwLQyPRhARf6lBd0H29bwknO8mLCyMPC8CkvBAlYRQL9UjT86y-2bEbLm~4zKRt2eHiAWPDpDrQavEYu1v44RsruChBQ__"
								alt="HDFC Life"
								class="h-[30px] w-[60px]"
							/>
							<img src={zigmeLogo} alt="Zigme" class="h-5" />
						</div>

						<!-- Text Content -->
						<div class="space-y-4">
							<h2 class="text-[30px] font-[500] leading-tight lg:text-[36px]">
								Land your first job while earning with HDFC Life Smart Achievers Programme
							</h2>
							<p class="text-[14px] font-normal text-gray-600">
								From critical skills to technical topics, Zigme supports your professional
								development.
							</p>
						</div>
					</div>
					<div>
						<button class="rounded-[8px] bg-[#022F49] px-[30px] py-[11px] text-[16px] font-normal text-accent"
							>Apply now</button
						>
					</div>
				</div>

				<!-- Right Column -->
				<div class="flex w-full items-center justify-center pt-[20px] sm:w-1/2">
					<img
						style="object-fit: cover;"
						src={studentImageUrl}
						alt="Student"
						class="h-[333px] w-full sm:h-[500px]"
					/>
				</div>
			</div>

			<!-- Orange Card -->
			<div class=" bg-[#E6873C] p-6 text-white sm:rounded-[18px]">
				<div class="flex flex-col items-center gap-4">
					<div class="hidden flex-col items-center sm:flex">
						<!-- Education Row -->
						<div class="flex items-center gap-2">
							<span class="text-[26px] font-[700]">12 month Education @</span>
							<img
								class="h-[33px] w-[107px]"
								src="https://s3-alpha-sig.figma.com/img/248d/b639/c1cc907a9bc141052a098f02bca1dbdb?Expires=1737331200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=Qw3FtsLf8aVm2UhMTjF1tjbeh4DABVYcjs7igsHZ2rOTxJySsCBL4dNmADiDAhLNcVQ3ACYwjwbjCtIczgNqZf0y9uzO~mQVpjl5Iu~FIdx2srA3cF6q9e5b7F54WG731v1xVPxrhFHCpMkYpcGSVMDq9ScpNGSLXc5xPCcUhSKckhjZge-c4UZUnmYmAfrdAOyXjOlilAdwlyPMrMPOb8N7FhKcJqtea~1814uMWwVG690NiTznPmrnES1LxyPx8wBmZdSnLbAfjHqdbqh~vHFJeCz6TE3hdFM1ZexCVnyLo053xD5XjHjnQNHWz8WxGNh7uv0RN6bMtXS8F~WUBg__"
								alt="Manipal"
							/>
						</div>
						<div>
							<span class="text-[26px] font-[700]"> + </span>
						</div>

						<!-- Work Row -->
						<div class="flex items-center gap-2">
							<span class="text-[26px] font-[700]">Work opportunity @</span>
							<img
								src="https://s3-alpha-sig.figma.com/img/e54e/618d/6c2d9e2d49bc0cc7476804013812b000?Expires=1737331200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=b9sN3un~OAwNouyowmnYQJXdePfKsGJH6E~782cGqwxZbma28fFIRcnKTPzZrQbeJZw4LU0ees-K7xBuIAM-4L8cKIjtMsuSadrX3qHdnK7ipPgUIXxCiOZLXBFNCVqkwrVd3a1L~3SKtr4C2Si2M0byczrPKZGuEvnRGNgruARMa4k11ucwZVE0PA3ZyTtCO18GI0cvPqAtMwT47hiScDS3n8dVw3qZPcwOuWlGI2IYc8hrdtTArIxOQci1Bk8uT5aswQYuIDn3KxpSwmtAMG~fVzGWfxvND6cOIb2kqg6GpxV~1VJ4RuETzM5daeyRVT-y82mKqrQH~iBV-6NQ5Q__"
								alt="HDFC Life"
								class="h-[39px] w-[60px]"
							/>
						</div>
					</div>
					<div class="block text-[23px] font-[700] sm:hidden">
						12 month Education <br /> + Work opportunity
					</div>

					<p class="text-center text-[14px] font-normal md:text-[16px]">
						Get a PG Certificate in Life Insurance from Manipal University in 12 months,<br />
						while also making <span class="font-bold">₹41,500 pm!!!</span> in the process!
					</p>
				</div>
			</div>
			<div>
				<div class="text-center">
					<h3 class="mt-[1rem] text-[20px] font-[700]">How does this work?</h3>
				</div>
				<div class="mt-[50px] flex flex-col gap-[3rem] px-[50px]">
					<div
						class="rounded-[8px] border-t-4 border-[#ED1C24] bg-[#FFFFFF] px-[20px] py-[20px] text-center sm:px-[120px]"
					>
						<p class="text-[18px] font-medium sm:text-[22px]">Apply to join the Programme</p>
						 
					</div>
					<div
						class="rounded-[8px] border-t-4 border-[#ED1C24] bg-[#FFFFFF] px-[20px] py-[20px] text-center sm:px-[120px]"
					>
						<p class="text-[18px] font-medium sm:text-[22px]">
							Once accepted, you pay INR <span class="font-medium text-[#C31910]"> 88,500 </span> to
							join the programme
						</p>
					</div>
					<div
						class="rounded-[8px] border-t-4 border-[#ED1C24] bg-[#FFFFFF] px-[20px] py-[20px] text-center sm:px-[120px]"
					>
						<p class="text-[18px] font-medium sm:text-[22px]">
							After completing
							<span class="font-medium text-[#C31910]"> 4 months of virtual training,</span>
							you will receive 2 months of on-the-job training with a stipend of
							<span class="font-medium text-[#C31910]"> ₹5,000 per month.</span>
						</p>
					</div>
					<div
						class="rounded-[8px] border-t-4 border-[#ED1C24] bg-[#FFFFFF] px-[20px] py-[20px] text-center sm:px-[120px]"
					>
						<p class="text-[18px] font-medium sm:text-[22px]">
							Join HDFC Life on a <span class="font-medium text-[#C31910]">
								6 month full-time internship</span
							>
							& get paid
							<span class="font-medium text-[#C31910]"> INR 20,000/- pm</span>
						</p>
					</div>
					<div
						class="flex flex-col items-center gap-[2rem] rounded-[8px] border-t-4 border-[#ED1C24] bg-[#FFFFFF] px-[20px] py-[20px] sm:px-[120px]"
					>
						<p class="text-[18px] font-medium sm:text-[22px]">On successful completion:</p>
						<ul class="list-disc pl-[20px]">
							<li class=" text-[18px] font-medium sm:text-[22px]">
								Earn your <span class="font-medium text-[#C31910]">
									PG Certificate in Life Insurance
								</span>
							</li>
							<li class="text-[18px] font-medium sm:text-[22px]">
								Accept your standing offer worth
								<span class="font-medium text-[#C31910]"> INR 4,00,000 + </span>
								incentives with HDFC Life
							</li>
						</ul>
						<div>
							<img
								class="h-[102px] w-full"
								src="https://s3-alpha-sig.figma.com/img/53ff/425a/236c4da87ac37e3da727e8c5bcacb507?Expires=1737331200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=kDlehPcH0Q4JYcSCbof9bHdvYyh3iyeHCbx9APLKE4LIysi3dx71g5Dr6EbBZvC5NN039hujAuwrEfcrRd5Gob2Wj7gSSX6t-UbTzKWPHOUGMk63AXj3E-KjHKFj8LQ10UMLy5HmfB9gMJs-7LPD8irDGj1yX0CX7leszSriHAEW29pjF0WA9ScRSf1iEldK4gDyT2X1EryronOFbg3GGHuUsVW-m-zJ7nxUe6~kYE~48~VLR6m2S68A0FVskJojygORvDhSQC3ihijA4wY4PaA8YfejKitEZsVs6kHGndLv6VYReot5xlaBvmBwj6gqO0Vzk24kLSn53TvA~lNViQ__"
								alt="fire"
							/>
						</div>
					</div>
					<div class="text-center">
						<button class="rounded-[8px] bg-[#022F49] px-[30px] py-[11px] text-[16px] font-normal text-accent"
							>Apply now</button
						>
					</div>
				</div>
			</div>
		</div>
		<div class="mt-[1rem] h-[400px] w-full bg-accent">
			<div class="mx-auto mt-12 max-w-3xl rounded-md bg-gray-50 p-6 shadow-md">
				<h2 class="mb-6 text-center text-2xl font-bold">Frequently asked questions</h2>

				<div class="space-y-4">
					{#each faqs as { question, answer }, index}
						<div class="rounded-md border">
							<button
								class="flex w-full justify-between p-4 text-left text-lg font-medium text-gray-700"
								onclick={() => toggleAnswer(index)}
							>
								{question}
								<span
									class="transform transition-transform duration-200"
									class:rotate-180={openIndexes.includes(index)}
								>
									⌄
								</span>
							</button>
							{#if openIndexes.includes(index)}
								<div transition:slide class="border-t p-4 text-gray-600">
									{answer}
								</div>
							{/if}
						</div>
					{/each}
				</div>

				<div class="mt-8">
					<h3 class="text-xl font-semibold">Any other questions? Ask right away:</h3>
					<div class="mt-4 flex items-center space-x-4">
						<input
							type="text"
							placeholder="Type your question here"
							class="flex-grow rounded-md border p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
						<button
							class="rounded-md bg-[#B01016] px-6 py-2 text-white transition hover:bg-red-900"
						>
							Ask Now
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	/* :global(body) {
		margin: 0;
		padding: 0;
		background: #fff5f5;
	} */
</style>
