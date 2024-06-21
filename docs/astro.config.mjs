import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: 'Lite Query',
			social: {
				github: 'https://github.com/Orva-Studio/lite-query',
			},
			sidebar: [
				{
					label: 'Getting Started',
					link: '/guides/getting-started/',
				},
				{
					label: 'Collection',
					items: [
						// Each item here is one entry in the navigation menu.
						{ label: 'Example', link: '/guides/example/' },
					],
				},
			],
		}),
	],
});
