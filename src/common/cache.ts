// eslint-disable-next-line no-restricted-globals
const storageCache = self.caches
// export const I18N_STORAGE_KEY =
// export const I18N_STRING_STORAGE_KEY =

// export const FILES_STORAGE_KEY =
// export const AVATARS_STORAGE_KEY =

export type CacheName =
  | 'prechat-i18n-pack'
  | 'prechat-i18n-string'
  | 'prechat-files'
  | 'prechat-avatars'
  | 'prechat-important'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CacheTypeToSave = Response | Record<string, any> | string | number

interface CacheOptions {
  name: CacheName
  key: string
  value: CacheTypeToSave
  /* In ms */
  expiration?: number
}
interface CacheResponse {
  expiration?: number
  value: CacheTypeToSave
}
export async function addToCache({ name, key, value, expiration }: CacheOptions) {
  const cache = await storageCache.open(name)

  const item: CacheResponse = {
    value: value instanceof Response ? await value.json() : value,
    expiration: expiration ? Date.now() + expiration : undefined
  }

  const response = new Response(JSON.stringify(item))
  await cache.put(key, response)
}

export async function getFromCache(name: CacheName, key: string) {
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

export async function removeFromCache(name: CacheName, key: string) {
  const cache = await storageCache.open(name) // Відкрити кеш з ім'ям 'my-cache'
  await cache.delete(key) // Видалити відповідь з кешу за ключем
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
