import type lang from 'lib/i18n/lang'

export type ApiLangCode = 'en' | 'uk' | 'pl' | 'de'
export type SupportedLanguagesList = Array<{
  value: ApiLangCode
  label: string
}>
export type LanguagePack = typeof lang

export type LanguagePackKeys = keyof LanguagePack
