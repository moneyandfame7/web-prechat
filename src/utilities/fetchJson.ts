import * as cache from 'lib/cache'

export async function fetchJson<T>(url: string, cached = false): Promise<T> {
  // const res = await fetch(url)
  let res = cached ? await cache.get('prechat-assets', url) : undefined
  if (!res) {
    res = await (await fetch(url)).json()
    if (cached) {
      cache.add({name: 'prechat-assets', key: url, value: res})
    }
  }

  return res
}
