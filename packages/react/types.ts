export type QueryFn = (signal?: AbortSignal) => Promise<unknown>;

export type QueryKey = string;

export interface DataSource {
  key: QueryKey;
  fn: QueryFn;
  url?: string;
}

export interface QueryOptions extends BaseOptions {
  refetchOnMount?: boolean;
  onSuccess?: (data: unknown) => void;
  onError?: (data: unknown) => void;
}

export interface QueryClientOptions extends BaseOptions {
  urlBasedPrefetching?: boolean;
  customCache: CustomCache;
}

export interface CustomCache {
  get: (key: string) => CustomCache;
  set: (key: string, data: unknown) => void;
  has: (key: string) => boolean;
}

interface BaseOptions {
  staleTime?: number;
}

export interface CacheItem {
  controller?: AbortController;
  status: string; // TODO
  payload: unknown;
  timestamp?: number;
}
