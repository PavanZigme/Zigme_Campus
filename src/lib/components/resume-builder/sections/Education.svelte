<script>
	import Input from '$lib/components/elements/Input.svelte';

	import Dropdown from '$lib/components/elements/Dropdown.svelte';

	let selectedCourse = $state('');
	let courses = ['Item 1', 'Item 2', 'Item 3'];

	let educationList = $state([
		{
			college: '',
			course: '',
			cgpa: '',
			startDate: '',
			endDate: '',
			isCurrentlyStudying: false
		}
	]);

	function addEducation() {
		educationList = [
			...educationList,
			{
				college: '',
				course: '',
				cgpa: '',
				startDate: '',
				endDate: '',
				isCurrentlyStudying: false
			}
		];
	}

	function removeEducation(index) {
		educationList = educationList.filter((_, i) => i !== index);
	}
</script>

<div class="p-6">
	{#each educationList as education, index}
		<div class="grid grid-cols-3 gap-[36px]">
			<div class="col-span-2">
				<div class="flex justify-between gap-[10px]">
					<Input
						className="w-full"
						label="College"
						placeholder="Enter College"
						bind:value={education.college}
					/>
					<Dropdown
						className="w-full"
						label="Course"
						placeholder="Select Course"
						options={courses}
						bind:value={selectedCourse}
					/>
					<Input
						className="w-full"
						label="CGPA"
						placeholder="Enter CGPA"
						bind:value={education.cgpa}
					/>
				</div>
				<div class="flex w-full justify-between gap-[10px]">
					<div class="w-full">
						<label for="startDate" class="mb-[6px] text-sm text-slate-200">Start</label>
						<div class="relative mt-[6px]">
							<input
								type="date"
								class="w-full rounded-[12x] bg-[#1C4766] p-[12px] text-white"
								bind:value={education.startDate}
							/>
						</div>
					</div>

					<div class="w-full">
						<label for="endDate" class="text-sm text-slate-200">End</label>
						<div class="relative mt-[6px]">
							<input
								type="date"
								class="w-full bg-[#1C4766] p-[12px] text-white"
								disabled={education.isCurrentlyStudying}
								bind:value={education.endDate}
							/>
						</div>
					</div>
				</div>

				<div class="flex items-center gap-2">
					<div>
						<input
							type="checkbox"
							id="currently-studying-{index}"
							bind:checked={education.isCurrentlyStudying}
							class="rounded border-slate-400"
						/>
						<label for="currently-studying-{index}" class="text-sm text-slate-200">
							Currently Studying
						</label>
					</div>
					<div>
						{#if educationList.length > 1}
							<button
								class="mt-4 text-red-400 hover:text-red-300"
								onclick={() => removeEducation(index)}
							>
								Remove
							</button>
						{/if}

						<button class="mb-6 text-blue-500 hover:text-blue-400" onclick={addEducation}>
							+ Add
						</button>
					</div>
				</div>
			</div>
			<div class="col-span-1">
				<div>
					<div>
						<span>iit bombay</span>
						<span
							>Lorem ipsum dolor sit amet consectetur adipisicing elit. Impedit placeat ab
							consequuntur.</span
						>

						<span>Lorem ipsum dolor sit amet.</span>
					</div>
				</div>
			</div>
		</div>
	{/each}
</div>
