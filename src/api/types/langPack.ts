import type lang from 'lib/i18n/lang'

export interface ApiCountry {
  name: string
  emoji: string
  code: string
  dial_code: string
}

export type ApiLangCode = 'uk' | 'en' | 'de' | 'pl'
export type ApiLangKey = keyof typeof lang
export type ApiLangPack = {
  langCode: ApiLangCode
  strings: typeof lang
}
export interface ApiLanguage {
  name: string
  langCode: ApiLangCode
  nativeName: string
  stringsCount: number
}

export interface GetLangStringInput {
  code: ApiLangCode
  key: ApiLangKey
}
