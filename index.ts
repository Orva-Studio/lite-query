import { useSyncExternalStore } from "react";

export const queryCache = new Map();
const defaultStaleTime = 5_000;

let preloadedDataSources = [];

export function useQuery(options) {
  return useLiteQuery(options.queryKey, options.queryFn, ...options);
}

export function useLiteQuery(key, fn, options) {
  queryCache.set(key, queryCache.get(key) ?? { status: "idle", payload: null });
  const data = useSyncExternalStore(subscriber, () => queryCache.get(key));
  const isStale = Date.now() - data.timestamp > (options?.staleTime ?? defaultStaleTime);

  if (data.status === "idle" || (options?.refetchOnMount && data.status === "success" && isStale)) {
    fetchOrUsePreloadedData(key, fn, options);
  }

  return formatDataResponse(data, key, fn);
}

function subscriber(callback) {
  window.addEventListener("dataFetched", callback);
  return () => {
    window.removeEventListener("dataFetched", callback);
  };
}

function prefetchData(key, fn, options) {
  const existingController = queryCache.get(key)?.controller;
  if (existingController && queryCache.get(key).status === "loading") {
    console.log(`Cancelling the ongoing fetch for key ${key} `);
    existingController.abort();
  }

  const newController = new AbortController();
  const signal = newController.signal;
  const isRefetching = options?.refetchOnMount;

  if (isRefetching) {
    queryCache.set(key, {
      status: "refetching",
      controller: newController,
      payload: queryCache.get(key)?.payload,
      timestamp: Date.now(),
    });
  } else {
    queryCache.set(key, {
      status: "loading",
      payload: null,
      controller: newController,
    });
  }

  fn(signal)
    .then((data) => {
      queryCache.set(key, { status: "success", payload: data, controller: undefined, timestamp: Date.now() });
      options?.onSuccess?.(data);
    })
    .catch((error) => {
      if (error?.name === "AbortError") {
        console.log(`Fetch for key ${key} was cancelled`);
        return;
      }
      console.error(`Error prefetching data for key ${key}:`, error);
      queryCache.set(key, { status: "error", payload: error, controller: undefined });
      options?.onError?.(error);
    })
    .finally(() => {
      window.dispatchEvent(new Event("dataFetched"));
    });
}

export function prefetchQuery(key, fn) {
  if (queryCache.has(key)) return;
  fetchOrUsePreloadedData(key, fn);
}

export function queryClient(dataSources, options) {
  preloadedDataSources = dataSources;
  if (options?.urlBasedPrefetching) {
    dataSources = dataSources.filter((dataSource) => dataSource.url === window.location.pathname);
  }
  const requests = dataSources.map(({ key, fn }) => prefetchData(key, fn));

  Promise.allSettled(requests);
}

function formatDataResponse({ status, payload }, key, fn) {
  const currentStatus = queryCache.get(key).status;
  const defaultData = {
    isLoading: false,
    isRefetching: false,
    data: null,
    error: null,
    refetch: () => {
      if (currentStatus !== "loading" && currentStatus !== "refetching") {
        queryCache.set(key, { status: "idle", payload: null });
      }
      fetchOrUsePreloadedData(key, fn);
    },
  };

  const statusResponse = {
    idle: { ...defaultData, isLoading: true },
    loading: { ...defaultData, isLoading: true },
    refetching: { ...defaultData, isLoading: false, isRefetching: true, data: payload },
    error: { ...defaultData, error: payload },
    success: { ...defaultData, data: payload },
  };
  return statusResponse[status];
}

function fetchOrUsePreloadedData(key, fn, options) {
  const preloadedDataSource = preloadedDataSources.find((dataSource) => dataSource.key === key);
  prefetchData(key, fn ?? preloadedDataSource?.fn, options);
}
