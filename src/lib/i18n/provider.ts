import { Signal, useSignal } from '@preact/signals'
import { useEffect } from 'preact/hooks'

import { callApi } from 'api/provider'
import type { LanguagePackKeys, SupportedLanguages } from 'types/lib'

import * as cache from 'common/cache'

import { getGlobalState } from 'state/signal'
import { updateGlobalState } from 'state/persist'

export function t(key: LanguagePackKeys): Signal<string> {
  const i18n = getGlobalState((state) => state.settings.i18n)

  const translate = i18n.pack[`$${key}`] as unknown as Signal<string>

  if (!translate?.value) {
    console.error(`[UI]: Translation for «${key}» not found`)
    // throw new Error('[UI]: Translation not found')
  }
  return translate
}

export async function changeLanguage(language: SupportedLanguages) {
  // let newPack: LanguagePack

  /* check in caches.api, if not exist - fetch */
  const { data } = await callApi('fetchLanguage', language)
  console.log('AY')
  updateGlobalState({
    settings: {
      i18n: {
        pack: data.language.pack,
        lang_code: language
      }
    }
  })
}

export async function translateByString(language: SupportedLanguages, str: LanguagePackKeys) {
  const i18n = getGlobalState((state) => state.settings.i18n)

  if (language === i18n.lang_code) {
    return t(str)
  }

  let langString = await cache.getFromCache('prechat-i18n-string', str)
  if (!langString) {
    const { data } = await callApi('fetchLanguageString', language, str)
    langString = data.languageString
    await cache.addToCache({
      name: 'prechat-i18n-string',
      key: str,
      value: langString
    })
  }

  return langString
}

export function useTranslateString(str: LanguagePackKeys, language?: SupportedLanguages) {
  const translate = useSignal<string | undefined>(undefined)

  useEffect(() => {
    if (language) {
      translateByString(language, str).then(
        (value) => (translate.value = typeof value === 'string' ? value : (value as Signal).value)
      )
    }
  }, [language, str])

  return translate
}