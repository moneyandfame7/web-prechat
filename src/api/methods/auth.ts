import { client } from 'api/client'
import { makeRequest } from 'api/request'
import {
  MUTATION_SEND_PHONE,
  MUTATION_SIGN_IN,
  MUTATION_SIGN_UP,
  QUERY_FETCH_COUNTRIES
} from 'api/graphql'

import type {
  Country,
  SendPhoneResponse,
  SignInInput,
  SignInResponse,
  SignUpInput,
  SignUpResponse
} from 'types/api'
import type { SupportedLanguages } from 'types/lib'

export async function fetchCountries(language: SupportedLanguages) {
  const {
    data: { countries }
  } = await client.query<{
    countries: Country[]
  }>({
    query: QUERY_FETCH_COUNTRIES,
    fetchPolicy: 'cache-first',
    variables: {
      language
    }
  })
  return { countries }
}

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
