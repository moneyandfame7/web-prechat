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
  }
`
/* Auth  */
export const QUERY_FETCH_COUNTRIES: DocumentNode = gql`
  query Countries($language: String!) {
    countries(language: $language) {
      code
      dial_code
      emoji
      name
    }
  }
`
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
      session {
        ...AllSessionFields
      }
    }
  }
  ${FRAGMENT_SESSION}
`

export const MUTATION_SIGN_IN: DocumentNode = gql`
  mutation SignIn($input: SignInInput!) {
    signIn(input: $input) {
      session {
        ...AllSessionFields
      }
    }
  }
  ${FRAGMENT_SESSION}
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
