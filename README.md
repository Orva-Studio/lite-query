# Lite Query

## Basic Usage

```jsx
import { useQuery } from './utils/lite-query';

const { data, error, isLoading } = useQuery({
	queryKey: 'posts',
	queryFn: () => fetch('https://jsonplaceholder.typicode.com/posts').then(res => res.json())
});

if (isLoading) return 'Loading...';
if (error) return `Error: ${error.message}`;
```

## How to Install

Simply copy [this file](https://github.com/Orva-Studio/lite-query/blob/main/src/index.ts) and put it anywhere in your project.

Or if you'd like to install it [as a package](https://jsr.io/@orva/lite-query), you can use this command:

```sh
npx jsr add @orva/lite-query
```

## Features

Lite Query address all the data fetching issues raised in the [React Documentation](https://react.dev/reference/react/useEffect#what-are-good-alternatives-to-data-fetching-in-effects) caused by the useEffect hook such as:

- Data Caching: Simple caching system preventing multiple requests for the same data.
- Prefetching: Fetch data before it's needed, or even before React renders the component.
- SWR: [Stale-While-Revalidate](https://datatracker.ietf.org/doc/html/rfc5861) supported meaning you can show stale data while fetching new data in the background.
- And much more...: Learn more about all the features in the [Lite Query Docs](https://starlight.astro.build/).
