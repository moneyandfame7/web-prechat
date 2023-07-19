import type {Country, FetchLanguage} from 'types/api'
import type {LanguagePackKeys, SupportedLanguages} from 'types/lib'
import type {Query} from 'api/apollo'

import {QUERY_COUNTRIES, QUERY_LANG, QUERY_LANG_STRING} from 'api/graphql'
import {BaseService} from './base'

export interface ApiHelpMethods {
  getCountries: (language: SupportedLanguages) => Query<{countries: Country[]}>

  getLanguage: (
    language: SupportedLanguages
  ) => Query<{language: FetchLanguage}>

  getLanguageString: (
    language: SupportedLanguages,
    string: LanguagePackKeys
  ) => Query<{languageString: string}>
}
/**
 * This class provides various helper methods for the client.
 */
export class ApiHelp extends BaseService implements ApiHelpMethods {
  /**
   *
   * @param language Language code.
   * @returns List of countries ( emoji, dial_code, code, label ) for provided language code.
   */
  public async getCountries(
    language: SupportedLanguages
  ): Query<{countries: Country[]}> {
    return this.client.query<{countries: Country[]}>({
      query: QUERY_COUNTRIES,
      fetchPolicy: 'cache-first',
      variables: {
        language
      }
    })
  }

  /**
   * @param language Language code.
   * @returns Language pack for provided language code.
   */
  public async getLanguage(
    language: SupportedLanguages
  ): Query<{language: FetchLanguage}> {
    return this.client.query<{language: FetchLanguage}>({
      query: QUERY_LANG,
      fetchPolicy: 'cache-first',
      variables: {
        language
      }
    })
  }

  /**
   * @param language The language to be translated.
   * @param string The key of the language pack to be translated.
   * @returns The translated string.
   */
  public async getLanguageString(
    language: SupportedLanguages,
    string: LanguagePackKeys
  ): Query<{languageString: string}> {
    return this.client.query<{languageString: string}>({
      query: QUERY_LANG_STRING,
      variables: {
        language,
        string
      }
    })
  }
}
