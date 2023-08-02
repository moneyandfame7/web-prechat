import {type DocumentNode, gql} from '@apollo/client'

/* Api */
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

export const FRAGMENT_USER: DocumentNode = gql`
  fragment AllUserFields on User {
    id
    firstName
    lastName
    phoneNumber
    username
    isSelf
    isContact
    isMutualContact
    fullInfo {
      avatar {
        avatarVariant
      }
      bio
    }
  }
`
/* Auth  */
export const QUERY_SEND_PHONE: DocumentNode = gql`
  query SendPhone($phone: String!) {
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
export const QUERY_LANG: DocumentNode = gql`
  query Language($language: String!) {
    language(language: $language) {
      pack
      countries {
        name
        dial_code
        emoji
        code
      }
      errors
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

/* Test subscribe */
export const SUBSCRIBE_TEST: DocumentNode = gql`
  subscription TestSubscribe {
    testSubscribed
  }
`

export const MUTATION_TEST: DocumentNode = gql`
  mutation TestMutation($name: String!) {
    testSubscription(name: $name)
  }
`

export const QUERY_SEARCH_GLOBAL: DocumentNode = gql`
  query SearchGlobal($input: SearchGlobalInput!) {
    searchGlobal(input: $input) {
      knownChats
      knownUsers
      globalChats
      globalUsers
    }
  }
`
export const QUERY_SEARCH_USERS: DocumentNode = gql`
  query SearchUsers($input: SearchGlobalInput!) {
    searchUsers(input: $input) {
      knownUsers {
        ...AllUserFields
      }
      globalUsers {
        ...AllUserFields
      }
    }
  }
  ${FRAGMENT_USER}
`

export const QUERY_GET_CONTACTS: DocumentNode = gql`
  query GetContacts {
    getContacts
  }
`

export const QUERY_GET_USERS: DocumentNode = gql`
  query GetUsers($input: GetUsersInput!) {
    getUsers(input: $input) {
      ...AllUserFields
    }
  }
  ${FRAGMENT_USER}
`

export const QUERY_GET_USER_FULL: DocumentNode = gql`
  query GetUserFull($input: UserInput!) {
    getUserFull(input: $input) {
      avatar {
        avatarVariant
        hash
        url
      }
      bio
    }
  }
`
