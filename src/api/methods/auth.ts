import { client } from 'api/client'
import { makeRequest } from 'api/request'
import { MUTATION_SEND_PHONE, MUTATION_SIGN_IN, MUTATION_SIGN_UP } from 'api/graphql'

import type {
  SendPhoneResponse,
  SignInInput,
  SignInResponse,
  SignUpInput,
  SignUpResponse
} from 'types/api'

/**
 * @returns Info about the user connection
 */
export async function fetchConnection() {
  return makeRequest('connection')
}

export async function sendPhone(phone: string) {
  return client.mutate<{ sendPhone: SendPhoneResponse }>({
    mutation: MUTATION_SEND_PHONE,
    variables: {
      phone
    }
  })
}

export async function signIn(input: SignInInput) {
  return client.mutate<{ signIn: SignInResponse }>({
    mutation: MUTATION_SIGN_IN,
    variables: {
      input
    }
  })
}

export async function signUp({ input, photo }: SignUpInput) {
  return client.mutate<{ signUp: SignUpResponse }>({
    mutation: MUTATION_SIGN_UP,
    variables: {
      input,
      photo
    }
  })
}
