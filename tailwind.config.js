import containerQueries from '@tailwindcss/container-queries';
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import colors from 'tailwindcss/colors';
import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */

const font_sans = ["Work Sans", "serif", ...defaultTheme.fontFamily.sans];
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			fontFamily: {
				sans: font_sans.toString()
			},
			screens: {
				'xs': '375px',    // Small mobile devices
				'sm': '640px',   	 // Large mobile devices
				'md': '768px',    // Tablets
				'lg': '1024px',   // Desktop
				'xl': '1280px',   // Large desktop
				'2xl': '1536px'   // Extra large screens
			  },
			colors: {
				accent: '#FFFFFF',
				primary: '#000000',
				blue500: '#418BFF',
				Orange100 : "#F28212",
				mono: colors.zinc,
				brand: colors.orange
			},
		}
	},

	plugins: [typography, forms, containerQueries]
}; 