---
title: Data Caching
description: How Lite Query handles data caching.
---

By default, Lite Query uses the JavaScript [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) object to store data in memory.

At this moment in time there is no easy way to change this without updating the source code. But the purpose of Lite Query is for it to be easy to edit and customise to your needs, so editing source code is absolutely fine.

However, the rest of the documentation is only valid if you are using the default **Map** object for data caching.

## Viewing the Cache

For debugging purposes, you can view the cache by using the **queryCache** variable.

```tsx
import { queryCache } from "./utils/lite-query";

console.log(queryCache);
```

And here is an example of what the result might look like.

```js
Map(1) {
  'posts' => {
    controller: undefined,
    payload: [{...}, {...}, {...}],
    status: 'success',
    timestamp: 1725191621309
  },
}
```
Let's go through each of the properties in the cache.

### controller

The AbortController used to abort the fetch request. This is used to prevent **race conditions**.

Read more about [aborting](/guides/features/aborting/) in the documentation.

### payload

The data returned from the fetch request.

### status

The status of the fetch request. A request can be in one of the following states:

- **idle** - The request has not been made yet.
- **loading** - The request is currently being made.
- **refetching** - The request is currently being made and the data is stale.
- **error** - The request has failed.
- **success** - The request has succeeded.

These states are used internally to determine how to handle the data.

### timestamp

The timestamp of when the data was fetched.

This is used to determine if the data is stale and if automatic refetching should be triggered.
