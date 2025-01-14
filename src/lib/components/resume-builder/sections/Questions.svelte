<script>
	import Input from "$lib/components/elements/Input.svelte";


  
  let answers = $state({
    strengths: '',
    weaknesses: '',
    achievements: '',
    goals: '',
    interests: ''
  });
</script>

<div class="flex flex-col gap-6">
  <div class="space-y-4">
    <Input
      label="What are your key strengths?"
      placeholder="Describe your main strengths"
      bind:value={answers.strengths}
    />
    
    <Input 
      label="What are your areas for improvement?"
      placeholder="Areas you're working on"
      bind:value={answers.weaknesses}
    />
    
    <Input 
      label="What's your biggest achievement?"
      placeholder="Share your proudest moment"
      bind:value={answers.achievements}
    />
    
    <Input 
      label="What are your career goals?"
      placeholder="Where do you see yourself in the future"
      bind:value={answers.goals}
    />
    
    <Input 
      label="What are your interests outside work?"
      placeholder="Hobbies and interests"
      bind:value={answers.interests}
    />
  </div>

  
</div> 