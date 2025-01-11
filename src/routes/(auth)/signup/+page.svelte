<script>
	import { authService } from '$lib/services/auth';
	import { goto } from '$app/navigation';
	import InputField from '$lib/components/InputField.svelte';
	import ErrorMessage from '$lib/components/ErrorMessage.svelte';
	import StepIndicator from '$lib/components/StepIndicator.svelte';
	import BackButton from '$lib/components/BackButton.svelte';
	import { SVG } from '$lib/utils/svgs';
	import PasswordValidation from '$lib/components/PasswordValidation.svelte';
	import AuthHeader from '$lib/components/auth/AuthHeader.svelte';

	// State Management
	let currentStep = $state(0);
	let loading = $state(false);
	let error = $state('');
	let otpResponse = $state(null);
	let hoverBack = $state(false);
	let hoverNext = $state(false);
	let passwordValid = $state(false);

	// Form Configuration
	const VALIDATION_PATTERNS = {
		email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
		phone: /^\d{10}$/,
		otp: /^\d{4}$/
	};

	const VALIDATION_RULES = {
		fullName: (value) => ({
			isValid: value.trim().length >= 2,
			message:
				'Your name can’t be blank! Let’s personalize your journey. Please enter your name to proceed.'
		}),
		email: (value) => ({
			isValid: VALIDATION_PATTERNS.email.test(value),
			message: 'Please enter a valid email address'
		}),
		phone: (value) => ({
			isValid: VALIDATION_PATTERNS.phone.test(value),
			message: 'Please enter a valid 10-digit phone number'
		}),
		otp: (value) => ({
			isValid: VALIDATION_PATTERNS.otp.test(value),
			message: 'Please enter a valid 4-digit OTP'
		}),
		password: (value) => ({
			isValid: value.length >= 8,
			message: 'Password must be at least 8 characters'
		}),
		confirmPassword: (value, formData) => ({
			isValid: value === formData.password,
			message: 'Passwords do not match'
		})
	};

	const steps = $state([
		{
			id: 1,
			title: 'Sign Up',
			fields: [
				{
					label: 'Your Full Name',
					type: 'text',
					placeholder: ' Eg. John Doe',
					model: 'fullName'
				}
			]
		},
		{
			id: 2,
			title: 'How do We contact You ?',
			fields: [
				{
					label: 'Email',
					type: 'email',
					placeholder: 'e.g., Jane12@gmail.com',
					model: 'email'
				},
				{
					label: 'Phone',
					type: 'tel',
					placeholder: 'e.g., 8682341586',
					model: 'phone'
				}
			]
		},
		{
			id: 3,
			title: 'Enter OTP sent to your Email ID.',
			fields: [
				{
					label: 'OTP',
					type: 'text',
					placeholder: 'XXXX',
					model: 'otp'
				}
			]
		},
		{
			id: 4,
			title: 'Set Password',
			description: 'Secure your account with Password.',
			fields: [
				{
					label: 'Password',
					type: 'password',
					placeholder: 'Type here',
					model: 'password'
				},
				{
					label: 'Confirm Password',
					type: 'password',
					placeholder: 'Re-enter password',
					model: 'confirmPassword'
				}
			]
		}
	]);

	// Form State
	let formData = $state({
		fullName: '',
		email: '',
		phone: '',
		otp: '',
		password: '',
		confirmPassword: ''
	});

	let stepErrors = $state({
		0: '',
		1: '',
		2: '',
		3: ''
	});

	let fieldStates = $state({
		fullName: { hasError: false },
		email: { hasError: false },
		phone: { hasError: false },
		otp: { hasError: false },
		password: { hasError: false },
		confirmPassword: { hasError: false }
	});

	// Validation Functions
	function validateFields(fields, formData) {
		let isValid = true;
		let message = '';

		// Reset error states for all fields in this step
		fields.forEach((field) => {
			fieldStates[field.model].hasError = false;
		});

		// Validate each field
		for (const field of fields) {
			const validation = VALIDATION_RULES[field.model](formData[field.model], formData);
			if (!validation.isValid) {
				fieldStates[field.model].hasError = true;
				isValid = false;
				message = validation.message;
				break;
			}
		}

		return { isValid, message };
	}

	// Event Handlers
	function handleInputChange(fieldModel) {
		stepErrors[currentStep] = '';
		fieldStates[fieldModel].hasError = false;
	}

	async function handleStepSubmit() {
		event.preventDefault();
		loading = true;
		stepErrors[currentStep] = '';

		const currentFields = steps[currentStep].fields;
		const validationResult = validateFields(currentFields, formData);

		if (!validationResult.isValid) {
			stepErrors[currentStep] = validationResult.message;
			loading = false;
			return;
		}

		try {
			switch (currentStep) {
				case 1: // Email and Phone step
					try {
						otpResponse = await authService.sendOTP(formData.email, formData.phone);
						nextStep();
					} catch (e) {
						if (e.statusCode === 409) {
							if (e.error.includes('email')) {
								stepErrors[currentStep] =
									'This email ID is already in use. To access your account and pick up where you left off';
							} else if (e.error.includes('contact')) {
								stepErrors[currentStep] =
									'It looks like this phone number is already registered. To continue your journey with us ';
							} else {
								stepErrors[currentStep] = 'This email or phone number is already registered';
							}
						} else {
							stepErrors[currentStep] = e.error;
						}
						return;
					}
					break;

				case 2: // OTP verification
					try {
						await authService.verifyOTP(
							otpResponse.hash,
							`${formData.email}.${formData.phone}`,
							formData.otp
						);
						nextStep();
					} catch (e) {
						if (e.status === 400) {
							stepErrors[currentStep] = 'Invalid OTP. Please enter the correct code';
						} else if (e.status === 401) {
							stepErrors[currentStep] = 'OTP has expired. Please request a new one';
						} else if (e.status === 429) {
							stepErrors[currentStep] = 'Too many incorrect attempts. Please try again later';
						} else if (e.message.includes('mismatch')) {
							stepErrors[currentStep] = 'OTP does not match. Please check and try again';
						} else {
							stepErrors[currentStep] = 'Failed to verify OTP. Please try again';
						}
						return;
					}
					break;

				case 3: // Final signup
					try {
						await authService.signup(
							formData.email,
							formData.phone,
							formData.password,
							formData.fullName
						);

						goto('/signup-complete');

					} catch (e) {
						if (e.status === 409) {
							error = 'Account already exists with this email or phone';
						} else {
							error = 'Failed to create account. Please try again';
						}
						return;
					}
					break;

				default:
					nextStep();
			}
		} catch (e) {
			stepErrors[currentStep] = e.message || 'Something went wrong. Please try again';
		} finally {
			loading = false;
		}
	}

	async function resendOTP() {
		loading = true;
		stepErrors[currentStep] = '';

		try {
			otpResponse = await authService.sendOTP(formData.email, formData.phone);
			stepErrors[currentStep] = 'OTP sent successfully!';
		} catch (e) {
			if (e.status === 429) {
				stepErrors[currentStep] = 'Too many attempts. Please try again later';
			} else if (e.status === 409) {
				if (e.message.includes('email')) {
					stepErrors[currentStep] = 'This email address is already registered';
				} else if (e.message.includes('phone')) {
					stepErrors[currentStep] = 'This phone number is already registered';
				}
			} else {
				stepErrors[currentStep] = 'Failed to resend OTP. Please try again';
			}
		} finally {
			loading = false;
		}
	}

	// Navigation Functions
	function nextStep() {
		if (currentStep < steps.length - 1) currentStep++;
	}

	function previousStep() {
		if (currentStep > 0) currentStep--;
	}

	function handlePasswordValidation(isValid) {
		passwordValid = isValid;
	}
</script>

<!-- Template remains the same -->

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="h-screen w-full bg-[#E0E6E9]">
	<!-- Main Container -->
	<div class="mx-auto flex h-full flex-col">
		<AuthHeader  />
		<!-- Form Section -->
		<main class="relative h-screen">
			<!-- svelte-ignore a11y_consider_explicit_label -->
			 
			<div
				class="flex h-full flex-col gap-[2rem] rounded-t-[40px] bg-[#022F49] p-[24px] text-white lg:gap-[4rem] lg:rounded-tr-[240px]"
			>
				<!-- Title of current step -->
				<div class="mb-6 {currentStep === 0 ? 'text-center lg:text-start' : ''}">
					{#if currentStep > 0}
						<BackButton onClick={previousStep} />
					{/if}
					<h3
						class={currentStep === 0
							? 'lg:border-1 border-0 text-[24px] font-medium lg:w-fit lg:border-b lg:text-[20px]'
							: 'text-[16px] font-semibold lg:text-[18px] lg:font-medium'}
					>
						{steps[currentStep].title}
					</h3>
				</div>

				<!-- Form Fields -->
				<form
					onsubmit={handleStepSubmit}
					class="flex h-full flex-col justify-between gap-4"
					novalidate
				>
					<div
						class="{steps[currentStep].fields.length > 1 ? 'grid lg:grid-cols-2' : ''} gap-[2rem]"
					>
						{#each steps[currentStep].fields as field, index}
							<div class="flex flex-col gap-4">
								<div class="relative">
									<InputField
										{field}
										bind:value={formData[field.model]}
										onInput={handleInputChange}
										hasError={fieldStates[field.model].hasError}
										shouldFocus={index === 0}
										id={`input-${currentStep}-${field.model}`}
									/>
								</div>
							</div>
						{/each}

						{#if currentStep === 2}
							<div class="mt-2 text-center">
								<button
									type="button"
									class="text-sm text-gray-300 hover:text-white"
									onclick={resendOTP}
									disabled={loading}
								>
									Resend OTP
								</button>
							</div>
						{/if}
					</div>
					<ErrorMessage message={stepErrors[currentStep]} />
					{#if currentStep === 3}
						<PasswordValidation
							password={formData.password}
							onValidationChange={handlePasswordValidation}
						/>
					{/if}

					{#if currentStep === 0}
						<div class="border-t border-[#D6DDE233] lg:hidden"></div>
						<div class="mt-3 flex flex-col items-center gap-[10px] text-sm text-gray-300 lg:hidden">
							<span class="opacity-50">Already have an account?</span>
							<a href="/login" class="ml-1 text-white hover:underline">Sign In</a>
						</div>
					{/if}

					<!-- Progress and Navigation -->
					<div class="flex flex-col gap-[12px] lg:gap-[22px]">
						<StepIndicator currentStep={currentStep + 1} totalSteps={steps.length} />

						<div class="w-full items-center justify-between lg:flex">
							<button
								type="submit"
								class="w-full rounded-t-[10px] rounded-bl-[10px] rounded-br-[24px] bg-white px-[26px] py-[13px] text-center text-sm font-medium text-[#003366] transition-colors hover:bg-gray-100 lg:w-fit"
								disabled={loading}
							>
								{loading ? 'Please wait...' : 'Continue'}
							</button>

							{#if currentStep === 0}
								<div class="mt-3 hidden items-center gap-[10px] text-sm text-gray-300 lg:flex">
									<span class="font-300 text-[14px] text-[#828BA2]">Already have an account?</span>
									<a href="/login" class=" text-[16px] font-[500] text-white hover:underline"
										>Sign In</a
									>
								</div>
							{/if}
						</div>
					</div>
				</form>

				<!-- {#if currentStep === 0}
					<div class="border-t border-[#D6DDE233] lg:hidden"></div>
					<div class="mt-3 flex flex-col items-center gap-[10px] text-sm text-gray-300 lg:hidden">
						<span class="opacity-50">Already have an account?</span>
						<a href="/login" class="ml-1 text-white hover:underline">Sign In</a>
					</div>
				{/if} -->
			</div>
		</main>
	</div>
</div>
<!-- {#if error}
	<ErrorMessage message={error} />
{/if} -->
