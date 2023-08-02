import type {TwoFactorAuth} from 'types/api'
import type {Query} from 'api/apollo'
import {QUERY_GET_TWO_FA} from 'api/graphql'

import {BaseService} from './base'

export interface ApiTwoFaMethods {
  getTwoFa: (token: string) => Query<{getTwoFa?: TwoFactorAuth}>
}
export class ApiTwoFa extends BaseService implements ApiTwoFaMethods {
  /**
   *
   * @param token - Firebase token after successful code verification
   * @returns Info about User 2FA ( hint?, email )
   */
  public async getTwoFa(token: string): Query<{getTwoFa?: TwoFactorAuth}> {
    return this.client.query<{getTwoFa?: TwoFactorAuth}>({
      query: QUERY_GET_TWO_FA,
      variables: {
        token
      }
    })
  }
}
