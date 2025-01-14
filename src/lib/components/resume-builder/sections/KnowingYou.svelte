<script>
	import Input from "$lib/components/elements/Input.svelte";

  
  
  let profile = $state({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    linkedIn: '',
    portfolio: ''
  });
</script>

<div class="flex flex-col gap-6">
  <Input
    label="Full Name"
    placeholder="Enter your full name"
    bind:value={profile.fullName}
  />
  
  <Input 
    type="email"
    label="Email"
    placeholder="Enter your email"
    bind:value={profile.email}
  />
  
  <Input 
    type="tel"
    label="Phone Number"
    placeholder="Enter your phone number"
    bind:value={profile.phone}
  />
  
  <Input 
    label="Location"
    placeholder="City, Country"
    bind:value={profile.location}
  />
  
  <Input 
    label="LinkedIn Profile"
    placeholder="LinkedIn URL"
    bind:value={profile.linkedIn}
  />
  
  <Input 
    label="Portfolio Website"
    placeholder="Portfolio URL (optional)"
    bind:value={profile.portfolio}
  />

  
</div> 