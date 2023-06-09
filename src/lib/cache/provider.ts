import type { CacheOptions, CacheResponse, CacheName } from './types'

// eslint-disable-next-line no-restricted-globals
const storageCache = self.caches

export async function add({ name, key, value, expiration }: CacheOptions) {
  const cache = await storageCache.open(name)

  const item: CacheResponse = {
    value: value instanceof Response ? await value.json() : value,
    expiration: expiration ? Date.now() + expiration : undefined
  }

  const response = new Response(JSON.stringify(item))
  await cache.put(key, response)
}

export async function get(name: CacheName, key: string) {
  const cache = await storageCache.open(name)

  const response = await cache.match(key)

  if (!response) {
    return null
  }
  const item = (await response.json()) as CacheResponse

  if (item.expiration && Date.now() > item.expiration) {
    // eslint-disable-next-line no-console
    console.warn(`[UI]: Cache "${name}" for  «${key}» was expired`)
    await cache.delete(key)
    return null
  }

  return item.value
}

export async function remove(name: CacheName, key: string) {
  const cache = await storageCache.open(name)
  await cache.delete(key)
}

export async function clear(name: CacheName) {
  try {
    return await storageCache.delete(name)
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn(err)
    return null
  }
}
