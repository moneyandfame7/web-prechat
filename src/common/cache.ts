interface GetCacheOptions {
  name: string
  key: string
}
type CacheType = string | Record<string, any>
type SetCacheOptions = GetCacheOptions & { data: CacheType }
export async function get({ name, key }: GetCacheOptions) {
  try {
    const cache = await caches.open(name)
    const request = new Request(key)

    const response = await cache.match(request)
    return await response?.json()
  } catch (e) {
    if (e instanceof Error) {
      throw new Error(e.message)
    }
  }
}

export async function set({ name, key, data }: SetCacheOptions) {
  try {
    const cache = await caches.open(name)
    const request = new Request(key)
    const response = new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' }
    })
    await cache.put(request, response)
  } catch (e) {
    if (e instanceof Error) {
      throw new Error(e.message)
    }
  }
}
