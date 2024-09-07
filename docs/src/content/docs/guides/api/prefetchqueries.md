---
title: prefetchQueries
description: The prefetchQueries function.
---

The **prefetchQueries** function is used to prefetch multiple data sources at the same time.

It takes in an array of **dataSources** and an optional **options** object as arguments.

```tsx
function prefetchQueries(
  dataSources: DataSource[],
  options?: QueryClientOptions
): void;
```

## DataSource

The **DataSource** interface is used to define a data source.

```tsx
interface DataSource {
  key: string;
  fn: (signal?: AbortSignal) => Promise<unknown>;
  url?: string;
}
```

## QueryClientOptions

The **QueryClientOptions** interface is used to define the options for the **prefetchQueries** function.

```tsx
interface QueryClientOptions {
  urlBasedPrefetching?: boolean;
  staleTime?: number;
}
```