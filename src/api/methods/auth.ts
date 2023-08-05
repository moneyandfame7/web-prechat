import {
  QUERY_AUTH_SEND_PHONE,
  MUTATION_AUTH_SIGN_IN,
  MUTATION_AUTH_SIGN_UP
} from '../graphql/auth'

import type {AuthSignInInput, AuthSignUpInput} from '../types/auth'

import {ApiBaseMethod} from './base'

export class ApiAuth extends ApiBaseMethod {
  /**
   * @param phone Check additional user info by phone number.
   * @returns `{userId, hasActiveSession}` or `undefined`.
   */
  public async sendPhone(phone: string) {
    const {data} = await this.client.query({
      query: QUERY_AUTH_SEND_PHONE,
      variables: {phone},
      fetchPolicy: 'cache-first'
    })

    if (!data.sendPhone) {
      return undefined
    }

    return data.sendPhone
  }

  /**
   * @param input Input for sign in: (token, connection, userId).
   * @returns Encoded session.
   */
  public async signIn(input: AuthSignInInput) {
    const {data} = await this.client.mutate({
      mutation: MUTATION_AUTH_SIGN_IN,
      variables: {
        input
      }
    })

    if (!data?.signIn) {
      return undefined
    }

    return data.signIn
  }

  /**
   * @param input - Sign up input ( include input and user photo).
   * @returns Encoded session.
   */
  public async signUp({input, photo}: AuthSignUpInput) {
    const {data} = await this.client.mutate({
      mutation: MUTATION_AUTH_SIGN_UP,
      variables: {
        input,
        photo
      }
    })
    if (!data?.signUp) {
      return undefined
    }

    return data.signUp
  }
}
