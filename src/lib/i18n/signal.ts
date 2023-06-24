import { Signal, batch, useSignal } from '@preact/signals'
import { useEffect } from 'preact/hooks'

import { deepSignal } from 'deepsignal'

import { updateGlobalState } from 'state/signal'
import type { SupportedLanguages } from 'types/lib'
import * as cache from 'common/cache'
import { en } from './keys/en'
import { updateSettingsState } from 'state/helpers/settings'

interface I18NProperties {
  currentLanguagePack: typeof en
  currentLanguage: SupportedLanguages
}
const LANGUAGE_CACHE_NAME = 'prechat-languages'

const initialState: I18NProperties = {
  currentLanguagePack: en,
  currentLanguage: 'en'
}

const i18n = deepSignal(initialState)
export const t = (key: keyof typeof en) => {
  const translate = i18n.currentLanguagePack[key]
  if (!translate) {
    throw new Error('Translate key not found')
  }

  return i18n.currentLanguagePack[`$${key}`]!
}

async function loadLanguagePack(lng: SupportedLanguages) {
  return import(`./keys/${lng}.ts`).then((module) => module[lng] as typeof en)
}

export function useTranslateForString(key: keyof typeof en, lng?: SupportedLanguages) {
  const translate = useSignal<string | undefined>(undefined)
  useEffect(() => {
    if (!key || !lng) {
      return
    }
    if (i18n.currentLanguage === lng) {
      translate.value = i18n.currentLanguagePack[key]
    } else {
      loadLanguagePack(lng).then((pack) => (translate.value = pack[key]))
    }
  }, [lng, key])
  return typeof translate.value === 'undefined' ? undefined : (translate as Signal<string>)
}

export function changeLanguage(lng: SupportedLanguages) {
  batch(() => {
    i18n.currentLanguage = lng
    loadLanguagePack(lng).then((pack) => {
      i18n.currentLanguagePack = pack
      // cache.set({ name: LANGUAGE_CACHE_NAME, key: lng, data: pack })
    })
    updateGlobalState({
      settings: {
        language: lng
      }
    })
  })
}

export async function setLanguage(lng: SupportedLanguages) {
  /* check if exist in cache */
  let newPack: Record<string, string> = await cache.get({ name: LANGUAGE_CACHE_NAME, key: lng })

  if (!newPack) {
    newPack = await loadLanguagePack(lng)
  }

  batch(() => {
    i18n.currentLanguage = lng
    i18n.currentLanguagePack = newPack as any
    updateSettingsState({
      language: lng
    })
  })
}
export function getCurrentLanguage() {
  return i18n.$currentLanguage!
}
