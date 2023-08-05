// import {deepClone} from 'utilities/deepClone'
/* eslint-disable no-console */
import {type Signal, useSignal} from '@preact/signals'
import {useEffect} from 'preact/hooks'

import * as cache from 'lib/cache'
import {Api} from 'api/manager'

import type {LanguagePackKeys, ApiLangCode} from 'types/lib'

import {getGlobalState} from 'state/signal'
import {DEBUG} from 'common/config'
import type {ApiLanguagePack} from 'api/types/langPack'
import {updateI18nState} from 'state/updates'

export function t(key: LanguagePackKeys): Signal<string> {
  const i18n = getGlobalState((state) => state.settings.i18n)
  // Using signals, we avoid rerenders
  const translate = i18n.pack[`$${key}`] as unknown as Signal<string>
  // if (!translate?.value) {
  //   logDebugError(`[UI]: Translation for «${key}» not found`)
  //   // throw new Error('[UI]: Translation not found')
  //   // return key
  // }
  // console.log(translate)
  return translate
}

export async function changeLanguage(language: ApiLangCode) {
  console.time('PROVIDER_LANGUAGE')
  const global = getGlobalState()
  let data

  if (!DEBUG) {
    data = (await cache.get('prechat-i18n-pack', language)) as ApiLanguagePack
  }
  if (!data) {
    data = await Api.langPack.getLangPack(language)
    cache.add({
      name: 'prechat-i18n-pack',
      key: language,
      value: data
    })
  }

  updateI18nState(global, {
    pack: data,
    lang_code: language
  })
  // Object.assign(global, {
  //   settings: {
  //     i18n: {
  //       pack: data,
  //       lang_code: language
  //     }
  //   }
  // })
  global.settings.language = language

  console.timeEnd('PROVIDER_LANGUAGE')
}

export async function translateByString(code: ApiLangCode, key: LanguagePackKeys) {
  const i18n = getGlobalState((state) => state.settings.i18n)

  if (code === i18n.lang_code) {
    return t(key)
  }

  let langString = (await cache.get('prechat-i18n-string', key)) as string
  if (!langString) {
    langString = await Api.langPack.getLangString({code, key})

    await cache.add({
      name: 'prechat-i18n-string',
      key,
      value: langString
    })
  }

  return langString
}

export function useTranslateString(str: LanguagePackKeys, language?: ApiLangCode) {
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
