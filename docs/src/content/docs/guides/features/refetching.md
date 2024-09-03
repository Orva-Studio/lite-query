---
title: Refetching
description: How to manually refetch data.
---

Eventhough data may already exist in the cache, there may be occasions in which you want to refetch the data manually. For example if you would like to get more up to date data from the server.

Lite Query supports this by exposing a **refetch** function on the returned object.

## Simple Example

Here is a simple example of how to use the **refetch** function.

```tsx {14}
// Component.tsx
import { useQuery } from "./utils/lite-query";

function fetcher(url: string): Promise<unknown> {
  return fetch(url).then((res) => res.json());
}

const { refetch } = useQuery({
  queryKey: "posts",
  queryFn: () => fetcher("https://jsonplaceholder.typicode.com/posts"),
});

return (
  <button className="details" onClick={refetch}>
    refetch
  </button>
);
```

When the button is clicked, the **refetch** function will be called and the data will be refetched.

This is a manual way to refetch data, but it can be useful in some cases. For more automatic refetching, see the [SWR](/guides/features/swr/) feature.

## isRefetching

There is also an **isRefetching** option which can be used to check if the data is currently being refetched.

An ideal use case for this would be to show a loading indicator while the data is being refetched.

```tsx {14, 8}
// Component.tsx
import { useQuery } from "./utils/lite-query";

function fetcher(url: string): Promise<unknown> {
  return fetch(url).then((res) => res.json());
}

const { data, isRefetching } = useQuery({
  queryKey: "posts",
  queryFn: () => fetcher("https://jsonplaceholder.typicode.com/posts"),
});

return (
  <div>{isRefetching && "Refetching..."}</div>
  <button className="details" onClick={refetch}>
    refetch
  </button>
);

```