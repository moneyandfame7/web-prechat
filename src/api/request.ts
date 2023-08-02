import {logDebugInfo} from 'lib/logger'

import type {Connection} from 'types/request'
import {fetchJson} from 'utilities/fetchJson'

interface RequestResponse {
  connection: Connection
}
type RequestName = keyof RequestResponse

const requests: Record<RequestName, string> = {
  connection: 'https://freeipapi.com/api/json'
}

export async function makeRequest<T extends RequestName>(name: T) {
  try {
    const url = requests[name]
    logDebugInfo(`[GET REQUEST]: ${name}`)
    return fetchJson<RequestResponse[T]>(url)
  } catch (e) {
    throw new Error(`[${name}] Request Error `)
  }
}
