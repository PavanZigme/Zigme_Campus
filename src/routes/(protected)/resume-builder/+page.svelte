<script>
	// import ResumeLayout from '$lib/components/resume-builder/common/ResumeLayout.svelte';
	// import Education from '$lib/components/resume-builder/Education.svelte';
	// import Experience from '$lib/components/resume-builder/Experience.svelte';
	// import Skills from '$lib/components/resume-builder/Skills.svelte';
	// import KnowingYou from '$lib/components/resume-builder/KnowingYou.svelte';
	// import Questions from '$lib/components/resume-builder/Questions.svelte';
	// import VideoIntro from '$lib/components/resume-builder/VideoIntro.svelte';
	// import Achievements from '$lib/components/resume-builder/Achievements.svelte';


  import ResumeLayout from '$lib/components/resume-builder/layout/ResumeLayout.svelte';
  import Education from '$lib/components/resume-builder/sections/Education.svelte';
  import Experience from '$lib/components/resume-builder/sections/Experience.svelte';
  import Skills from '$lib/components/resume-builder/sections/Skills.svelte';
  import KnowingYou from '$lib/components/resume-builder/sections/KnowingYou.svelte';
  import Questions from '$lib/components/resume-builder/sections/Questions.svelte';
  import VideoIntro from '$lib/components/resume-builder/sections/VideoIntro.svelte';
  import Achievements from '$lib/components/resume-builder/sections/Achievements.svelte';



	let currentStep = $state(1);
	const totalSteps = 7;

	// Component mapping for dynamic rendering
	const stepComponents = {
		1: KnowingYou,
		2: Education,
		3: Experience,
		4: Skills,
		5: Achievements,
		6: Questions,
		7: VideoIntro
	};

	// Step titles mapping
	const stepTitles = {
		1: { title: 'Education', subtitle: "Tell us where you've honed your skills." },
		2: { title: 'Experience', subtitle: 'Share your professional journey.' },
		3: { title: 'Achievements', subtitle: 'Share your proud moments.' },
		4: { title: 'Questions', subtitle: 'Help us know you better.' },
		5: { title: 'Getting to Know You', subtitle: "Let's start with your basic information." },
		6: { title: 'Skills & Languages', subtitle: 'List your technical and soft skills.' },
		7: { title: 'Video Introduction', subtitle: 'Make a lasting impression.' }
	};
</script>

<ResumeLayout
	title={stepTitles[currentStep].title}
	subtitle={stepTitles[currentStep].subtitle}
	{totalSteps}
	bind:currentStep
>
	{#if currentStep === 1}
		<Education />
	{:else if currentStep === 2}
		<Experience />
	{:else if currentStep === 3}
		<Achievements />
	{:else if currentStep === 4}
		<Skills />
	{:else if currentStep === 5}
		<Questions />
	{:else if currentStep === 6}
		<KnowingYou />
	{:else if currentStep === 7}
		<VideoIntro />
	{/if}
</ResumeLayout>
