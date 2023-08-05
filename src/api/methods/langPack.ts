import * as LangPack from 'api/graphql/langPack'
import type {ApiLangCode, GetLangStringInput} from 'api/types/langPack'

import {ApiBaseMethod} from '../base'

export class ApiLangPack extends ApiBaseMethod {
  public async getLangPack(code: ApiLangCode) {
    const {data} = await this.client.query({
      query: LangPack.QUERY_LANG_GET_PACK,
      fetchPolicy: 'cache-first',
      variables: {
        code
      }
    })
    if (!data.getLangPack) {
      throw new Error('MMMMM')
    }

    return data.getLangPack
  }

  public async getLangString(input: GetLangStringInput) {
    const {data} = await this.client.query({
      query: LangPack.QUERY_LANG_GET_STRING,
      fetchPolicy: 'cache-first',
      variables: {
        input
      }
    })
    if (!data.getLangString) {
      throw new Error('ALLALALALALA')
    }

    return data.getLangString
  }

  public async getCountriesList(code: ApiLangCode) {
    const {data} = await this.client.query({
      query: LangPack.QUERY_GET_COUNTRIES_LIST,
      fetchPolicy: 'cache-first',
      variables: {
        code
      }
    })

    if (!data.getCountriesList) {
      return undefined
    }

    return data.getCountriesList
  }

  public async getLanguage(code: ApiLangCode) {
    const {data} = await this.client.query({
      query: LangPack.QUERY_LANG_GET,
      fetchPolicy: 'cache-first',
      variables: {
        code
      }
    })
    if (!data.getLanguage) {
      return undefined
    }

    return data.getLanguage
  }

  public async getLanguages() {
    const {data} = await this.client.query({
      query: LangPack.QUERY_LANG_GET_ALL,
      fetchPolicy: 'cache-first'
    })

    if (!data.getLanguages || data.getLanguages.length === 0) {
      return undefined
    }

    return data.getLanguages
  }
}
