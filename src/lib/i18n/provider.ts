/* eslint-disable no-console */
import { Signal, useSignal } from '@preact/signals'
import { useEffect } from 'preact/hooks'
import deepOmit from 'omit-deep-lodash'

import { callApi } from 'api/provider'
import * as cache from 'lib/cache'

import type { LanguagePackKeys, SupportedLanguages } from 'types/lib'
import type { FetchLanguage } from 'types/api'

import { getGlobalState } from 'state/signal'
import { updateGlobalState } from 'state/persist'
import { logDebugError, logDebugWarn } from 'lib/logger'
import { DEBUG } from 'common/config'

export function t(key: LanguagePackKeys): Signal<string> {
  const i18n = getGlobalState((state) => state.settings.i18n)

  const translate = i18n.pack[`$${key}`] as unknown as Signal<string>

  if (!translate?.value) {
    logDebugError(`[UI]: Translation for «${key}» not found`)
    // throw new Error('[UI]: Translation not found')
  }
  return translate
}

export async function changeLanguage(language: SupportedLanguages) {
  logDebugWarn('[UI]: I18n provider was called')

  let data = DEBUG ? undefined : ((await cache.get('prechat-i18n-pack', language)) as FetchLanguage)
  if (!data) {
    const response = await callApi('fetchLanguage', language)
    data = deepOmit(response.data.language, ['__typename']) as FetchLanguage
    cache.add({
      name: 'prechat-i18n-pack',
      key: language,
      value: data
    })
  }

  updateGlobalState({
    settings: {
      i18n: {
        pack: data.pack,
        lang_code: language,
        countries: data.countries,
        errors: data.errors
      }
    }
  })
}

export async function translateByString(language: SupportedLanguages, str: LanguagePackKeys) {
  const i18n = getGlobalState((state) => state.settings.i18n)

  if (language === i18n.lang_code) {
    return t(str)
  }

  let langString = await cache.get('prechat-i18n-string', str)
  if (!langString) {
    const { data } = await callApi('fetchLanguageString', language, str)
    langString = data.languageString
    await cache.add({
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
