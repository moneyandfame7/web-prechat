import type { Connection } from 'types/request'

const requestsUrls = {
  connection: 'https://freeipapi.com/api/json',
  emojis: 'https://cdn.jsdelivr.net/npm/@emoji-mart/data'
}

type RequestResponse = {
  connection: Connection
  emojis: any
}
type RequestName = keyof typeof requestsUrls & keyof RequestResponse

export async function makeRequest<T extends RequestName>(name: T) {
  try {
    const response = await fetch(requestsUrls[name])
    return (await response.json()) as RequestResponse[typeof name]
  } catch (e) {
    if (e instanceof Error) {
      throw new Error(e.message)
    }
    throw new Error(`[${name}] Request Error `)
  }
}
