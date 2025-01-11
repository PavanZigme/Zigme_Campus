<script>
	import AuthHeader from '$lib/components/auth/AuthHeader.svelte';
	import BackButton from '$lib/components/BackButton.svelte';
	import InputField from '$lib/components/InputField.svelte';
	import PasswordField from '$lib/components/auth/PasswordField.svelte';
	import { authService } from '$lib/services/auth';
	import { goto } from '$app/navigation';
	import { toast } from 'svelte-sonner';
	import { SVG } from '$lib/utils/svgs';
	import { withLoading } from '$lib/utils/async';
	import { validateLoginForm } from '$lib/utils/validation';
	import { AUTH_CONFIG } from '$lib/config/auth';
	import { onDestroy } from 'svelte';
	import ErrorMessage from '$lib/components/ErrorMessage.svelte';

	let loginState = $state({
		currentStep: 0,
		useOTP: false,
		isOtpSent: false,
		otpRequestTimer: 0,
		canResendOtp: true,
		loading: false,
		getOtpFromEmail: false,
		otpHash: '',
		error: ''
	});

	let formData = $state({
		email: '',
		password: '',
		otp: ''
	});

	let otpTimer;

	let formErrors = $state({
		email: '',
		password: ''
	});

	// Add fieldStates to track error states for each field
	let fieldStates = $state({
		email: { hasError: false },
		password: { hasError: false },
		otp: { hasError: false }
	});

	// Update isValidEmail to set field error state
	let isValidEmail = $derived(() => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		const isValid = emailRegex.test(formData.email);

		if (!isValid && formData.email) {
			formErrors.email =
				'The email you entered is invalid. Please use correct credentials or sign up';
			fieldStates.email.hasError = true;
		} else {
			formErrors.email = '';
			fieldStates.email.hasError = false;
		}

		return isValid;
	});

	let canSubmit = $derived(() => {
		if (!isValidEmail) return false;
		if (loginState.useOTP) {
			if (loginState.getOtpFromEmail) {
				return formData.otp?.length === 4;
			}
			return true; // Allow Get OTP button when email is valid
		}
		return formData.password?.length > 0;
	});

	// Multi-step form configuration
	const steps = $state([
		{
			id: 1,
			title: 'Sign In',
			fields: [
				{
					label: 'Email Id',
					type: 'email',
					placeholder: 'type here',
					model: 'email'
				}
			],
			showOptions: true
		}
	]);

	function previousStep() {
		if (loginState.currentStep > 0) loginState.currentStep--;
	}

	function toggleLoginMethod() {
		loginState.getOtpFromEmail = false;
		loginState.useOTP = !loginState.useOTP;
		loginState.isOtpSent = false;
		formData.otp = '';
		formData.password = '';
		clearTimer();
	}

	function clearTimer() {
		if (otpTimer) {
			clearInterval(otpTimer);
			otpTimer = null;
		}
	}

	function startResendTimer() {
		clearTimer();
		loginState.canResendOtp = false;
		loginState.otpRequestTimer = AUTH_CONFIG.OTP_TIMEOUT;
		otpTimer = setInterval(() => {
			loginState.otpRequestTimer--;
			if (loginState.otpRequestTimer <= 0) {
				clearTimer();
				loginState.canResendOtp = true;
			}
		}, 1000);
	}

	async function requestOTP() {
		// const errors = validateLoginForm(formData, true);
		// if (errors.length) {
		// 	errors.forEach((error) => toast.error(error));
		// 	return;
		// }
		loginState.isOtpSent = true;
		await withLoading(loginState, async () => {
			loginState.otpHash = await authService.requestLoginOTP(formData.email);

			startResendTimer();
			toast.success(AUTH_CONFIG.MESSAGES.OTP_SENT);
		});
	}

	async function verifyOTPAndLogin() {
		await withLoading(loginState, async () => {
			try {
				await authService.loginWithOTP(loginState.otpHash.hash, formData.email, formData.otp);
				toast.success(AUTH_CONFIG.MESSAGES.LOGIN_SUCCESS);
				goto(AUTH_CONFIG.ROUTES.DASHBOARD);
			} catch (error) {
				loginState.error = error.message || 'Failed to verify OTP';
				if (error.message?.toLowerCase().includes('otp')) {
					fieldStates.otp.hasError = true;
				}
			}
		});
	}

	async function handleSubmit(event) {
		event.preventDefault();
		loginState.error = '';

		// Reset error states
		Object.keys(fieldStates).forEach((key) => {
			fieldStates[key].hasError = false;
		});

		if (!formData.email) {
			fieldStates.email.hasError = true;
			loginState.error = 'Please enter your email';
			return;
		}

		// If using OTP and OTP hasn't been sent yet, request OTP
		if (loginState.useOTP && !loginState.getOtpFromEmail) {
			await handleOTPRequest();
			return;
		}

		// If using OTP and OTP has been sent, verify OTP
		if (loginState.useOTP && loginState.getOtpFromEmail) {
			if (!formData.otp) {
				fieldStates.otp.hasError = true;
				loginState.error = 'Please enter the OTP';
				return;
			}
			await verifyOTPAndLogin();
			return;
		}

		// Regular password-based login
		if (!loginState.useOTP && !formData.password) {
			fieldStates.password.hasError = true;
			loginState.error = 'Please enter your password';
			return;
		}

		await withLoading(loginState, async () => {
			try {
				await authService.login({
					email: formData.email,
					password: formData.password
				});
				goto(AUTH_CONFIG.ROUTES.DASHBOARD);
			} catch (error) {
				loginState.error = error.message || 'Login failed';
				if (error.message?.toLowerCase().includes('email')) {
					fieldStates.email.hasError = true;
				}
				if (error.message?.toLowerCase().includes('password')) {
					fieldStates.password.hasError = true;
				}
			}
		});
	}

	async function handleOTPRequest() {
		if (!isValidEmail) {
			loginState.error = 'Please enter a valid email address';
			fieldStates.email.hasError = true;
			return;
		}
		loginState.getOtpFromEmail = true;
		loginState.isOtpSent = true;

		await withLoading(loginState, async () => {
			try {
				loginState.otpHash = await authService.requestLoginOTP(formData.email);

				startResendTimer();
				toast.success(AUTH_CONFIG.MESSAGES.OTP_SENT);
			} catch (error) {
				loginState.error = error.message || 'Failed to send OTP';
				if (error.message?.toLowerCase().includes('email')) {
					fieldStates.email.hasError = true;
				}
			}
		});
	}

	async function resendOTP() {
		if (!loginState.canResendOtp) {
			toast.error(
				`Please wait ${loginState.otpRequestTimer} seconds before requesting another OTP`
			);
			return;
		}
		await handleOTPRequest();
	}

	// Add function to handle input changes
	function handleInputChange(fieldModel) {
		loginState.error = '';
		fieldStates[fieldModel].hasError = false;
	}

	onDestroy(clearTimer);
</script>

<!-- Template Structure -->

<div class="h-screen w-full bg-[#E0E6E9]">
	<!-- Main Container -->

	<div class="mx-auto flex h-full flex-col">
		<AuthHeader />

		<!-- Form Section -->

		<main class="relative h-screen">
			<div
				class="flex h-full flex-col justify-between gap-[12px] rounded-t-[40px] bg-[#022F49] p-[24px] text-white lg:rounded-tr-[240px]"
			>
				<form
					onsubmit={handleSubmit}
					class="flex h-full flex-col justify-between gap-[12px]"
					aria-label="Login Form"
				>
					<div class="mb-6 {loginState.currentStep === 0 ? 'text-center lg:text-start' : ''}">
						{#if loginState.currentStep > 0}
							<BackButton onClick={previousStep} />
						{/if}

						<h3
							class={loginState.currentStep === 0
								? 'lg:border-1 border-0 pb-[8px] text-[24px] font-medium lg:w-fit lg:border-b lg:text-[20px]'
								: 'text-[16px] font-semibold lg:text-[18px] lg:font-medium'}
						>
							{steps[loginState.currentStep].title}
						</h3>
					</div>
					<InputField
						field={{
							label: 'Email',
							type: 'email',
							placeholder: 'Enter your email',
							model: 'email'
						}}
						bind:value={formData.email}
						onInput={() => handleInputChange('email')}
						hasError={fieldStates.email.hasError}
					/>
					{#if formErrors.email}
						<p class="mt-1 text-sm text-[#FF3B3B]">{formErrors.email}</p>
					{/if}

					{#if !loginState.useOTP}
						<InputField
							field={{
								label: 'Password',
								type: 'password',
								placeholder: 'Enter your password',
								model: 'password'
							}}
							bind:value={formData.password}
							onInput={() => handleInputChange('password')}
							hasError={fieldStates.password.hasError}
						/>
						{#if formErrors.password}
							<p class="mt-1 text-sm text-[#FF3B3B]">{formErrors.password}</p>
						{/if}

						<div class="w-fit">
							<a
								href={AUTH_CONFIG.ROUTES.FORGOT_PASSWORD}
								class="text-sm text-white underline opacity-80 hover:opacity-100"
							>
								Forgot Password ?
							</a>
						</div>
					{:else if loginState.getOtpFromEmail}
						<InputField
							field={{
								label: 'OTP',
								type: 'text',
								placeholder: 'XXXX',
								model: 'otp'
							}}
							bind:value={formData.otp}
							onInput={() => handleInputChange('otp')}
							hasError={fieldStates.otp.hasError}
						/>

						<div class="mt-[1rem] flex justify-between">
							<span class="text-[14px] font-normal text-[#5D657A]">Didn't Receive an OTP?</span>

							{#if !loginState.canResendOtp}
								<span class="text-[14px] font-normal">
									Resend OTP in {loginState.otpRequestTimer}s
								</span>
							{:else}
								<button
									type="button"
									class="text-sm text-white underline opacity-80 hover:opacity-100"
									onclick={() => resendOTP()}
									disabled={loginState.loading}
								>
									Resend OTP
								</button>
							{/if}
						</div>

						
					{/if}

					<!-- Add ErrorMessage component -->
					{#if loginState.error}
						<ErrorMessage message={loginState.error} />
					{/if}

					<div class="flex flex-col gap-3">
						<div class="border border-[#D6DDE233]"></div>
						<div class="flex justify-center lg:justify-start">

						
						<button
							type="button"
							class=" text-sm text-white underline opacity-80 hover:opacity-100"
							onclick={() => toggleLoginMethod()}
						>
							{#if loginState.useOTP}
								Sign in with Password instead
							{:else}
								Sign in with OTP instead
							{/if}
						</button>
					</div>
					</div>

					<!-- Navigation -->

					<div class="flex items-center gap-4 flex-col lg:flex-row lg:justify-between  ">
						<button
							class="flex lg:w-auto w-full justify-center rounded-t-[10px] rounded-bl-[10px] rounded-br-[24px] bg-white px-[26px] py-[13px] text-center text-sm font-medium text-[#003366] transition-colors hover:bg-gray-100"
							type="submit"
							disabled={loginState.loading || !canSubmit}
						>
							{#if loginState.useOTP}
								{#if loginState.isOtpSent}
									Sign In
								{:else}
									Get OTP
								{/if}
							{:else}
								Sign In
							{/if}
						</button>

						<div class="text-center text-white">
							<span class="text-[14px] font-300 text-[#828BA2]">New Here? </span>

							<a
								href={AUTH_CONFIG.ROUTES.SIGNUP}
								class="text-[#F2F4F6] text-[16px] font-[500] hover:underline"
							>
								Sign Up
							</a>
						</div>
					</div>
				</form>
			</div>
		</main>
	</div>
</div>
