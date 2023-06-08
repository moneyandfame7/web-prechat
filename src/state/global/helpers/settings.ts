import type { Theme } from 'state/global/types'
import type { SupportedLanguagesList } from 'state/i18n/types'

export const prefferedTheme: Theme = window.matchMedia(
  '(prefers-color-scheme: dark)'
).matches
  ? 'dark'
  : 'light'

export const languagesList: SupportedLanguagesList = [
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
