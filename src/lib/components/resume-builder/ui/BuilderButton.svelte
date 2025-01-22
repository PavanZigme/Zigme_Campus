<script>
	let { onclick, children } = $props();
</script>

<button
	 class="p-[9px]  bg-[#F1F1F133]  text-white rounded-t-[8px] rounded-b-[8px] rounded-br-[20px]"
	{onclick}
>
	{@render children()}
</button> 