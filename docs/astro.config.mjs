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
					label: 'Prefetching',
					link: '/guides/prefetching/',
				},
				{
					label: 'Refetching',
					link: '/guides/refetching/',
				},
				{
					label: 'SWR',
					link: '/guides/swr/',
				},
				{
					label: 'Aborting Requests',
					link: '/guides/aborting/',
				},
				{
					label: 'API',
					items: [
						// Each item here is one entry in the navigation menu.
						{ label: 'useQuery', link: '/guides/example/' },
						{ label: 'useLiteQuery', link: '/guides/example/' },
						{ label: 'prefetchQuery', link: '/guides/example/' },
						{ label: 'queryClient', link: '/guides/example/' },
						{ label: 'queryCache', link: '/guides/example/' },
					],
				}, {
					label: 'Customising',
					link: '/guides/customising/',
				}, {
					label: 'Feature Requests',
					link: '/guides/feature-requests',
				},
			],
		}),
	],
});
