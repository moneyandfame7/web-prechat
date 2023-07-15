export type CacheName =
  | 'prechat-i18n-pack'
  | 'prechat-i18n-string'
  | 'prechat-files'
  | 'prechat-assets'
  | 'prechat-avatars'
  | 'prechat-important'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type CacheTypeToSave = Response | Record<string, any> | string | number

export interface CacheOptions {
  name: CacheName
  key: string
  value: CacheTypeToSave
  /* In ms */
  expiration?: number
}
export interface CacheResponse {
  expiration?: number
  value: CacheTypeToSave
}
