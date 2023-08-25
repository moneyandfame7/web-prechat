import {type DocumentNode, type TypedDocumentNode, gql} from '@apollo/client'

import type {
  ApiCountry,
  ApiLangCode,
  ApiLangPack,
  ApiLanguage,
  GetLangStringInput,
} from '../types/langPack'

export const FRAGMENT_LANGUAGE: DocumentNode = gql`
  fragment AllLangFields on Language {
    name
    nativeName
    langCode
    stringsCount
  }
`

export const QUERY_LANG_GET_ALL: TypedDocumentNode<{getLanguages: ApiLanguage[]}, void> = gql`
  query GetLanguages {
    getLanguages {
      ...AllLangFields
    }
  }
  ${FRAGMENT_LANGUAGE}
`

export const QUERY_LANG_GET: TypedDocumentNode<
  {getLanguage: ApiLanguage},
  {code: ApiLangCode}
> = gql`
  query GetLanguage($code: String!) {
    getLanguage(code: $code) {
      ...AllLangFields
    }
  }
  ${FRAGMENT_LANGUAGE}
`

export const QUERY_LANG_GET_PACK: TypedDocumentNode<
  {getLangPack: ApiLangPack},
  {code: ApiLangCode}
> = gql`
  query GetLangPack($code: String!) {
    getLangPack(code: $code) {
      strings
      langCode
    }
  }
`

export const QUERY_LANG_GET_STRING: TypedDocumentNode<
  {getLangString: string},
  {input: GetLangStringInput}
> = gql`
  query GetLangString($input: GetLangStringInput!) {
    getLangString(input: $input)
  }
`

export const QUERY_GET_COUNTRIES_LIST: TypedDocumentNode<
  {getCountriesList: ApiCountry[]},
  {code: ApiLangCode}
> = gql`
  query GetCountriesList($code: String!) {
    getCountriesList(code: $code) {
      name
      dial_code
      emoji
      code
    }
  }
`
