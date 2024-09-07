---
title: queryCache
description: The queryCache object.
---

The **queryCache** object is used to store data in the cache.

It is a Map object with the following properties.

```tsx
const queryCache: Map<string, CacheItem>;
```

## CacheItem

The **CacheItem** interface is used to define the data stored in the cache.

```tsx
interface CacheItem {
  controller?: AbortController;
  payload: unknown;
  status: string;
  timestamp?: number;
}
```