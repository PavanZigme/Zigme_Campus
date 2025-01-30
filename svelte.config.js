// import adapter from '@sveltejs/adapter-node';
// import { PUBLIC_ENV_MODE } from '$env/static/public';
// import { defineConfig } from 'vite';
// /** @type {import('@sveltejs/kit').Config} */
// const base = PUBLIC_ENV_MODE === 'DEVELOPMENT' ? '/dev' : '/';

// defineConfig({
// 	kit: {
// 		paths: {
// 			base
// 		}
// 	}
// });

// const config = {
// 	kit: {
// 		// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
// 		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
// 		// See https://svelte.dev/docs/kit/adapters for more information about adapters.
// 		adapter: adapter(),
// 		paths: {
// 			base
// 		}
// 	}
// };

// export default config;

import adapter from '@sveltejs/adapter-auto';
import preprocess from 'svelte-preprocess';
import dotenv from 'dotenv';
dotenv.config();
const config = {
	preprocess: preprocess(),

	kit: {
		adapter: adapter(),
		paths: {
			base: process.env.PUBLIC_ENV_MODE === 'DEVELOPMENT' ? '/dev' : '' // Set your desired base path
		}
	}
};

export default config;
