import {getGlobalState} from 'state/signal'

import type {ApiLangCode, SupportedLanguagesList} from 'types/lib'
import type {Theme} from 'types/state'

export function getPreferredAnimations() {
  const global = getGlobalState()

  return global.settings.general.animations
}

export const LANGUAGES_LIST: SupportedLanguagesList = [
  {
    value: 'de',
    label: 'Deutsch',
  },
  {
    value: 'pl',
    label: 'Polski',
  },
  {
    value: 'uk',
    label: 'Українська',
  },
  {
    value: 'en',
    label: 'English',
  },
]

export const LANGUAGES_CODE_ARRAY: ApiLangCode[] = ['en', 'uk', 'pl', 'de']

export function changeTheme(theme: Theme) {
  switch (theme) {
    case 'dark':
      document.documentElement.classList.add('night')
      break
    case 'light':
      document.documentElement.classList.remove('night')
      break
    case 'system': {
      const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)')

      if (prefersDarkMode.matches) {
        document.documentElement.classList.add('night')
      } else {
        document.documentElement.classList.remove('night')
      }
    }
  }
}

export function toggleAnimations(enabled: boolean) {
  if (enabled) {
    document.documentElement.classList.remove('animation-none')
  } else {
    document.documentElement.classList.add('animation-none')
  }
}

export function changeMessageSize(size: number) {
  // document.documentElement?.attributeStyleMap?.set('--message-text-size', `${size}px`)
  document.documentElement.style.setProperty('--message-text-size', `${size}px`)
}
