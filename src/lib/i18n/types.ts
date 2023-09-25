import type {IsNever} from 'types/common'

import type {createPluralize} from './helpers'
import type lang from './lang'

// Partial<Record<Intl.LDMLPluralRule, string>>
// type Translation=Record
/**
 * Typescript types - https://github.com/Ayub-Begimkulov/i18n/commit/01366a41da8df9530384125560de0a8c686e5f46 (removed unnecessary)
 */
export type Translation = string | Partial<Record<Intl.LDMLPluralRule, string>>
export type Keyset = Record<string, Translation>

export type MyKeyset = typeof lang

export type TranslateRest<K extends keyof MyKeyset> = MyKeyset[K] extends object
  ? [options: {count: number} & Record<TranslationParameters<MyKeyset[K]>, string | number>]
  : IsNever<TranslationParameters<MyKeyset[K]>> extends true
  ? never[] // or any object pass just
  : [options: Record<TranslationParameters<MyKeyset[K]>, string | number>]

export type Pluralize = ReturnType<typeof createPluralize>

// eslint-disable-next-line @typescript-eslint/no-shadow
export type TranslationParameters<Translation extends string | Record<string, string>> =
  Translation extends Record<string, string>
    ? TranslationParameters<Translation[keyof Translation]>
    : Translation extends string
    ? string extends Translation
      ? never
      : TranslationParametersKeys<Translation>
    : never

export type TranslationParametersKeys<
  // eslint-disable-next-line @typescript-eslint/no-shadow
  Translation extends string,
  Params extends string = never
> = Translation extends `${string}{{${infer Param}}}${infer Rest}`
  ? TranslationParametersKeys<Rest, Params | TrimString<Param>>
  : Params

export type TrimString<TString extends string> = TString extends `${' '}${infer Rest}`
  ? TrimString<Rest>
  : TString extends `${infer Rest}${' '}`
  ? TrimString<Rest>
  : TString
