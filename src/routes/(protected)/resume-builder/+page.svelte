<script>
	import ResumeLayout from '$lib/components/resume-builder/layout/ResumeLayout.svelte';
	import Education from '$lib/components/resume-builder/sections/Education.svelte';
	import Experience from '$lib/components/resume-builder/sections/Experience.svelte';
	import Skills from '$lib/components/resume-builder/sections/Skills.svelte';
	import KnowingYou from '$lib/components/resume-builder/sections/KnowingYou.svelte';
	import VideoIntro from '$lib/components/resume-builder/sections/VideoIntro.svelte';
	import Achievements from '$lib/components/resume-builder/sections/Achievements.svelte';
	import Question2 from '$lib/components/resume-builder/sections/Question2.svelte';
	import Question3 from '$lib/components/resume-builder/sections/Question3.svelte';
	import Question4 from '$lib/components/resume-builder/sections/Question4.svelte';
	import Question5 from '$lib/components/resume-builder/sections/Question5.svelte';

	import { resumeBuilderStore } from '$lib/stores/resumeBuilder';
	import { showLoader, hideLoader } from '$lib/stores/loader';
	import { onMount } from 'svelte';

	// let currentStep = $state(1);
	const totalSteps = 10;

	// Step titles mapping
	const stepTitles = {
		1: { title: 'Education', subtitle: "Tell us where you've honed your skills." },
		2: { title: 'Experience', subtitle: 'What experience has shaped you?' },
		3: { title: 'Achievements', subtitle: 'Achievements That Set You Apart' },
		4: { title: 'Knowing You', subtitle: 'You can always come back and edit your story later!' },
		5: {
			title: 'Knowing You',
			subtitle: "Your story is what makes you unique. Let's make sure employers see it."
		},
		6: {
			title: 'Knowing You',
			subtitle:
				'Everyone has a unique story! Your experiences, no matter how small, can inspire future employers.'
		},
		7: {
			title: 'Knowing You',
			subtitle:
				"Don't miss out—your story could be the one thing that gets you noticed by recruiters!"
		},
		8: {
			title: 'Knowing You',
			subtitle:
				"Your unique story can make employers remember you! Let's make your resume shine—answer these quick questions!"
		},
		9: { title: 'Skills & Languages', subtitle: 'Showcase your strengths.' },
		10: { title: 'Video Introduction', subtitle: 'Your Moment to Shine!' }
	};

	// Use derived state for current step
	const currentStep = $derived($resumeBuilderStore.currentStep);

	// Add a computed property for progress
	let progress = $derived(Object.values($resumeBuilderStore.stepsCompleted).filter(Boolean).length);

	showLoader();
	onMount(() => {
		setTimeout(() => {
			hideLoader();
		}, 200);
	});
	// console.log($resumeBuilderStore);
</script>

<ResumeLayout
	title={stepTitles[currentStep]?.title}
	subtitle={stepTitles[currentStep]?.subtitle}
	{totalSteps}
>
	<!-- Use key to force component recreation -->
	{#key currentStep}
		{#if currentStep === 1}
			<Education />
		{:else if currentStep === 2}
			<Experience />
		{:else if currentStep === 3}
			<Achievements />
		{:else if currentStep === 4}
			<KnowingYou />
		{:else if currentStep === 5}
			<Question2 />
		{:else if currentStep === 6}
			<Question3 />
		{:else if currentStep === 7}
			<Question4 />
		{:else if currentStep === 8}
			<Question5 />
		{:else if currentStep === 9}
			<Skills />
		{:else if currentStep === 10}
			<VideoIntro />
		{/if}
	{/key}
</ResumeLayout>
