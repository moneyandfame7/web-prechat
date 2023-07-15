import {client} from 'api/client'
import {MUTATION_TEST, QUERY_GET_TWO_FA, SUBSCRIBE_TEST} from 'api/graphql'
import type {TwoFactorAuth} from 'types/api'

export async function getTwoFa(token: string) {
  return client.query<{getTwoFa?: TwoFactorAuth}>({
    query: QUERY_GET_TWO_FA,
    variables: {
      token
    }
  })
}
export async function testSubscribe() {
  return client
    .subscribe<{testSubscribed: string}>({
      query: SUBSCRIBE_TEST
    })
    .subscribe({
      next: (response) => {
        console.log(response.data, 'SUBSCRIBE RESPONSE')
      },
      error: (error) => {
        console.error(error, 'SUBSCRIBE ERROR')
      }
    })
}

export async function testMutation(name: string) {
  return client.mutate({
    mutation: MUTATION_TEST,
    variables: {
      name
    }
  })
}
// export async function validatePassword(password: string) {}

// export async function updatePassword(password: string) {}

// /* Only if authorized */
// export async function disablePassword(password: string) {}

// /* The code that was sent to the mail  */
// export async function recoverPassword(code: string) {}

// export async function sendCodeToEmail(email: string) {}
