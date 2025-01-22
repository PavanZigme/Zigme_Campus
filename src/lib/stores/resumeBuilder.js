import { persisted } from 'svelte-persisted-store';
import { writable } from 'svelte/store';

// New questions store
export const questionsStore = writable([
	{
		id: 1,
		question: 'Describe a time you led a team to success.',
		answer: '',
		placeholder:
			'Eg. During my final year of college, I led a group project where we developed a marketing strategy for a startup. I organized weekly check-ins, divided tasks based on strengths, and kept everyone motivated. Despite tight deadlines, we delivered a comprehensive plan that was well-received by the panel, and it taught me the value of teamwork and clear communication'
	},
	{
		id: 2,
		question: "What's your biggest professional achievement?",
		answer: '',
		placeholder: 'Describe your achievement and its impact'
	},
	{
		id: 3,
		question: 'How do you handle challenging situations?',
		answer: '',
		placeholder: 'Share an example of a challenge and how you overcame it'
	},
	{
		id: 4,
		question: 'What are your key strengths?',
		answer: '',
		placeholder: 'List and briefly explain your main professional strengths'
	},
	{
		id: 5,
		question: 'Where do you see yourself in 5 years?',
		answer: '',
		placeholder: 'Eg. I aim to develop my skills in...'
	}
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
		skills: [],
		achievements: [],
		videoIntro: {}
	}
};

export const resumeBuilderStore = persisted('resumeBuilder', initialState);

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
