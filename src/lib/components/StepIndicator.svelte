<script>
  
	let { currentStep , totalSteps} = $props();

</script>

<div class="flex items-center justify-between py-[14px] lg:hidden">
    {#each Array(totalSteps) as _, index}
        <div
            class:h-[8px]={index + 1 === currentStep}
            class="mx-1 h-[4px] flex-1 rounded-[50px]
            {index + 1 <= currentStep ? 'bg-accent' : ' bg-[#F1F1F133]'}
            "
        ></div>
    {/each}
</div>

<div class="mb-4 mt-2 hidden items-center justify-between lg:flex">
    {#each Array(totalSteps) as _, index}
        <div
            class="h-[12px] w-[12px] rounded-full border"
            class:bg-accent={index + 1 <= currentStep}
            class:bg-[#F1F1F10F]={index > currentStep}
            class:border-accent={index === currentStep}
        ></div>
        {#if index < totalSteps - 1}
            <div
                class="mx-1 h-[1px] flex-1 rounded-full"
                class:bg-[#F1F1F133]={index + 1 <= currentStep}
                class:bg-[#F1F1F10F]={index + 1 > currentStep}
            ></div>
        {/if}
    {/each}
</div> 