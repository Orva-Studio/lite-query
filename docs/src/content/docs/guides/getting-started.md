---
title: Getting Started
description: How to get started with Lite Query.
---

## Introduction

When it comes to client side data fetching with [React](https://react.dev/), most developers jump straight to the [useEffect](https://react.dev/reference/react/useEffect#fetching-data-with-effects) hook and stick a fetch call in there. But there are many [significant](https://react.dev/reference/react/useEffect#what-are-good-alternatives-to-data-fetching-in-effects) downsides to using that approach such as no caching and prefetching, issues with race conditions and network waterfalls.

The purpose of **Lite Query** is to solve those issues in a simple and lightweight library, and what makes this different from other data fetching libraries is the focus on having a small feature set. No wrapping component, no complex features, just enough code to give you performant data fetching.

**Lite Query** as it's name suggests is ideal for **small to medium** sized projects that don't have complex data fetching needs. And also for those who want to peek under the hood of a simple data fetching library.

## Installation

1. All the source code for Lite Query is in [one file](https://github.com/Orva-Studio/lite-query/blob/main/src/index.ts), meaning you can copy _all_ the code from this file and place it anywhere in your project.

2. Alternatively, if you'd prefer to add it as a package, you can do so with this command

```bash
npx jsr add @orva/lite-query
```

## Quick Start

Just like with many other data fetching libraries, **Lite Query** requires a **fetcher** function which returns an **error** or the **resolved data**.

Let's say we have a simple fetcher function that fetches data from a URL.

```tsx
import { useQuery } from "./utils/lite-query";

function fetcher(url: string): Promise<unknown> {
  return fetch(url).then((res) => res.json());
}

const { data, error, isLoading, isRefetching, refetch } = useQuery({
  queryKey: "posts",
  queryFn: () => fetcher("https://jsonplaceholder.typicode.com/posts"),
});
```

This needs to be tied to a **unique key** (queryKey) which is used internally to identify your query, just like a key value pair.

The **useQuery** or **useLQ** hook will return an object with this type definition;

```tsx
// types.ts

 interface QueryOutput {
  isLoading: boolean;
  isRefetching: boolean;
  data: unknown | null;
  error: unknown | null;
  refetch: () => void;
}
```

- **isLoading** - Boolean returning true if data has loaded into the cache
- **isRefetching** - Boolean returning true if data has been automatically refetched
- **data** - Returns successfully fetched data from the cache
- **error** - Returns cached error object
- **refetch** - Function to manually refetch data

## Full Example

Here is a more full example of how to use Lite Query.

```tsx
const { data, error, isLoading } = useQuery({
  queryKey: "posts",
  queryFn: () => fetcher("https://jsonplaceholder.typicode.com/posts"),
});

if (isLoading) {
  return <>Loading...</>;
}

if (error) {
  return <>Error: {error.message}</>;
}

return <>{data}</>;
```

The above code will show loading text when a call is made and show error text if an error is thrown.

:::note
Because Lite Query checks if data is in the cache before making an API request it won't make the exact same call twice if it's using the same key.
:::
