<script>

	import Input from "$lib/components/elements/Input.svelte";


  
  let experience = $state({
    companyName: '',
    position: '',
    location: '',
    startDate: '',
    endDate: '',
    description: ''
  });
</script>

<div class="flex flex-col gap-6">
  <Input
    label="Company Name"
    placeholder="Enter Company Name"
    bind:value={experience.companyName}
  />
  
  <Input 
    label="Position"
    placeholder="Enter Position"
    bind:value={experience.position}
  />
  
  <Input 
    label="Location"
    placeholder="Enter Location"
    bind:value={experience.location}
  />
  
  <div class="grid grid-cols-2 gap-4">
    <Input 
      type="date"
      label="Start Date"
      bind:value={experience.startDate}
    />
    
    <Input 
      type="date"
      label="End Date"
      bind:value={experience.endDate}
    />
  </div>

  
</div> 