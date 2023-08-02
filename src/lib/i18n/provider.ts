import {updateGlobalState} from 'state/persist'
// import {deepClone} from 'utilities/deepClone'
/* eslint-disable no-console */
import {type Signal, useSignal} from '@preact/signals'
import {useEffect} from 'preact/hooks'

import * as cache from 'lib/cache'

import type {LanguagePackKeys, SupportedLanguages} from 'types/lib'
import type {FetchLanguage} from 'types/api'

import {getGlobalState} from 'state/signal'
import {logDebugError, logDebugWarn} from 'lib/logger'
import {Api} from 'api/client'
// import {DEBUG} from 'common/config'
import {DEBUG} from 'common/config'
import {hasSession} from 'state/helpers/auth'

async function fetchLanguage(language: SupportedLanguages) {
  const response = await Api.help.getLanguage(language)

  return response.data.language
}

export function t(key: LanguagePackKeys): Signal<string> {
  const i18n = getGlobalState((state) => state.settings.i18n)

  const translate = i18n.pack[`$${key}`] as unknown as Signal<string>
  if (!translate?.value) {
    logDebugError(`[UI]: Translation for «${key}» not found`)
    // throw new Error('[UI]: Translation not found')
    // return key
  }
  return translate
}

export async function changeLanguage(language: SupportedLanguages) {
  // const state = getGlobalState()
  let data

  if (!DEBUG) {
    data = (await cache.get('prechat-i18n-pack', language)) as FetchLanguage
  }
  if (!data) {
    logDebugWarn('[UI]: I18n fetch language PACK')

    data = await fetchLanguage(language)
    cache.add({
      name: 'prechat-i18n-pack',
      key: language,
      value: data
    })
  }

  // state.settings = {
  //   ...state.settings,
  //   i18n: {
  //     pack: deepClone(data.pack),
  //     lang_code: language,
  //     countries: deepClone(data.countries),
  //     errors: deepClone(data.errors)
  //   }
  // }
  updateGlobalState(
    {
      settings: {
        i18n: {
          pack: data.pack,
          lang_code: language,
          countries: data.countries,
          errors: data.errors
        }
      }
    },
    hasSession()
  )
}

export async function translateByString(
  language: SupportedLanguages,
  str: LanguagePackKeys
) {
  const i18n = getGlobalState((state) => state.settings.i18n)

  if (language === i18n.lang_code) {
    return t(str)
  }

  let langString = await cache.get('prechat-i18n-string', str)
  if (!langString) {
    const {data} =
      /* await callApi('fetchLanguageString', language, str) */ await Api.help.getLanguageString(
        language,
        str
      )
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
        (value) =>
          (translate.value = typeof value === 'string' ? value : (value as Signal).value)
      )
    }
  }, [language, str])

  return translate
}
