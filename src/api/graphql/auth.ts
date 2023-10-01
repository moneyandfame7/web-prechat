import {type TypedDocumentNode, gql} from '@apollo/client'

import {FRAGMENT_SESSION} from '.'
import type {
  ApiSession,
  AuthSendPhoneResponse,
  AuthSignInInput,
  AuthSignUpInput,
} from '../types/auth'

/**
 * Authorization / registrations gql
 */
export const QUERY_AUTH_SEND_PHONE: TypedDocumentNode<
  {sendPhone: AuthSendPhoneResponse},
  {phone: string}
> = gql`
  query SendPhone($phone: String!) {
    sendPhone(phone: $phone) {
      userId
      hasActiveSession
    }
  }
`

export const MUTATION_AUTH_SIGN_UP: TypedDocumentNode<
  {signUp: ApiSession},
  {
    input: AuthSignUpInput
  }
> = gql`
  mutation SignUp($input: SignUpInput!) {
    signUp(input: $input) {
      ...AllSessionFields
    }
  }
  ${FRAGMENT_SESSION}
`

export const MUTATION_AUTH_SIGN_IN: TypedDocumentNode<
  {signIn: ApiSession},
  {input: AuthSignInInput}
> = gql`
  mutation SignIn($input: SignInInput!) {
    signIn(input: $input) {
      ...AllSessionFields
    }
  }
  ${FRAGMENT_SESSION}
`
