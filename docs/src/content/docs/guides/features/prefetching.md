---
title: Prefetching
description: Understanding prefetching in Lite Query.
---

Prefetching allows you to fetch data before your react components renders improving the performance of your app.

## Overview

Here's a basic example of how to use prefetching.

```tsx
// main.tsx
import { getPosts } from "./api/posts.ts";
import { prefetchQuery } from "./utils/lite-query.ts";

prefetchQuery("posts", () => getPosts());

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

```

```tsx
// posts.ts
export function getPosts() {
  return fetch("https://jsonplaceholder.typicode.com/posts")
          .then((res) => res.json());
}
```

To use it, import and call the `prefetchQuery` function with the **key** and **fetcher** function as arguments, and place it in the main root of your app.

This will start the fetching process **before** React renders meaning in theory, the data could be available in the cache even before your component has loaded.

:::note
Using **prefetchQuery** twice with an existing key won't trigger a refetch since there is data for that key in the cache.

For that you would have to use the [refetch function]() or set [refethOnMount]() to true.
:::

Here's the type definition for the **prefetchQuery** function.

```ts
// types.ts
type QueryFn = (signal?: AbortSignal) => Promise<unknown>;
type QueryKey = string;

function prefetchQuery(key: Types.QueryKey, fn: Types.QueryFn): void;
```

## Prefetch on event

Because prefetching will start wherever the `prefetchQuery` function is called, it's use isn't limited to before the app loads. You can also Prefetch on event like scroll, click or hover.

```tsx
// Component.tsx
import { prefetchQuery } from "./utils/lite-query";

// ...

<a
  href="some/link"
  onMouseEnter={
    () => prefetchQuery(
      "key",
      () => fetcher("https://tsonplaceholder.typicode.com/posts")
    )
  }
>
  Posts
</a>
```

For this example data is being fetched on hover meaning when the user clicks on the link, the next page might have already fetched all the data it needs.

## Multi Source Prefetching

It is possible to prefetch multiple different data sources at the same time.

```tsx
// main.tsx
import { getPosts } from "./api/posts.ts";
import { getComments } from "./api/comments.ts";
import { prefetchQueries } from "./utils/lite-query.ts";

prefetchQueries([
  {queryKey: "posts", queryFn: () => getPosts},
  {queryKey: "comments", queryFn: () => getComments},
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

This will prefetch all the sources at the same time and store them in the cache.
:::note
Using the `prefetchQueries` function will also store all your fetcher functions in memory meaning if your fetcher doesn't change, you can refetch data without having to import it.

```tsx
// Component.tsx
import { useQuery } from "./utils/lite-query";

const { refetch } = useQuery("comments");

return (
  <button onClick={() => refetch()}>
    Reload Comments
   </button>
);
```
:::

## Url Based Prefetching
:::caution
This functionality has been tested with a custom routing solution but not with react libraries such as react-router.

You may experience issues with url based prefetching if using a library such as react-router or other routing libraries.
:::

If you would like to save a bunch of fetcher functions in memory but only wanted to load data based on a specific url.

You can do that with the `prefetchQueries` function by passing in an optional url parameter to the data source, and set the `urlBasedPrefetching` option to true.

```tsx {10}
// main.tsx
import { getPosts } from "./api/posts.ts";
import { getComments } from "./api/comments.ts";
import { prefetchQueries } from "./utils/lite-query.ts";
// TODO: Add prefetchQueries to Library
prefetchQueries([
    {queryKey: "posts", queryFn: () => getPosts, url: "/posts"},
    {queryKey: "comments", queryFn: () => getComments, url: "/comments"},
  ],
  urlBasedPrefetching: true
);
```
This will only fetch data if the function runs on one of the specified urls. If a subsequent url is visited, data will be fetched when the `useQuery` or `useLQ` function is called.

For example, if the `/posts` url is visited, the `posts` data will be fetched and stored in the cache. If the `/comments` url is visited afterwards, no data will only be fetched if one of the query hooks is called.

But the `getComments` fetcher will be stored in memory so data can be fetched simply by using the `comments` key as an argument to the `useQuery` or `useLQ` function.