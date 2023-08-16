import {ApolloClient} from 'api/client'
import {MUTATION_AUTH_SIGN_IN} from 'api/graphql'

export async function signIn(input: {phone: string}) {
  return ApolloClient.client.mutate({
    mutation: MUTATION_AUTH_SIGN_IN,
    variables: {
      input
    } as any
  })
}

export async function test() {
  throw new Error('Not implemented #test')
}
