<script>
	import Input from '$lib/components/elements/Input.svelte';

	let project = $state({
		title: '',
		description: '',
		technologies: '',
		link: '',
		startDate: '',
		endDate: ''
	});
</script>

<div class="flex flex-col gap-6">
	<Input label="Project Title" placeholder="Enter Project Title" bind:value={project.title} />

	<Input
		label="Description"
		placeholder="Enter Project Description"
		bind:value={project.description}
	/>

	<Input
		label="Technologies Used"
		placeholder="Enter Technologies (comma separated)"
		bind:value={project.technologies}
	/>

	<Input label="Project Link" placeholder="Enter Project URL" bind:value={project.link} />

	<div class="grid grid-cols-2 gap-4">
		<Input type="date" label="Start Date" bind:value={project.startDate} />

		<Input type="date" label="End Date" bind:value={project.endDate} />
	</div>
</div>
