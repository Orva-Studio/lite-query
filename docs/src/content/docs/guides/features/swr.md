---
title: SWR
description: How to automatically refetch data.
---

[Stale While Revalidate (SWR)](https://web.dev/articles/stale-while-revalidate) is a caching technique used in http headers allowing the use of stale (expired) resource while revalidating the resource in the background.

This can be applied to data fetching as well.

If cached data is stale (duration set by user), then when the component re-mounts the old data will be displayed and new data will be fetched in the background and replace the stale cached data.

:::note
Although SWR isn't listed as one of the significant problems with data fetching in the React documentation, it is more of a nice-to-have feature.
:::

## Simple Example

Lite query supports automatic refetching using the **refetchOnMount** option and based on an optional **staleTime** value, which is set to 5 seconds by default.

```tsx {10-11}
// Component.tsx
import { useQuery } from "./utils/lite-query";

function fetcher(url: string): Promise<unknown> {
  return fetch(url).then((res) => res.json());
}

const { data, error, isLoading } = useQuery({
	queryKey: 'posts',
	queryFn: () => fetcher('https://jsonplaceholder.typicode.com/posts'),
  refetchOnMount: true,
  staleTime: 10_000,
});
```
The code will first populate the cache with data and give it a timestamp. When the component is re-mounted the current timestamp will be compared with the timestamp of the cached data.

If it exceeds the stale time of 10,000 milliseconds (10 second), the data will be fetched again in the background updating the cache with new data (if there is any) which will be reflected in the component.

## Global Stale Time

Instead of setting stale time for each query, you can set a global stale time for all queries.

This can be done by importing **prefetchQueries** and adding the **staleTime** option.

```tsx {4}
// main.tsx
import { prefetchQueries } from "./utils/lite-query";

prefetchQueries([], { staleTime: 20_000 });
```

Although this technically can be done anywhere in the codebase, it is recommended to do it in the **main** file, so it's easier to find and change if needed.

:::caution
It is advised to not set the global or locale stale time to under **500 milliseconds** as an update in data will cause the component to re-render which will trigger the **useQuery** or **useLQ** hook to fetch data again, resulting in a component re-render loop.
:::