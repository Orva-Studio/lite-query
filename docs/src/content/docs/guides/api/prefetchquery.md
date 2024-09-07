---
title: prefetchQuery
description: The prefetchQuery function.
---

The **prefetchQuery** function is used to prefetch data.

It takes in a **key** and a **fetcher** function as mandatory arguments.

```tsx
function prefetchQuery(
  key: string,
  fetcher: (signal?: AbortSignal) => Promise<unknown>
): void;
```