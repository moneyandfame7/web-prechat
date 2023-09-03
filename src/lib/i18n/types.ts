import {Api} from 'api/manager'
import type {ApiLangCode, ApiLangPack} from 'api/types'

import {getGlobalState} from 'state/signal'
import {storages} from 'state/storages'
import {updateSettingsState} from 'state/updates'

import {DEBUG} from 'common/config'

import type lang from './lang'

// Partial<Record<Intl.LDMLPluralRule, string>>
// type Translation=Record
/**
 * Typescript types - https://github.com/Ayub-Begimkulov/i18n/commit/01366a41da8df9530384125560de0a8c686e5f46 (removed unnecessary)
 */
type Translation = string | Partial<Record<Intl.LDMLPluralRule, string>>
export type Keyset = Record<string, Translation>

type MyKeyset = typeof lang

type TranslateRest<K extends keyof MyKeyset> = MyKeyset[K] extends object
  ? [options: {count: number} & Record<TranslationParameters<MyKeyset[K]>, string | number>]
  : IsNever<TranslationParameters<MyKeyset[K]>> extends true
  ? never[] // or any object pass just
  : [options: Record<TranslationParameters<MyKeyset[K]>, string | number>]

type Pluralize = ReturnType<typeof createPluralize>

const pluralizeFns = new Map<ApiLangCode, Pluralize>()

export function TEST_translate<K extends keyof MyKeyset>(key: K, ...rest: TranslateRest<K>) {
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
    console.error('TRANSLATE NOT FOUND', key)
    // TEST_fetchLanguage(i18n.lang_code)
    TEST_changeLanguage(i18n.lang_code)
    return String(key)
  }
  if (typeof translation === 'string') {
    return interpolate(translation as string, params)
  }

  const pluralKey = pluralizedFn(params.count as number)

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

    storages.i18n.put({
      [lang]: data,
    })
  }

  updateSettingsState(global, {
    i18n: {
      pack: data.strings,
      lang_code: data.langCode,
    },
  })
}

export async function TEST_fetchLanguage(lang: ApiLangCode) {
  if (!pluralizeFns.has(lang)) {
    pluralizeFns.set(lang, createPluralize(lang))
  }

  return Api.langPack.getLangPack(lang)
}

const regexp = /{{(\w+)}}/g
function interpolate(string: string, params: Record<string, string | number>) {
  return string.replace(regexp, (original, paramKey) => {
    if (paramKey in params) {
      return String(params[paramKey])
    }

    return original
  })
}

function createPluralize(locale: ApiLangCode) {
  const rules = new Intl.PluralRules(locale)

  return (count: number) => {
    return rules.select(count)
  }
}

type TranslationParameters<Translation extends string | Record<string, string>> =
  Translation extends Record<string, string>
    ? TranslationParameters<Translation[keyof Translation]>
    : Translation extends string
    ? string extends Translation
      ? never
      : TranslationParametersKeys<Translation>
    : never

type TranslationParametersKeys<
  Translation extends string,
  Params extends string = never
> = Translation extends `${string}{{${infer Param}}}${infer Rest}`
  ? TranslationParametersKeys<Rest, Params | TrimString<Param>>
  : Params

type TrimString<TString extends string> = TString extends `${' '}${infer Rest}`
  ? TrimString<Rest>
  : TString extends `${infer Rest}${' '}`
  ? TrimString<Rest>
  : TString

// need use as const for work
const obj = {
  HelloInterpolate: 'Hello, {{aboba}}',
} as const
type Test = TranslationParameters<typeof obj.HelloInterpolate>

type IsNever<T> = [T] extends [never] ? true : false
