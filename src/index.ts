"use client";

import { useSyncExternalStore } from "react";
import type * as Types from "./types";

/**
 * Cache of query results
 */
export let queryCache: Map<Types.QueryKey, Types.CacheItem> = new Map();
const DEFAULT_STALE_TIME = 5_000;

let staleTime: number = DEFAULT_STALE_TIME;
let preloadedDataSources: Types.DataSource[] = [];

/**
 * Hook to fetch data from the cache or the server
 */
export function useQuery(
  options: { queryKey: Types.QueryKey; queryFn: Types.QueryFn } & Types.QueryOptions
): Types.QueryOutput {
  const { queryKey, queryFn, ...restOptions } = options;
  return useLQ(queryKey, queryFn, restOptions);
}

/**
 * Hook to fetch data from the cache or the server
 * Different argument structure to useQuery
 */
export function useLQ(
  key: Types.QueryKey,
  queryFn: Types.QueryFn,
  options: Types.QueryOptions
): Types.QueryOutput {
  queryCache.set(key, queryCache.get(key) ?? { status: "idle", payload: null });
  const data = useSyncExternalStore(subscriber, () => queryCache.get(key)) as Types.CacheItem;
  const isStale = Date.now() - (data.timestamp ?? Date.now()) > (options?.staleTime ?? staleTime);

  if (data.status === "idle" || (options?.refetchOnMount && data.status === "success" && isStale)) {
    fetchOrUsePreloadedData(key, queryFn, options);
  }

  return formatDataResponse(data, key, queryFn);
}

function subscriber(callback: () => void) {
  window.addEventListener("dataFetched", callback);
  return () => {
    window.removeEventListener("dataFetched", callback);
  };
}

function prefetchData(key: Types.QueryKey, fn: Types.QueryFn, options?: Types.QueryOptions) {
  const existingController = (queryCache.get(key) as Types.CacheItem)?.controller;

  if (existingController && queryCache.get(key)!.status === "loading") {
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

/**
 * Prefetch data from the server to cache
 */
export function prefetchQuery(key: Types.QueryKey, fn: Types.QueryFn) {
  if (queryCache.has(key)) return;
  fetchOrUsePreloadedData(key, fn);
}

/**
 * Prefetch multiple data sources to cache
 */
export function prefetchQueries(dataSources: Types.DataSource[], options: Types.QueryClientOptions) {
  preloadedDataSources = dataSources;
  if (options.staleTime) staleTime = options.staleTime;
  if (options?.urlBasedPrefetching) {
    dataSources = dataSources.filter((dataSource) => dataSource.url === window.location.pathname);
  }
  const requests = dataSources.map(({ key, fn }) => prefetchData(key, fn));

  Promise.allSettled(requests);
}

function formatDataResponse({ status, payload }: Types.CacheItem, key: Types.QueryKey, fn: Types.QueryFn) {
  const currentStatus = queryCache.get(key)!.status;
  const defaultData = Object.freeze({
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
  });

  type Test = keyof typeof statusResponse;

  const statusResponse = Object.freeze({
    idle: { ...defaultData, isLoading: true },
    loading: { ...defaultData, isLoading: true },
    refetching: { ...defaultData, isLoading: false, isRefetching: true, data: payload },
    error: { ...defaultData, error: payload },
    success: { ...defaultData, data: payload },
  });

  return statusResponse[status as Test];
}

function fetchOrUsePreloadedData(key: Types.QueryKey, fn: Types.QueryFn, options?: Types.QueryOptions) {
  const preloadedDataSource = preloadedDataSources.find((dataSource) => dataSource.key === key);
  prefetchData(key, fn ?? preloadedDataSource?.fn, options);
}
