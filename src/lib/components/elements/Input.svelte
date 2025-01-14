<script>
  let {
    type = "text",
    placeholder = "",
    label = "",
    value = $bindable(),
    required = false,
    name = "",
    className =""
  } = $props();
</script>

<div class="mb-4">
  {#if label}
    <label 
      for={name} 
      class="text-start block text-[#FBFBFB] text-sm font-normal mb-[6px]"
    >
      {label}
      {#if required}
        <span class="text-red-500 ml-1">*</span>
      {/if}
    </label>
  {/if}
  
  <input
    {type}
    {name}
    {placeholder}
    {required}
    value={value}
    class="{className} min-w-[260px] max-w-full bg-[#F1F1F10F] rounded-[12px] border border-white/10 text-white 
           placeholder:text-[#828BA2] p-[12px]
           focus:outline-none focus:border-white/30 focus:bg-black/30
           transition-all duration-200"
  />
</div>  