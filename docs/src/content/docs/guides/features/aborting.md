---
title: Aborting
description: How to abort a fetch request.
---

You may have already seen this in the type definition in the prefetching section but it is possible to abort a fetch using the AbortController. But aborting a fetch happens **automatically** and it is not something you can control.

## Simple Example

The query function exposes an optional signal arguments which can be passed to the fetch function.

The fetch function needs to be able to handle the signal and abort the request if it's received. This is done by passing the signal to the fetch function.

```tsx {4-5, 10}
// Component.tsx
import { useQuery } from "./utils/lite-query";

function fetcher(url: string, signal: AbortSignal): Promise<unknown> {
  return fetch(url, { signal }).then((res) => res.json());
}

const { refetch } = useQuery({
  queryKey: "posts",
  queryFn: (signal) => fetcher("some/url", signal),
});
```
Apply this will address any issues with [race conditions](https://react.dev/reference/react/useEffect#what-are-good-alternatives-to-data-fetching-in-effects).

If a request is made while another one is in progress, the first request will be **automatically cancelled**.