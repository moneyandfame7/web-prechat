import { client } from 'api/client'
import { QUERY_GET_TWO_FA } from 'api/graphql'
import type { TwoFactorAuth } from 'types/api'

export async function getTwoFa(token: string) {
  return client.query<{ getTwoFa?: TwoFactorAuth }>({
    query: QUERY_GET_TWO_FA,
    variables: {
      token
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
