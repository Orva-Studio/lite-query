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

prefetchQuery("posts", getPosts);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
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
