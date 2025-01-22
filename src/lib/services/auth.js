import axios from 'axios';
import { auth } from '../stores/auth';
import { showLoader, hideLoader } from '$lib/stores/loader';

// Simulated API endpoints - replace these with your actual API URLs
const END_POINT = 'http://192.168.1.52:8014/api/v1';
const API_ENDPOINTS = {
	LOGIN: `${END_POINT}/auth/signIn`,
	SIGNUP: `${END_POINT}/auth/signUp`,
	VERIFY_TOKEN: `${END_POINT}/auth/verify`,
	SEND_OTP: `${END_POINT}/auth/send-otp`,
	VERIFY_OTP: `${END_POINT}/auth/verify-otp`,
	REQUEST_LOGIN_OTP: `${END_POINT}/auth/signIn`,
	LOGIN_WITH_OTP: `${END_POINT}/auth/verify-otp`
};

// Helper function for API calls using Axios
async function apiCall(endpoint, method = 'GET', data = null) {
	showLoader(); // You can customize the message or leave it empty
	try {
		const token = localStorage.getItem('token');

		const config = {
			method,
			url: endpoint,
			headers: {
				'Content-Type': 'application/json',
				...(token && { Authorization: `Bearer ${token}` })
			},
			...(data && { data })
		};

		const response = await axios(config);
		return response.data;
	} catch (error) {
		console.error(`API Error (${endpoint}):`, error);
		// Handle Axios specific errors
		if (error.response) {
			// Directly throw the response data without wrapping in Error
			throw error.response.data;
		} else if (error.request) {
			throw { error: 'No response from server' };
		} else {
			throw { error: error.message };
		}
	} finally {
		hideLoader();
	}
}

export const authService = {
	async login({ email, password }) {
		try {
			const response = await apiCall(API_ENDPOINTS.LOGIN, 'POST', {
				field: email,
				password
			});

			// Store token
			localStorage.setItem('token', response.token);

			// Update auth store
			auth.login({
				id: response.user.id,
				email: response.user.email,
				name: response.user.name,
				token: response.token
			});

			return response;
		} catch (error) {
			console.error('Login failed:', error);
			// throw new Error('Invalid credentials');
			throw error;
		}
	},

	async signup(email, contact_no, password, name) {
		try {
			const response = await apiCall(API_ENDPOINTS.SIGNUP, 'POST', {
				email,
				contact_no,
				password,
				name
			});

			// Store token
			localStorage.setItem('token', response.token);

			// Update auth store
			auth.login({
				id: response.user.id,
				email: response.user.email,
				name: response.user.name,
				token: response.token
			});

			return response;
		} catch (error) {
			console.error('Signup failed:', error);
			throw error;
		}
	},

	// Simplified logout that just clears local state
	logout() {
		localStorage.removeItem('token');
		auth.logout();
	},

	async verifyToken() {
		try {
			const token = localStorage.getItem('token');
			if (!token) {
				throw new Error('No token found');
			}

			const response = await apiCall(API_ENDPOINTS.VERIFY_TOKEN, 'GET');

			// Update auth store with fresh user data
			auth.login({
				id: response.user.id,
				email: response.user.email,
				name: response.user.name,
				token
			});

			return true;
		} catch (error) {
			console.error('Token verification failed:', error);
			this.logout();
			return false;
		}
	},

	// Helper method to check if user is authenticated
	isAuthenticated() {
		return !!localStorage.getItem('token');
	},

	async sendOTP(email, phone) {
		try {
			const response = await apiCall(API_ENDPOINTS.SEND_OTP, 'POST', {
				email,
				contact: phone,
				type: "signup"
			});
			return response;
		} catch (error) {
			console.error('Send OTP failed:', error);
			throw error;
		}
	},

	async verifyOTP(hash, email, otp) {
		try {
			const response = await apiCall(API_ENDPOINTS.VERIFY_OTP, 'POST', {
				hash,
				field: email,
				otp
			});
			return response;
		} catch (error) {
			console.error('OTP verification failed:', error);
			throw error;
		}
	},

	// Request OTP for login
	async requestLoginOTP(email) {
		try {
			const response = await apiCall(API_ENDPOINTS.REQUEST_LOGIN_OTP, 'POST', {
				field: email
			});
			return response;
		} catch (error) {
			console.error('Login OTP request failed:', error);
			throw new Error('Failed to send login OTP');
		}
	},

	// Login with OTP
	async loginWithOTP(hash, email, otp) {
		try {
			const response = await apiCall(API_ENDPOINTS.LOGIN_WITH_OTP, 'POST', {
				hash,
				field: email,
				otp,
				type: 'login'
			});

			// Store token
			localStorage.setItem('token', response.token);

			// Update auth store
			auth.login({
				id: response.user.id,
				email: response.user.email,
				name: response.user.name,
				token: response.token
			});

			return response;
		} catch (error) {
			console.error('OTP login failed:', error);
			throw new Error('Invalid OTP or login failed');
		}
	}
};
