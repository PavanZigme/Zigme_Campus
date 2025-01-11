<script>
	let { onClick  } = $props();
    
</script>

<button
    class="mt-3 text-center text-sm text-gray-300 hover:text-white"
    aria-label="Go back"
    onclick={onClick}
>
    <svg
        width="36"
        height="36"
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M21.0898 10.0799L14.5698 16.5999C13.7998 17.3699 13.7998 18.6299 14.5698 19.3999L21.0898 25.9199"
            stroke="#828BA2"
            stroke-width="1.8"
            stroke-miterlimit="10"
            stroke-linecap="round"
            stroke-linejoin="round"
        />
    </svg>
</button> 