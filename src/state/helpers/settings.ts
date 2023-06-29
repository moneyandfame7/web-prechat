import type { SupportedLanguages, SupportedLanguagesList } from 'types/lib'
import type { Theme } from 'types/state'

export const PREFERRED_THEME: Theme = window.matchMedia('(prefers-color-scheme: dark)').matches
  ? 'dark'
  : 'light'

export const LANGUAGES_LIST: SupportedLanguagesList = [
  {
    value: 'de',
    label: 'Deutsch'
  },
  {
    value: 'pl',
    label: 'Polski'
  },
  {
    value: 'uk',
    label: 'Українська'
  },
  {
    value: 'en',
    label: 'English'
  }
]

export const LANGUAGES_CODE_ARRAY: SupportedLanguages[] = ['en', 'uk', 'pl', 'de']
