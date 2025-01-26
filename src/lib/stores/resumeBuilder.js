import { persisted } from 'svelte-persisted-store';
import { writable } from 'svelte/store';

// Update questionsStore to be persisted
export const questionsStore = persisted('questions', [

]);

const initialState = {
	currentStep: 1,
	stepsCompleted: {
		knowingYou: false,
		education: false,
		experience: false,
		skills: false,
		achievements: false,
		questions: false,
		videoIntro: false
	},
	formData: {
		education: [],
		experience: [],
		questionAnswers: [],
		skills: [],
		languages: [],
		achievements: [],
		videoIntro: {}
	}
};

export const resumeBuilderStore = persisted('resumeBuilder', initialState);

// Add this near the other store declarations
export const bioPopupStore = writable(false);

// Helper functions to update store
export function updateStepData(step, data) {
	resumeBuilderStore.update((store) => ({
		...store,
		formData: {
			...store.formData,
			[step]: data
		}
	}));
}

export function markStepComplete(step, isComplete = true) {
	resumeBuilderStore.update((store) => ({
		...store,
		stepsCompleted: {
			...store.stepsCompleted,
			[step]: isComplete
		}
	}));
}

export function updateCurrentStep(step) {
	resumeBuilderStore.update((store) => ({
		...store,
		currentStep: step
	}));
}

// New helper function to update answers
export function updateAnswer(questionId, answer) {
	questionsStore.update((questions) =>
		questions.map((q) => (q.id === questionId ? { ...q, answer } : q))
	);
}

// Add this to your existing store
export const navigationDirection = writable('forward');

// Add this function to update navigation direction
export function setNavigationDirection(direction) {
	navigationDirection.set(direction);
}
