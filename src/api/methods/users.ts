import type {Query} from 'api/apollo'
import type {ApiInputGetUsers, ApiInputUser, ApiUser, ApiUserFull} from 'types/api'

import {QUERY_GET_USERS, QUERY_GET_USER_FULL} from 'api/graphql'

import {ApiBaseMethod} from './base'

export class ApiUsers extends ApiBaseMethod {
  /**
   * @param input - List of user identifiers.
   * @returns Returns basic user info according to their identifiers.
   */
  public async getUsers(input: ApiInputGetUsers): Query<{getUsers: ApiUser[]}> {
    return this.client.query({
      query: QUERY_GET_USERS,
      variables: {
        input
      }
      // fetchPolicy: 'cache-first'
    })
  }

  /**
   *
   * @param input User ID.
   */
  public async getUserFullInfo(input: ApiInputUser): Query<{getUserFull: ApiUserFull}> {
    return this.client.query({
      query: QUERY_GET_USER_FULL,
      variables: {
        input
      }
    })
  }
}
