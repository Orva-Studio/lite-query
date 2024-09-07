---
title: useLQ
description: The useLQ hook.
---

The **useLQ** hook is actually the main Lite Query hook and is used to fetch data. The **useQuery** hook is a wrapper around the **useLQ** hook.

What makes the **useLQ** hook different from the **useQuery** hook is that it does not take in a **queryFn** or **queryKey** as arguments in an object.

Instead you pass them as comma separated arguments.

```tsx
function useLQ(
  key: string,
  queryFn: (signal?: AbortSignal) => Promise<unknown>;
  options: {
    refetchOnMount?: boolean;
    onSuccess?: (data: unknown) => void;
    onError?: (data: unknown) => void;
  }
): {
  isLoading: boolean;
  isRefetching: boolean;
  data: unknown | null;
  error: unknown | null;
  refetch: () => void;
};