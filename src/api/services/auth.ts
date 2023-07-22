import type {
  SendPhoneResponse,
  SignInInput,
  SignInResponse,
  SignUpInput,
  SignUpResponse
} from 'types/api'
import type {Mutation} from 'api/apollo'

import {
  QUERY_SEND_PHONE,
  MUTATION_SIGN_IN,
  MUTATION_SIGN_UP,
  MUTATION_TEST
} from 'api/graphql'

import {BaseService} from './base'

export interface ApiAuthMethods {
  sendPhone: (phone: string) => Mutation<{sendPhone: SendPhoneResponse}>
  signIn: (input: SignInInput) => Mutation<{signIn: SignInResponse}>
  signUp: (input: SignUpInput) => Mutation<{signUp: SignUpResponse}>
}

export class ApiAuth extends BaseService implements ApiAuthMethods {
  /**
   * @param phone Check additional user info by phone number.
   * @returns  User id or undefined.
   */
  public async sendPhone(phone: string): Mutation<{sendPhone: SendPhoneResponse}> {
    return this.client.query<{sendPhone: SendPhoneResponse}>({
      query: QUERY_SEND_PHONE,
      variables: {phone},
      fetchPolicy: 'cache-first'
    })
  }

  /**
   * @param input Input for sign in: ( token, connection, userId).
   * @returns Encoded session.
   */
  public async signIn(input: SignInInput): Mutation<{signIn: SignInResponse}> {
    return this.client.mutate<{signIn: SignInResponse}>({
      mutation: MUTATION_SIGN_IN,
      variables: {
        input
      }
    })
  }

  /**
   * @param input - Sign up input ( include input and user photo).
   * @returns  Encoded session.
   */
  public async signUp({input, photo}: SignUpInput): Mutation<{signUp: SignUpResponse}> {
    return this.client.mutate<{signUp: SignUpResponse}>({
      mutation: MUTATION_SIGN_UP,
      variables: {
        input,
        photo
      }
    })
  }

  public async test(name: string) {
    return this.client.mutate({
      mutation: MUTATION_TEST,
      variables: {
        name
      }
    })
  }
}
