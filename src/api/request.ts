import * as cache from 'lib/cache'

import type { Connection } from 'types/request'

interface RequestResponse {
  connection: Connection
}

const requestsUrls: Record<keyof RequestResponse, string> = {
  connection: 'https://freeipapi.com/api/json'
}

type RequestName = keyof RequestResponse

export async function makeRequest<T extends RequestName>(
  name: T,
  cacheName?: cache.CacheName,
  withCache?: boolean,
  expiration?: number
) {
  try {
    if (!withCache || !cacheName) {
      const response = await fetch(requestsUrls[name])

      return (await response.json()) as RequestResponse[typeof name]
    }
    let response = await cache.get(cacheName, name)

    if (!response) {
      response = await fetch(requestsUrls[name])

      await cache.add({ name: cacheName, key: name, value: response.clone(), expiration })
    }
    return (await (response instanceof Response
      ? response.json()
      : response)) as RequestResponse[typeof name]
  } catch (e) {
    if (e instanceof Error) {
      throw new Error(e.message)
    }
    throw new Error(`[${name}] Request Error `)
  }
}
