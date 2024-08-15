export interface UserConnection {
  ipVersion: number
  ipAddress: string
  latitude: number
  longitude: number
  countryName: string
  countryCode: string
  timeZone: string
  zipCode: string
  cityName: string
  regionName: string
  isProxy: boolean
  continent: string
  continentCode: string
  currency: UserCurrency
  language: string
  timeZones: string[]
  tlds: string[]
}

export interface UserCurrency {
  code: string
  name: string
}
