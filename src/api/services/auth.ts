import type {ApolloClient, NormalizedCacheObject} from '@apollo/client'

import type {
  SendPhoneResponse,
  SignInInput,
  SignInResponse,
  SignUpInput,
  SignUpResponse
} from 'types/api'

import {
  MUTATION_SEND_PHONE,
  MUTATION_SIGN_IN,
  MUTATION_SIGN_UP
} from 'api/graphql'

export class ApiAuth {
  public constructor(
    private readonly client: ApolloClient<NormalizedCacheObject>
  ) {}

  public async sendPhone(phone: string) {
    return this.client.mutate<{sendPhone: SendPhoneResponse}>({
      mutation: MUTATION_SEND_PHONE,
      variables: {
        phone
      }
    })
  }

  public async signIn(input: SignInInput) {
    return this.client.mutate<{signIn: SignInResponse}>({
      mutation: MUTATION_SIGN_IN,
      variables: {
        input
      }
    })
  }

  public async signUp({input, photo}: SignUpInput) {
    return this.client.mutate<{signUp: SignUpResponse}>({
      mutation: MUTATION_SIGN_UP,
      variables: {
        input,
        photo
      }
    })
  }
}
