import { DocumentNode, gql } from '@apollo/client'

export const FRAGMENT_SESSION: DocumentNode = gql`
  fragment AllSessionFields on Session {
    id
    ip
    region
    country
    platform
    browser
    createdAt
    activeAt
    userId
  }
`
/* Auth  */

export const MUTATION_SEND_PHONE: DocumentNode = gql`
  mutation SendPhone($phone: String!) {
    sendPhone(phone: $phone) {
      userId
    }
  }
`

export const MUTATION_SIGN_UP: DocumentNode = gql`
  mutation SignUp($input: SignUpInput!, $photo: Upload) {
    signUp(input: $input, photo: $photo) {
      session
    }
  }
`

export const MUTATION_SIGN_IN: DocumentNode = gql`
  mutation SignIn($input: SignInInput!) {
    signIn(input: $input) {
      session
    }
  }
`

/* 2FA */
export const QUERY_GET_TWO_FA: DocumentNode = gql`
  query GetTwoFa($token: String!) {
    getTwoFa(token: $token) {
      hint
      email
    }
  }
`

/* Settings */
// export const MUTATION_UPLOAD_AVATAR: DocumentNode = gql``
export const QUERY_LANG: DocumentNode = gql`
  query Language($language: String!) {
    language(language: $language) {
      pack
    }
  }
`
export const QUERY_LANG_WITH_COUNTRIES: DocumentNode = gql`
  query Language($language: String!) {
    language(language: $language) {
      countries {
        name
        dial_code
        emoji
        code
      }
      pack
    }
  }
`
export const QUERY_LANG_STRING: DocumentNode = gql`
  query LanguageString($language: String!, $string: String!) {
    languageString(language: $language, string: $string)
  }
`

export const QUERY_COUNTRIES: DocumentNode = gql`
  query Countries($language: String!) {
    language(language: $language) {
      countries {
        name
        dial_code
        emoji
        code
      }
    }
  }
`
