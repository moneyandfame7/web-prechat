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

export async function fetchConnection() {
  return makeRequest('connection', 'prechat-important', true, 60 * 60 * 1000)
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
