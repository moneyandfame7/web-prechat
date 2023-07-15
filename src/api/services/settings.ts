import type {ApolloClient, NormalizedCacheObject} from '@apollo/client'
import type {Country, FetchLanguage} from 'types/api'
import type {LanguagePackKeys, SupportedLanguages} from 'types/lib'

import {QUERY_COUNTRIES, QUERY_LANG, QUERY_LANG_STRING} from 'api/graphql'

export class ApiSettings {
  public constructor(
    private readonly client: ApolloClient<NormalizedCacheObject>
  ) {}

  public async fetchCountries(language: SupportedLanguages) {
    return this.client.query<{
      countries: Country[]
    }>({
      query: QUERY_COUNTRIES,
      fetchPolicy: 'cache-first',
      variables: {
        language
      }
    })
  }

  public async fetchLanguage(language: SupportedLanguages) {
    return this.client.query<{
      language: {
        pack: FetchLanguage['pack']
      }
    }>({
      query: QUERY_LANG,
      fetchPolicy: 'cache-first',
      variables: {
        language
      }
    })
  }

  public async fetchLanguageString(
    language: SupportedLanguages,
    string: LanguagePackKeys
  ) {
    return this.client.query<{languageString: string}>({
      query: QUERY_LANG_STRING,
      variables: {
        language,
        string
      }
    })
  }
}
