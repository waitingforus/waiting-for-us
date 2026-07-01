/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				brand: {
					cyan: '#06b6d4', // Cyan blue
					dark: '#2f4f4f', // Dark slate grey
				}
			}
		},
	},
	plugins: [],
}