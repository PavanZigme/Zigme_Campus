<script>
  let { 
    title = "", 
    subtitle = "", 
    currentStep = $bindable(), 
    totalSteps = 7,
    children 
  } = $props();

  function nextStep() {
    if (currentStep < totalSteps) currentStep++;
  }

  function previousStep() {
    if (currentStep > 1) currentStep--;
  }
</script>

<div class="h-screen w-full bg-[#E0E6E9]">
  <div class="mx-auto flex h-full flex-col">
    <div class="relative">
      <div class="z-50 mt-[12px] p-[48px]">
        <h2 class="text-[48px] font-[600]">{title}</h2>
        <p class="text-[28px] font-[500] text-[#828BA2]">{subtitle}</p>
      </div>
      <!-- Your existing SVG icon -->
    </div>

    <!-- Form Section -->
    <main class="relative h-screen">
      <div class="flex h-full flex-col justify-between gap-[12px] rounded-t-[56px] bg-[#022F49] p-[24px] text-white sm:p-[40px]">
        {@render children()}
        
        <!-- Navigation Buttons -->
        <div class="flex justify-between mt-4">
          <button 
            class="px-4 py-2 bg-gray-600 rounded {currentStep === 1 ? "invisible":""} disabled:opacity-50"
            onclick={previousStep}
            disabled={currentStep === 1}
          >
            Previous
          </button>
          <button 
            class="px-4 py-2 bg-blue-600 rounded disabled:opacity-50"
            onclick={nextStep}
            disabled={currentStep === totalSteps}
          >
            {currentStep === totalSteps ? 'Finish' : 'Next'}
          </button>
        </div>
      </div>
    </main>
  </div>
</div> 