---
title: useQuery
description: The useQuery hook.
---

The **useQuery** hook is the main hook in Lite Query and is used to fetch data.

It takes in a **queryKey** and a **queryFn** as mandatory arguments. And some optional argument like **refetchOnMount** and **onSuccess** and **onError**.

```tsx
function useQuery(options: {
  queryKey: string;
  queryFn: (signal?: AbortSignal) => Promise<unknown>;
  refetchOnMount?: boolean;
  onSuccess?: (data: unknown) => void;
  onError?: (data: unknown) => void;
});

```
It returns an object with the following properties.

```tsx
 {
   isLoading: boolean;
  isRefetching: boolean;
  data: unknown | null;
  error: unknown | null;
  refetch: () => void;
};
```
- **isLoading** - Boolean returning true if data has loaded into the cache
- **isRefetching** - Boolean returning true if data has been automatically refetched
- **data** - Returns successfully fetched data from the cache
- **error** - Returns cached error object
- **refetch** - Function to manually refetch data