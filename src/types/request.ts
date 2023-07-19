import type {CacheName} from 'lib/cache'

export interface RequestResponse {
  connection: Connection
}
export interface RequestOptions {
  url: string
  cacheName: CacheName
  /** is ms */
  expiration: number
  withCache?: boolean
}
export type RequestName = keyof RequestResponse
export type ClientRequest = {
  [K in RequestName]: RequestOptions
}

/**
 * FetchConnection
 */
export interface Connection {
  ipVersion: number
  ipAddress: string
  latitude: number
  longitude: number
  countryName: string
  countryCode: string
  continentCode: string
  continent: string
  timeZone: string
  zipCode: string
  cityName: string
  regionName: string
}
