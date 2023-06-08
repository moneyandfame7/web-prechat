import { batch } from '@preact/signals'

import { deepSignal } from 'deepsignal'
import { getGlobalState, updateGlobalState } from 'state/global/signal'

import { en } from './keys/en'
import type { SupportedLanguages, SupportedLanguagesList } from './types'

interface I18NProperties {
  languageList: SupportedLanguagesList
  currentLanguagePack: typeof en
  currentLanguage: SupportedLanguages
}

function initializeI18n() {
  console.log('CHANGE LANGUAGE 🇺🇦')
  const lng = getGlobalState((state) => state.language)

  changeLanguage(lng)
}

const initialState: I18NProperties = {
  languageList: [
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
  ],
  currentLanguagePack: en,
  currentLanguage: 'en'
}

const i18n = deepSignal(initialState)

initializeI18n()

export const t = (key: keyof typeof en) => {
  const translate = i18n.currentLanguagePack[key]
  if (!translate) {
    throw new Error('Translate key not found')
  }

  return i18n.currentLanguagePack[`$${key}`]!
}

export async function loadLanguagePack(lng: SupportedLanguages) {
  return import(`./keys/${lng}.ts`).then((module) => module[lng] as typeof en)
}

export function changeLanguage(lng: SupportedLanguages) {
  batch(() => {
    i18n.currentLanguage = lng
    loadLanguagePack(lng).then((pack) => {
      i18n.currentLanguagePack = pack
    })
    updateGlobalState({ language: lng })
  })
}
export function getCurrentLanguage() {
  return i18n.$currentLanguage!
}

export function getLanguagesList() {
  return i18n.$languageList!
}
