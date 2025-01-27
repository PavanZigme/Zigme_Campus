<script>
	import { SVG } from '$lib/utils/svgs';

	let {
		value = null,
		showDoneButton = false,
		placeholder = 'DD/MM/YYYY',
		disableFutureDates = false,
		disablePastDates = false,
		onDateChange = (date) => {}, // Default empty callback
		name = '',
		id = ''
	} = $props();

	// If no id is provided, generate one from the name
	$effect(() => {
		if (!id && name) {
			id = name;
		}
	});

	const initialDate = parseInputDate(value);
	let selectedDate = $state(initialDate);
	let currentMonth = $state(initialDate ? new Date(initialDate) : new Date());
	let isOpen = $state(false);
	let pickerElement = $state(null);
	let calendarElement = $state(null);
	let position = $state('bottom');
	let inputValue = $state(initialDate ? formatInputDate(initialDate) : '');

	// Get today's date without time for comparison
	const today = new Date();
	today.setHours(0, 0, 0, 0);

	function isDateDisabled(date) {
		if (!date) return true;

		const compareDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), date);
		compareDate.setHours(0, 0, 0, 0);

		if (disableFutureDates && compareDate > today) {
			return true;
		}

		if (disablePastDates && compareDate < today) {
			return true;
		}

		return false;
	}

	// Watch for external value changes
	$effect(() => {
		if (value !== null) {
			const newDate = parseInputDate(value);
			selectedDate = newDate;
			currentMonth = newDate ? new Date(newDate) : new Date();
			inputValue = newDate ? formatInputDate(newDate) : '';
		}
	});

	function handleManualInput(event) {
		let input = event.target.value;

		// Remove any non-digit characters
		const numbersOnly = input.replace(/\D/g, '');

		// Format the input with slashes
		if (numbersOnly.length > 0) {
			let formattedInput = '';
			if (numbersOnly.length <= 1) {
				formattedInput = numbersOnly;
			} else if (numbersOnly.length <= 3) {
				formattedInput = `${numbersOnly.slice(0, 2)}/${numbersOnly.slice(2)}`;
			} else {
				formattedInput = `${numbersOnly.slice(0, 2)}/${numbersOnly.slice(2, 4)}/${numbersOnly.slice(4, 8)}`;
			}
			input = formattedInput;
		}

		// Update the input value
		inputValue = input;

		// Check if input matches DD/MM/YYYY format
		const dateRegex = /^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;

		if (dateRegex.test(input)) {
			const [day, month, year] = input.split('/').map(Number);
			const newDate = new Date(year, month - 1, day);

			// Validate if it's a real date and not disabled
			if (newDate.getDate() === day && newDate.getMonth() === month - 1 && !isDateDisabled(day)) {
				selectedDate = newDate;
				currentMonth = new Date(newDate);
				onDateChange(newDate);
			}
		}
	}

	// function formatSelectedDate(date) {
	// 	if (!date) return '';
	// 	return date.toLocaleDateString('en-GB', {
	// 		day: 'numeric',
	// 		month: 'short',
	// 		year: 'numeric'
	// 	});
	// }

	// Add and remove click outside listener
	$effect(() => {
		if (isOpen) {
			updatePosition();
		}
	});

	function updatePosition() {
		if (!pickerElement || !calendarElement) return;

		const rect = pickerElement.getBoundingClientRect();
		const calendarHeight = calendarElement.offsetHeight;
		const spaceBelow = window.innerHeight - rect.bottom;
		const spaceAbove = rect.top;

		position = spaceBelow >= calendarHeight || spaceBelow >= spaceAbove ? 'bottom' : 'top';
	}

	function toggleCalendar() {
		isOpen = !isOpen;
	}

	const daysOfWeek = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
	const months = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December'
	];

	function getDaysInMonth(date) {
		return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
	}

	function getFirstDayOfMonth(date) {
		return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
	}

	function generateCalendarDays() {
		const daysInMonth = getDaysInMonth(currentMonth);
		let firstDay = getFirstDayOfMonth(currentMonth);
		firstDay = firstDay === 0 ? 6 : firstDay - 1;
		const days = [];

		for (let i = 0; i < firstDay; i++) {
			days.push(null);
		}

		for (let i = 1; i <= daysInMonth; i++) {
			days.push(i);
		}

		return days;
	}

	function previousMonth() {
		currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1);
	}

	function nextMonth() {
		currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1);
	}

	function previousYear() {
		currentMonth = new Date(currentMonth.getFullYear() - 1, currentMonth.getMonth());
	}

	function nextYear() {
		currentMonth = new Date(currentMonth.getFullYear() + 1, currentMonth.getMonth());
	}

	function selectDate(day) {
		if (day && !isDateDisabled(day)) {
			const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
			selectedDate = newDate;
			inputValue = formatInputDate(newDate);
			onDateChange(formatInputDate(newDate));
			isOpen = false;
		}
	}

	// function formatDate(date) {
	//   return date.toLocaleDateString('en-US', {
	//     year: 'numeric',
	//     month: 'short',
	//     day: 'numeric'
	//   });
	// }

	function parseInputDate(value) {
		if (!value) return null;
		if (value instanceof Date) return value;
		if (typeof value === 'string') {
			// Check if date is in DD/MM/YYYY format
			const parts = value.split('/');
			if (parts.length === 3) {
				const [day, month, year] = parts.map(Number);
				return new Date(year, month - 1, day);
			}
			return new Date(value);
		}
		return null;
	}

	function formatInputDate(date) {
		if (!date) return '';
		if (!(date instanceof Date) || isNaN(date)) return '';

		const day = date.getDate().toString().padStart(2, '0');
		const month = (date.getMonth() + 1).toString().padStart(2, '0');
		const year = date.getFullYear();

		return `${day}/${month}/${year}`;
	}

	function handleDone() {
		onDateChange(selectedDate);
		isOpen = false;
	}
</script>

<div class="relative w-full sm:max-w-md" bind:this={pickerElement}>
	<div class="flex gap-2">
		<div class="relative flex-1">
			<input
				type="text"
				{placeholder}
				id={id || name || 'datepicker-input'}
				name={name || 'datepicker-input'}
				class="w-full cursor-pointer rounded-[12px] border bg-[#F1F1F133] p-[12px] focus:outline-none focus:ring-2 focus:ring-orange-500"
				value={inputValue}
				oninput={handleManualInput}
				onclick={toggleCalendar}
				aria-label={placeholder}
			/>
			<button
				type="button"
				class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
				onclick={toggleCalendar}
				aria-label="Toggle calendar"
			>
				{@html SVG.calenderIcon}
			</button>
		</div>
		{#if showDoneButton}
			<button
				onclick={handleDone}
				class="rounded-lg bg-orange-500 px-6 py-2 text-white hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
			>
				Done
			</button>
		{/if}
	</div>

	{#if isOpen}
		<div
			bind:this={calendarElement}
			class="absolute {position === 'bottom'
				? 'top-full mt-1'
				: 'bottom-full mb-1'} left-0 z-50 w-full min-w-[280px] max-w-[320px] rounded-lg border bg-white p-4 shadow-lg"
		>
			<div class="mb-6 flex flex-col items-center justify-between gap-[1rem] sm:flex-row">
				<div class="flex items-center justify-between">
					<button
						class="p-1 text-gray-400 hover:text-gray-600 focus:text-gray-600 focus:outline-none"
						onclick={previousMonth}
						aria-label="Previous month"
					>
						{@html SVG.rightArrow}
					</button>
					<span class="min-w-[80px] text-center font-medium text-orange-500">
						{months[currentMonth.getMonth()]}
					</span>
					<button
						class="rotate-180 p-1 text-gray-400 hover:text-gray-600 focus:text-gray-600 focus:outline-none"
						onclick={nextMonth}
						aria-label="Next month"
					>
						{@html SVG.rightArrow}
					</button>
				</div>
				<div class="flex items-center justify-between">
					<button
						class="p-1 text-gray-400 hover:text-gray-600 focus:text-gray-600 focus:outline-none"
						onclick={previousYear}
						aria-label="Previous year"
					>
						{@html SVG.rightArrow}
					</button>
					<span class="min-w-[60px] text-center font-medium text-orange-500">
						{currentMonth.getFullYear()}
					</span>
					<button
						class="rotate-180 p-1 text-gray-400 hover:text-gray-600 focus:text-gray-600 focus:outline-none"
						onclick={nextYear}
						aria-label="Next year"
					>
						{@html SVG.rightArrow}
					</button>
				</div>
			</div>

			<div class="grid grid-cols-7 gap-1">
				{#each daysOfWeek as day}
					<div class="py-2 text-center text-sm font-medium text-gray-400">
						{day}
					</div>
				{/each}

				{#each generateCalendarDays() as day}
					<button
						class="{day === null
							? 'invisible'
							: ''} h-8 w-8 rounded-full text-center text-sm hover:bg-gray-100 focus:outline-none
							{selectedDate &&
						day === selectedDate.getDate() &&
						currentMonth.getMonth() === selectedDate.getMonth() &&
						currentMonth.getFullYear() === selectedDate.getFullYear()
							? 'bg-orange-500 text-white hover:bg-orange-600'
							: isDateDisabled(day)
								? 'cursor-not-allowed text-gray-300 hover:bg-transparent'
								: 'text-gray-700'}"
						onclick={() => selectDate(day)}
						disabled={day === null || isDateDisabled(day)}
						aria-label={day
							? `Select ${day} ${months[currentMonth.getMonth()]} ${currentMonth.getFullYear()}`
							: ''}
					>
						{day}
					</button>
				{/each}
			</div>
		</div>
	{/if}
</div>

<style>
	input:-webkit-autofill,
	input:-webkit-autofill:focus {
		transition:
			background-color 600000s 0s,
			color 600000s 0s;
	}
	/* input[data-autocompleted] {
		background-color: transparent !important;
	} */
</style>
