/* eslint-disable no-console */
import {type Signal, useSignal} from '@preact/signals'
import {useEffect} from 'preact/hooks'

import {deepSignal} from 'deepsignal'

import {Api} from 'api/manager'
import type {ApiLangKey, ApiLangPack} from 'api/types/langPack'

import {getGlobalState} from 'state/signal'
import {storages} from 'state/storages'

import * as cache from 'lib/cache'

import {DEBUG} from 'common/environment'
import {deepClone} from 'utilities/object/deepClone'
import {updateByKey} from 'utilities/object/updateByKey'

import type {ApiLangCode, LanguagePackKeys} from 'types/lib'

import {createPluralize, interpolate} from './helpers'
import lang from './lang'
import type {Pluralize, TranslateRest} from './types'

const pluralizeFns = new Map<ApiLangCode, Pluralize>()

const _i18n = deepSignal({
  pack: deepClone(lang),
  langCode: 'en',
})
export function TEST_translate<K extends ApiLangKey>(key: K, ...rest: TranslateRest<K>) {
  const {
    settings: {i18n},
  } = getGlobalState()
  const translation = i18n.pack[key]
  const params: Record<string, string | number> = rest[0] || {}
  let pluralizedFn = pluralizeFns.get(i18n.lang_code)

  if (!pluralizedFn) {
    pluralizedFn = createPluralize(i18n.lang_code)
    pluralizeFns.set(i18n.lang_code, pluralizedFn)
  }
  if (typeof translation === 'undefined') {
    // console.error('TRANSLATE NOT FOUND', key)
    // TEST_fetchLanguage(i18n.lang_code)
    TEST_changeLanguage(i18n.lang_code)
    return String(key)
  }
  if (typeof translation === 'string') {
    return interpolate(translation as string, params)
  }

  const pluralKey = pluralizedFn(params.count as number)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pluralizedTranslation: string = (translation as any)[pluralKey]! || translation.other
  if (!pluralizedTranslation) {
    // eslint-disable-next-line no-console
    console.error(`PLURAL KEY ${pluralKey} for`, translation, 'NOT PROVIDED')
    return String(key)
  }
  return interpolate(pluralizedTranslation, params)
}

export async function TEST_changeLanguage(lang: ApiLangCode) {
  const global = getGlobalState()
  /* CAll api, check cache etc */
  // if (lang === global.settings.i18n.lang_code) {
  //   return
  // }

  if (!pluralizeFns.has(lang)) {
    pluralizeFns.set(lang, createPluralize(lang))
  }
  let data: ApiLangPack | undefined

  if (!DEBUG) {
    data = await storages.i18n.getOne(lang)
  }
  if (!data) {
    data = await Api.langPack.getLangPack(lang)

    /*     storages.i18n.put({ // only in production
      [lang]: data,
    }) */
  }

  // batch(() => {
  updateByKey(global.settings.i18n.pack, data!.strings)
  global.settings.i18n.lang_code = data!.langCode
  global.settings.language = data.langCode
  // })

  // updateSettingsState(global, {
  //   i18n: {
  //     pack: data.strings,
  //     lang_code: data.langCode,
  //   },
  // })
}

export async function TEST_fetchLanguage(lang: ApiLangCode) {
  if (!pluralizeFns.has(lang)) {
    pluralizeFns.set(lang, createPluralize(lang))
  }

  return Api.langPack.getLangPack(lang)
}

// pluralUk.select()
/**
 * @deprecated
 */
export function t(key: LanguagePackKeys): Signal<string> {
  const i18n = getGlobalState((state) => state.settings.i18n)
  // Using signals, we avoid rerenders
  /**
   * https://github.com/luisherranz/deepsignal#typescript - why i'm use !
   */
  const translate = i18n.pack[`$${key}`]!

  // if (!translate?.value) {
  //   logDebugError(`[UI]: Translation for «${key}» not found`)
  //   // throw new Error('[UI]: Translation not found')
  //   // return key
  // }
  // console.log(translate)
  return translate as Signal<string>
}

/**
 * @deprecated
 */
export async function changeLanguage(language: ApiLangCode) {
  console.time('PROVIDER_LANGUAGE')
  const global = getGlobalState()
  let data: ApiLangPack | undefined
  // rewrite
  if (!DEBUG) {
    data = await storages.i18n.getOne(language)
  } else {
    console.error('IN DEBUG DOESNT TAKE PACK STORAGE')
  }
  if (!data) {
    data = await Api.langPack.getLangPack(language)

    storages.i18n.put({
      [language]: data,
    })
  }

  updateByKey(global.settings.i18n.pack, data.strings) // Better - (avoid rerendering)

  // updateSettingsState(global, {
  //   i18n: {
  //     pack: data.strings,
  //     lang_code: data.langCode,
  //   },
  // })

  // updateI18nState(global, {
  //   pack: data,
  //   lang_code: language,
  // })
  // Object.assign(global, {
  //   settings: {
  //     i18n: {
  //       pack: data,
  //       lang_code: language,
  //     },
  //   },
  // })

  console.timeEnd('PROVIDER_LANGUAGE')
}
/**
 * @deprecated
 */
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
      value: langString,
    })
  }

  return langString
}
/**
 * @deprecated
 */
export function useTranslateString(str: LanguagePackKeys, language?: ApiLangCode) {
  const translate = useSignal<string | undefined>(undefined)

  /**
   * @todo test it
   */
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
