<script>
	import Input from '$lib/components/elements/Input.svelte';

	let skills = $state({
		technicalSkills: [],
		softSkills: [],
		currentSkill: ''
	});

	function addSkill(type) {
		if (skills.currentSkill.trim()) {
			if (type === 'technical') {
				skills.technicalSkills = [...skills.technicalSkills, skills.currentSkill];
			} else {
				skills.softSkills = [...skills.softSkills, skills.currentSkill];
			}
			skills.currentSkill = '';
		}
	}

	function removeSkill(type, index) {
		if (type === 'technical') {
			skills.technicalSkills = skills.technicalSkills.filter((_, i) => i !== index);
		} else {
			skills.softSkills = skills.softSkills.filter((_, i) => i !== index);
		}
	}
</script>

<div class="flex flex-col gap-6">
	<div class="space-y-4">
		<h3 class="text-xl font-semibold">Technical Skills</h3>
		<div class="flex gap-2">
			<Input placeholder="Add a technical skill" bind:value={skills.currentSkill} />
			<button class="rounded-lg bg-blue-500 px-4" onclick={() => addSkill('technical')}>
				Add
			</button>
		</div>
		<div class="flex flex-wrap gap-2">
			{#each skills.technicalSkills as skill, index}
				<div class="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1">
					{skill}
					<button class="text-red-400" onclick={() => removeSkill('technical', index)}> × </button>
				</div>
			{/each}
		</div>
	</div>
</div>
