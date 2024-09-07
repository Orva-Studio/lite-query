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
					label: 'Features',
					items: [
						{
							label: 'Prefetching',
							link: '/guides/features/prefetching/',
						},
						{
							label: 'Data Caching',
							link: '/guides/features/data-caching/',
						},
						{
							label: 'Refetching',
							link: '/guides/features/refetching/',
						},
						{
							label: 'Aborting',
							link: '/guides/features/aborting/',
						},
						{
							label: 'SWR',
							link: '/guides/features/swr/',
						},
					],
				},
				{
					label: 'API',
					items: [
						{ label: 'useQuery', link: '/guides/api/usequery/' },
						{ label: 'useLQ', link: '/guides/api/uselq/' },
						{ label: 'prefetchQuery', link: '/guides/api/prefetchquery/' },
						{ label: 'prefetchQueries', link: '/guides/api/prefetchqueries/' },
						{ label: 'queryCache', link: '/guides/api/querycache/' },
					],
				}
			],
		}),
	],
});
