import {fetchJson} from './fetchJson'

type FetchDelay = ((err: unknown) => number) | number
export async function retryFetch<T>(
  url: string,
  withCache = false,
  maxRetries = 3,
  delay: FetchDelay = 1000
): Promise<T> {
  let retries = 0

  while (retries < maxRetries) {
    try {
      return await fetchJson<T>(url, withCache)
    } catch (error) {
      // Log the error or handle it as needed
      // eslint-disable-next-line no-console
      console.error(`Fetch attempt ${retries + 1} failed: ${error}`)

      // Retry after the specified delay
      const processedDelay = typeof delay === 'function' ? delay(error) : delay

      await new Promise((resolve) => setTimeout(resolve, processedDelay))
      retries++
    }
  }

  throw new Error(`Max retries (${maxRetries}) reached. Unable to fetch data.`)
}
