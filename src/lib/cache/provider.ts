import type {CacheOptions, CacheResponse, CacheName} from './types'

// eslint-disable-next-line no-restricted-globals
const storageCache = self.caches || window.caches

/* Not supported in non-secured ( http ) */
export function isCacheApiSupported() {
  return Boolean(storageCache)
}

export async function add({name, key, value, expiration}: CacheOptions) {
  if (!storageCache) {
    return
  }
  const cache = await storageCache.open(name)

  const item: CacheResponse = {
    value: value instanceof Response ? await value.json() : value,
    expiration: expiration ? Date.now() + expiration : undefined
  }

  const response = new Response(JSON.stringify(item))

  await cache.put(key, response)
}

export async function get(name: CacheName, key: string) {
  if (!storageCache) {
    return undefined
  }

  try {
    const cache = await storageCache.open(name)
    const response = await cache.match(key)

    if (!response) {
      return undefined
    }
    const item = await response.json()

    return item
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn(e)
  }
}

export async function remove(name: CacheName, key: string) {
  if (!storageCache) {
    return false
  }
  const cache = await storageCache.open(name)
  await cache.delete(key)

  return true
}

export async function clear(name: CacheName) {
  if (!storageCache) {
    return false
  }
  try {
    return await storageCache.delete(name)
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn(err)
    return false
  }
}
