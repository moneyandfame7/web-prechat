import * as cache from 'lib/cache'

import type { Connection } from 'types/request'
import { milliseconds } from 'utilities/ms'

interface RequestResponse {
  connection: Connection
}
type RequestName = keyof RequestResponse

interface Test {
  url: string
  cacheName: cache.CacheName
  expiration: number
  withCache?: boolean
}

const requests: Record<RequestName, Test> = {
  connection: {
    url: 'https://freeipapi.com/api/json',
    cacheName: 'prechat-important',
    expiration: milliseconds({ hours: 1 }),
    withCache: true
  }
}

export async function makeRequest<T extends RequestName>(name: T) {
  try {
    const { expiration, cacheName, url, withCache } = requests[name]

    if (!withCache || !cacheName) {
      const response = await fetch(url)

      return (await response.json()) as RequestResponse[T]
    }
    let response = await cache.get(cacheName, name)

    if (!response) {
      response = await fetch(url)

      await cache.add({ name: cacheName, key: name, value: response.clone(), expiration })
    }
    return (await (response instanceof Response ? response.json() : response)) as RequestResponse[T]
  } catch (e) {
    if (e instanceof Error) {
      throw new Error(e.message)
    }
    throw new Error(`[${name}] Request Error `)
  }
}
