import type lang from 'lib/i18n/lang'
import type errors from 'lib/i18n/errors'

export type SupportedLanguages = 'en' | 'uk' | 'pl' | 'de'
export type SupportedLanguagesList = Array<{
  value: SupportedLanguages
  label: string
}>
export type LanguagePack = typeof lang
export type ErrorPack = typeof errors

export type LanguagePackKeys = keyof LanguagePack
export type ErrorPackKeys = keyof ErrorPack
