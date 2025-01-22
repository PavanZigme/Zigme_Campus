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
			subtitle: 'Your story is what makes you unique. Let’s make sure employers see it.'
		},
		6: {
			title: 'Knowing You',
			subtitle:
				'Everyone has a unique story! Your experiences, no matter how small, can inspire future employers.'
		},
		7: {
			title: 'Knowing You',
			subtitle:
				'Don’t miss out—your story could be the one thing that gets you noticed by recruiters!'
		},
		8: {
			title: 'Knowing You',
			subtitle:
				'Your unique story can make employers remember you! Let’s make your resume shine—answer these quick questions!'
		},
		9: { title: 'Skills & Languages', subtitle: 'Showcase your strengths.' },
		10: { title: 'Video Introduction', subtitle: 'Your Moment to Shine!' }
	};

	// Add a computed property for progress
	let progress = $derived(Object.values($resumeBuilderStore.stepsCompleted).filter(Boolean).length);

	// console.log($resumeBuilderStore);
</script>

<!-- Add progress indicator -->
<!-- <div class="mb-4">
	<p>Progress: {progress} of {totalSteps} steps completed</p>
</div> -->

<ResumeLayout
	title={stepTitles[$resumeBuilderStore.currentStep].title}
	subtitle={stepTitles[$resumeBuilderStore.currentStep].subtitle}
	{totalSteps}
>
	{#if $resumeBuilderStore.currentStep === 1}
		<Education />
	{:else if $resumeBuilderStore.currentStep === 2}
		<Experience />
	{:else if $resumeBuilderStore.currentStep === 3}
		<Achievements />
	{:else if $resumeBuilderStore.currentStep === 4}
		<KnowingYou />
	{:else if $resumeBuilderStore.currentStep === 5}
		<Question2 />
	{:else if $resumeBuilderStore.currentStep === 6}
		<Question3 />
	{:else if $resumeBuilderStore.currentStep === 7}
		<Question4 />
	{:else if $resumeBuilderStore.currentStep === 8}
		<Question5 />
	{:else if $resumeBuilderStore.currentStep === 9}
		<Skills />
	{:else if $resumeBuilderStore.currentStep === 10}
		<VideoIntro />
	{/if}
</ResumeLayout>
