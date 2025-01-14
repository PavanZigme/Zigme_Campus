<script>
	const {
		text = 'Button',
		type = 'button',
		disabled = false,
		bgColor = '#FFF',
		textColor = '#022F49',
		textClasses = 'text-[14px] font-[500]',
		width = '120px',
		onClick = () => {}
	} = $props();
</script>

<button {type} {disabled} class="relative" onclick={onClick}>
	<svg style:width height="40" viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path
			d="M0 9.9101C0 4.4369 4.43691 0 9.91011 0H117.543C119.277 0 120.189 2.05434 119.028 3.34057L110.483 12.8006L117.281 16.8177C118.426 17.4942 118.604 19.0791 117.638 19.9928L97.435 39.0937C97.0636 39.4448 96.572 39.6404 96.061 39.6404H9.91012C4.43691 39.6404 0 35.2035 0 29.7303V9.9101Z"
			fill={bgColor}
		/>
	</svg>
	<svg
		class="absolute left-[90px] top-[4px]"
		width="20"
		height="32"
		viewBox="0 0 20 33"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M12.6932 0.466265L2.64065 12.6073C2.40559 12.9054 2.47061 13.3525 2.77569 13.5601L9.39734 17.9673L0 32.4609L18.6096 15.2527L10.6376 10.9892L20 0.460938H12.6882L12.6932 0.466265Z"
			fill="#3C8E98"
		/>
	</svg>

	<div class="absolute left-[20px] top-[9px] {textClasses}" style:color={textColor}>
		{text}
	</div>
</button>
