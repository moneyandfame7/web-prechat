import {type TypedDocumentNode, gql} from '@apollo/client'

import type {
  AuthSendPhoneResponse,
  AuthSignInInput,
  AuthSignInResponse,
  AuthSignUpInput,
  AuthSignUpResponse,
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
    }
  }
`

export const MUTATION_AUTH_SIGN_UP: TypedDocumentNode<
  {signUp: AuthSignUpResponse},
  {
    input: AuthSignUpInput['input']
    photo: AuthSignUpInput['photo']
  }
> = gql`
  mutation SignUp($input: SignUpInput!, $photo: Upload) {
    signUp(input: $input, photo: $photo) {
      sessionHash
    }
  }
`

export const MUTATION_AUTH_SIGN_IN: TypedDocumentNode<
  {signIn: AuthSignInResponse},
  {input: AuthSignInInput}
> = gql`
  mutation SignIn($input: SignInInput!) {
    signIn(input: $input) {
      sessionHash
    }
  }
`
