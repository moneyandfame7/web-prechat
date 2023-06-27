import { client } from 'api/client'
import {
  QUERY_COUNTRIES,
  QUERY_LANG,
  QUERY_LANG_STRING,
  QUERY_LANG_WITH_COUNTRIES
} from 'api/graphql'

import type { Country, FetchLanguage } from 'types/api'
import type { SupportedLanguages, LanguagePack } from 'types/lib'

export async function fetchCountries(language: SupportedLanguages) {
  return client.query<{
    countries: Country[]
  }>({
    query: QUERY_COUNTRIES,
    fetchPolicy: 'cache-first',
    variables: {
      language
    }
  })
}

export async function fetchLanguage(language: SupportedLanguages) {
  return client.query<{
    language: {
      pack: FetchLanguage['pack']
    }
  }>({
    query: QUERY_LANG,
    variables: {
      language
    },
    fetchPolicy: 'cache-first'
  })
}

export async function fetchLanguageWithCountries(language: SupportedLanguages) {
  return client.query<{ language: FetchLanguage }>({
    query: QUERY_LANG_WITH_COUNTRIES,
    variables: {
      language
    },
    fetchPolicy: 'cache-first'
  })
}

export async function fetchLanguageString(
  language: SupportedLanguages,
  string: keyof LanguagePack
) {
  return client.query<{ languageString: string }>({
    query: QUERY_LANG_STRING,
    variables: {
      language,
      string
    }
  })
}
